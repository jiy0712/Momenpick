import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import "./PictureSize1.css";

const base64ToBlob = (base64) => {
const byteString = atob(base64.split(",")[1]);
const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
const ab = new ArrayBuffer(byteString.length);
const ia = new Uint8Array(ab);
for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
}
return new Blob([ab], { type: mimeString });
};

const PictureSize1 = () => {
const webcamRef = useRef(null);
const resultZoneRef = useRef(null);
const navigate = useNavigate();
const [showModal, setShowModal] = useState(true);
const [countdown, setCountdown] = useState(10);
const [photoCount, setPhotoCount] = useState(0);
const [capturedImages, setCapturedImages] = useState([]);
const [capturedImageUrls, setCapturedImageUrls] = useState([]);
const [imagesLoaded, setImagesLoaded] = useState(false);
const [finalImageBlob, setFinalImageBlob] = useState(null); // 최종 이미지 저장용
const { frame } = useParams();

const frameImages = {
    designer: "/images/designer1.png",
    developer: "/images/developer1.png",
    summer1: "/images/summer1-1.png",
    summer2: "/images/summer2-1.png",
    summer3: "/images/summer3-1.png",
    teacher1: "/images/white1.png",
    teacher2: "/images/ham1.png",
    teacher3: "/images/lee1.png",
};

const poseImages = {
    teacher1: ["/images/white1-1.png", "/images/white1-2.png", "/images/white1-3.png", "/images/white1-4.png"],
    teacher2: ["/images/ham1-1.png", "/images/ham1-2.png", "/images/ham1-3.png", "/images/ham1-4.png"],
    teacher3: ["/images/lee1-1.png", "/images/lee1-2.png", "/images/lee1-3.png", "/images/lee1-4.png"],
};

// capturedImages Blob -> Blob URL 캐싱 및 관리
useEffect(() => {
    const urls = capturedImages.map((blob) => URL.createObjectURL(blob));
    setCapturedImageUrls(urls);

    return () => {
    urls.forEach((url) => URL.revokeObjectURL(url));
    };
}, [capturedImages]);

const takePhoto = useCallback(() => {
    if (photoCount < 4) {
    capturePhoto();
    setCountdown(10);
    setPhotoCount((prevCount) => prevCount + 1);
    }
}, [photoCount]);

useEffect(() => {
    if (showModal) {
    const modalTimer = setTimeout(() => setShowModal(false), 3000);
    return () => clearTimeout(modalTimer);
    }

    if (countdown > 0 && photoCount < 4) {
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
    } else if (countdown === 0 && photoCount < 4) {
    takePhoto();
    }
}, [countdown, photoCount, showModal, takePhoto]);

const capturePhoto = () => {
    if (webcamRef.current) {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
        const imageBlob = base64ToBlob(imageSrc);
        setCapturedImages((prevImages) => [...prevImages, imageBlob]);
    }
    }
};

// 개선된 이미지 로딩 대기 함수
const waitForImagesToLoad = (element) => {
    const images = element.querySelectorAll("img");
    const promises = Array.from(images).map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
        console.warn('Image load timeout:', img.src);
        resolve();
        }, 5000); // 5초 타임아웃
        
        img.onload = () => {
        clearTimeout(timeout);
        resolve();
        };
        img.onerror = () => {
        clearTimeout(timeout);
        console.error('Image load error:', img.src);
        resolve();
        };
    });
    });
    return Promise.all(promises);
};

// 직접 캔버스에 그려서 정확한 결과물 생성
const captureResultZoneAsBlob = useCallback(async () => {
    if (!resultZoneRef.current || capturedImageUrls.length !== 4) {
    console.error('Result zone ref is null or images not ready');
    return null;
    }

    try {
    console.log('Starting manual canvas creation...');
    
    // 결과 영역 크기 (CSS에서 정의된 크기)
    const canvasWidth = 295;
    const canvasHeight = 881;
    
    // 캔버스 생성
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    const ctx = canvas.getContext('2d');

    // 모든 그리기 작업 전에 스케일 조정
    ctx.scale(scale, scale);
    
    // 프레임 이미지 미리 로드 (그리기는 나중에)
    const frameImg = new Image();
    frameImg.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
        frameImg.onload = resolve;
        frameImg.onerror = reject;
        frameImg.src = frameImages[frame];
    });
    
    // 각 캡처된 이미지를 먼저 그리기
    const positions = [
        { x: 23, y: 55, width: 249, height: 187 }, // photo1
        { x: 23, y: 250, width: 249, height: 187 }, // photo2
        { x: 23, y: 445, width: 249, height: 187 }, // photo3
        { x: 23, y: 640, width: 249, height: 187 }  // photo4
    ];
    
    for (let i = 0; i < capturedImageUrls.length; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = capturedImageUrls[i];
        });
        
        const pos = positions[i];
        
        // object-fit: cover 효과를 수동으로 구현
        const imgAspect = img.width / img.height;
        const targetAspect = pos.width / pos.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > targetAspect) {
        // 이미지가 더 넓음 - 높이를 맞추고 가로를 잘라냄
        drawHeight = pos.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (pos.width - drawWidth) / 2;
        offsetY = 0;
        } else {
        // 이미지가 더 높음 - 너비를 맞추고 세로를 잘라냄
        drawWidth = pos.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (pos.height - drawHeight) / 2;
        }
        
        // 클리핑 영역 설정
        ctx.save();
        ctx.beginPath();
        ctx.rect(pos.x, pos.y, pos.width, pos.height);
        ctx.clip();
        
        // 이미지 그리기
        ctx.drawImage(
        img,
        pos.x + offsetX,
        pos.y + offsetY,
        drawWidth,
        drawHeight
        );
        
        ctx.restore();
    }
    
    // 모든 사진을 그린 후 마지막에 프레임 그리기 (프레임이 맨 위에 오도록)
    ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
    
    console.log('Manual canvas creation completed');
    
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
        if (blob) {
            console.log('Blob created successfully, size:', blob.size);
        } else {
            console.error('Failed to create blob');
        }
        resolve(blob);
        }, "image/png", 1.0);
    });
    } catch (error) {
    console.error('Manual canvas creation error:', error);
    return null;
    }
}, [capturedImageUrls, frame, frameImages]);

