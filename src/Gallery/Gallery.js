import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storage = getStorage();
        const listRef = ref(storage, 'gallery/');
        const res = await listAll(listRef);

        const urlPromises = res.items.map(itemRef => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);

        const sortedUrls = urls.sort((a, b) => {
          const getTime = (url) => {
            const match = url.match(/photo_(\d+)\.png/);
            return match ? parseInt(match[1]) : 0;
          };
          return getTime(b) - getTime(a);
        });

        setImageUrls(sortedUrls);
      } catch (error) {
        console.error("사진 불러오기 오류 : ", error);
      }
    };

    fetchImages();
  }, []);

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="gallery-background">
      <div className="select-header">
        <button onClick={handleBackClick} className="backBtn">
          &lt; Back
        </button>
        <img
          src="images/galleryLogo.png"
          alt="GalleryLogo"
          className="galleryLogo"
        />
      </div>

      <div className="gallery-content">
        {imageUrls.length === 0 ? (
          <p></p>
        ) : (
          imageUrls.map((url, index) => (
            <div className="gallery-item-wrapper" key={index}>
              <div className="sticker"></div>
              <img
                src={url}
                alt={`Gallery Image ${index + 1}`}
                className="gallery-image"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;
