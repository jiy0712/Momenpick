import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Main from "./main/Main";
import SelectFrame from "./selectframe/SelectFrame";
import SelectSize from "./selectsize/SelectSize";
import SelectFrameTeacher from "./selectframe_teacher/SelectFrameTeacher";
import SelectFrameSummer from "./selectframe_summer/SelectFrameSummer";
import PictureSize1 from "./picturesize1/PictureSize1";
import PictureSize2 from "./picturesize2/PictureSize2";
import Email from "./Email/Email";
import Finish from "./Finish/Finish";
import Gallery from "./Gallery/Gallery";

function App() {

  return (
    <Router>
      <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Main />} />
          <Route path="*" element={<Navigate to="/" replace />} />  {/* 잘못된 경로일 경우 Main으로 리다이렉트 */}
          <Route path="/selectFrame" element={<SelectFrame /> } />
          <Route path="/selectSize/:design" element={<SelectSize />} />
          <Route path="/Teacher" element={<SelectFrameTeacher /> } />
          <Route path="/Summer" element={<SelectFrameSummer /> } />
          <Route path="/PictureSize1/:frame" element={<PictureSize1 /> } />
          <Route path="/PictureSize2/:frame" element={<PictureSize2 /> } />
          <Route path="/Email" element={<Email /> } />
          <Route path="/Finish" element={<Finish /> } />
          <Route path="/Gallery" element={<Gallery /> } />

      </Routes>
    </Router>
  );
}

export default App;
