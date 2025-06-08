import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelectFrame.css";

const SelectFrame = () => {
    const navigate = useNavigate();

    const goToResult = (design) => {
        navigate(`/selectsize/${design}`); // 선택한 직업을 URL에 전달
      };

    return(
        <div className="selectFrame-background">
            <div className="main-row">
                <div className="column">
                    <img
                        className="designer"
                        src="/images/designerSelect.png" 
                        alt="Designer"
                        onClick={() => goToResult("designer")}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                <div className="column">
                    <img
                        className="developer"
                        src="/images/developerSelect.png" 
                        alt="Developer"
                        onClick={() => goToResult("developer")}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                <div className="right-col">
                    <img
                        className="teacher"
                        src="/images/teacherSelect.png" 
                        alt="Teacher"
                        onClick={() => navigate("/Teacher")}
                        style={{ cursor: "pointer" }}
                    />
                    <img
                        className="summer"
                        src="/images/summerSelect.png" 
                        alt="Summer"
                        onClick={() => navigate("/Summer")}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </div>
            
            
        </div>
    );
};

export default SelectFrame;
