import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest(".galleryBtn")) {
        navigate("/SelectFrame");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [navigate]);

  return (
    <div className="home-background">
      <img
        src="images/galleryBtn.png"
        alt="Gallery"
        className="galleryBtn"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation(); // 부모 요소의 클릭 이벤트가 실행되지 않도록 방지
          navigate("/Gallery");
        }}
      />
    </div>
  );
};

export default Home;