// 이미지 프리로딩 효과
useEffect(() => {
    const preloadImages = async () => {
    const imagesToLoad = [
        frameImages[frame],
        ...(frame.startsWith("teacher") ? poseImages[frame] : [])
    ].filter(Boolean);

    const promises = imagesToLoad.map((src) => {
        return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
        });
    });

    await Promise.all(promises);
    setImagesLoaded(true);
    console.log('All images preloaded');
    };

    preloadImages();
}, [frame, frameImages, poseImages]);

useEffect(() => {
    if (photoCount === 4 && imagesLoaded) {
    const saveFinalImage = async () => {
        console.log('Starting final capture for saving...');
        const resultBlob = await captureResultZoneAsBlob();
        if (resultBlob) {
        setFinalImageBlob(resultBlob);
        console.log('Final image saved to state');

        try{
            const storage = getStorage();
            const imageName = `photo_${Date.now()}.png`;
            const imageRef = ref(storage, `images/${imageName}`);
            await uploadBytes(imageRef, resultBlob);

            const db = getFirestore();
            await addDoc(collection(db, "emails"), {
            imagePath: `images/${imageName}`,
            timestamp: Date.now(),
            });
        }catch (error) {
            console.error('저장 중 오류 : ', error);
        }
        setTimeout(() => {
            const imageUrl = URL.createObjectURL(resultBlob);
            navigate('/Email', { state: {
                                    previewImageUrl: imageUrl,
                                    frameSize: 'size1'
                                }
            });
        }, 1000);
        } else {
        console.error('Failed to capture result zone');
        }
    };

    // 더 긴 대기 시간
    const timer = setTimeout(saveFinalImage, 2000);
    return () => clearTimeout(timer);
    }
}, [photoCount, captureResultZoneAsBlob, imagesLoaded, navigate]);

return (
    <div className="PictureSize1-container">
    {showModal && <div className="PictureSize1-dark-overlay" />}
    {showModal && (
        <div className="PictureSize1-modal">
        <div className="PictureSize1-modal-content">
            <img className="PictureSize1-picIcon" src="/images/pictureIcon.png" alt="사진 아이콘" />
            <h2 className="PictureSize1-text1">잠시 후 촬영이 시작됩니다</h2>
            <p className="PictureSize1-text2">
            촬영 횟수는 <span className="PictureSize1-text3">총 4회</span> 입니다.
            </p>
        </div>
        </div>
    )}

    <div className="PictureSize1-Picture-background">
        <div className="PictureSize1-photoZone">
        {photoCount < 4 ? (
            <p className="PictureSize1-Photo-countdown">{countdown}</p>
        ) : (
            <p className="PictureSize1-Photo-countdown" style={{ visibility: "hidden" }}>0</p>
        )}
        <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="PictureSize1-photo"
            mirrored
        />
        {frame.startsWith("teacher") && photoCount < 4 && (
  <img
    src={poseImages[frame][photoCount]}
    alt={`${frame} 포즈 ${photoCount + 1}`}
    className={`PictureSize1-teacherPose ${frame === "teacher1" ? "teacher1-special" : ""}`}
    crossOrigin="anonymous"
  />
)}
        </div>

        <div className="PictureSize1-resultZone" ref={resultZoneRef}>
        <img
            src={frameImages[frame] || ""}
            alt={`${frame} 프레임`}
            className="PictureSize1-frame"
            crossOrigin="anonymous"
        />
        {capturedImageUrls.map((url, index) => (
            <img
            key={index}
            src={url}
            alt={`Captured ${index + 1}`}
            className={`PictureSize1-photo${index + 1}`}
            crossOrigin="anonymous"
            />
        ))}
        </div>
    </div>
    </div>
);
};

export default PictureSize1;