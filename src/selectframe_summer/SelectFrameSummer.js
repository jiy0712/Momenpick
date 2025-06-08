import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelectFrameSummer.css";

const SelectFrameSummer = () => {
 const navigate = useNavigate();

 const goToResult = (design) => {
  navigate(`/selectsize/${design}`); // 선택한 직업을 URL에 전달
};

  return (
    <div className="selectFrameSummer-background">
      <div className="select-header">
        <button
            onClick={() => navigate("/SelectFrame")}
            className="backBtn"
          > &lt; Back
          </button>
      </div>
      <div className="select-row">
        <img
          className="summer1"
          src="/images/summer1.png" 
          alt="여름1"
          onClick={() => goToResult("summer1")}
          style={{ cursor: "pointer" }}
        />
        <img
            className="summer2"
            src="/images/summer2.png" 
            alt="여름2"
            onClick={() => goToResult("summer2")}
            style={{ cursor: "pointer" }}
        />
        <img
            className="summer3"
            src="/images/summer3.png" 
            alt="여름3"
            onClick={() => goToResult("summer3")}
            style={{ cursor: "pointer" }}
        />
      </div>
      
    </div>
  );
};

export default SelectFrameSummer;
