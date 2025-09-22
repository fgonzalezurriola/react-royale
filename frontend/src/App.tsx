import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";
import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubmitComponent from "./pages/SubmitComponent";
import { Login2 } from "./components/login-form";
import { Signup2 } from "./components/signup-form";
import { ListSubmissions } from "./pages/ListSubmissions.tsx";
import { SubmissionDetail } from "./pages/SubmissionDetails.tsx";

function App() {
  return (
    <BrowserRouter>
      <PageHeader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<SubmitComponent />} />

        <Route path="/login" element={<Login2 />} />
        <Route path="/signup" element={<Signup2 />} />
        <Route path="/hackaton/:id" element={<ListSubmissions />} />
        <Route path="/hackaton/:id/submission/:submissionId" element={<SubmissionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
