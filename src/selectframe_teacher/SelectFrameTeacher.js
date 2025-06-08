import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelectFrameTeacher.css";

const SelectFrameTeacher = () => {
 const navigate = useNavigate();

 const goToResult = (design) => {
  navigate(`/selectsize/${design}`); // 선택한 직업을 URL에 전달
 }
 
  return (
    <div className="selectFrameTeacher-background">
      <div className="select-header">
        <button
          onClick={() => navigate("/SelectFrame")}
          className="backBtn"
        > &lt; Back
        </button>
      </div>
      <div className="select-row">
        <img
          className="teacher1"
          src="/images/whiteSelect.png" 
          alt="이하얀 선생님"
          onClick={() => goToResult("teacher1")}
          style={{ cursor: "pointer" }}
        />
        <img
            className="teacher2"
            src="/images/hamSelect.png" 
            alt="함기훈 선생님"
            onClick={() => goToResult("teacher2")}
            style={{ cursor: "pointer" }}
        />
        <img
            className="teacher3"
            src="/images/leeSelect.png" 
            alt="이철호 선생님"
            onClick={() => goToResult("teacher3")}
            style={{ cursor: "pointer" }}
        />
      </div>
      
    </div>
  );
};

export default SelectFrameTeacher;
