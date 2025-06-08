import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Finish.css";

const Finish = () => {
    const navigate = useNavigate();
    
    const [countdown, setCountdown] = useState(5); 
    useEffect(() => {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
    
        const timeout = setTimeout(() => {
          navigate("/");
        }, 5000);
    
        return () => {
          clearInterval(timer);
          clearTimeout(timeout);
        };
      }, [navigate]);

    return (
      <div className="finish-background">
        <div className="finish-header">
            <div className="fin1">Pick Your Best Moment!</div>
            <div className="fin2">이용해주셔서 감사합니다 ♥</div>
        </div>
        <img
            src="images/galleryBtn.png"
            alt="Gallery"
            className="finishPhoto"
            style={{ cursor: "pointer" }}
        />
        <div className="finish-timer">{countdown}초 뒤 메인화면으로 돌아갑니다</div>

      </div>
    );
  };
  
  export default Finish;
  