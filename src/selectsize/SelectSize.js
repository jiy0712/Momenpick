import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SelectSize.css";

function SelectSize() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);
    const { design } = useParams();

    console.log("현재 선택된 직업:", design);

    const images = {
        designer: ["/images/ex_designer1.png", "/images/ex_designer2.png"],
        developer: ["/images/ex_developer1.png", "/images/ex_developer2.png"],
        summer1: ["/images/ex_summer1-1.png", "/images/ex_summer1-2.png"],
        summer2: ["/images/ex_summer2-1.png", "/images/ex_summer2-2.png"],
        summer3: ["/images/ex_summer3-1.png", "/images/ex_summer3-2.png"],
        teacher1: ["/images/ex_white1.png", "/images/ex_white2.png"],
        teacher2: ["/images/ex_ham1.png", "/images/ex_ham2.png"],
        teacher3: ["/images/ex_lee1.png", "/images/ex_lee2.png"],
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate("/");
        }, 30000);        // 30초 이후에는 /화면으로 이동

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, [navigate]);

    const handleImageClick = (size) => {
        navigate(`/PictureSize${size}/${design}`);
    };

    const handleBackClick = () => {
        if (design.startsWith("summer")) {
            navigate("/Summer");
        } else if(design.startsWith("teacher")) {
            navigate("/Teacher");
        }else {
            navigate("/SelectFrame");
        }
    };

    return (
        <div className="selectSize-background">
            <div className="select-header">
                <button
                    onClick={handleBackClick}
                    className="backBtn"
                > &lt; Back
                </button>
                <div id="title">프레임 크기를 선택해주세요.</div>
                <div className="countdown-timer">{countdown}</div>
            </div>
            <div className="select-body">
                <img
                    alt="세로형"
                    className="size1"
                    src={images[design] ? images[design][0] : ""}
                    onClick={() => handleImageClick(1)}
                />
                <img
                    alt="가로형"
                    className="size2"
                    src={images[design] ? images[design][1] : ""}
                    onClick={() => handleImageClick(2)}
                />
            </div>
            
        </div>
    );
}

export default SelectSize;
