import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";
import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubmitComponent from "./pages/SubmitComponent";
import { Login2 } from "./components/login-form";
import { Signup2 } from "./components/signup-form";
import { OptionVote } from "./pages/OptionVote.tsx";

function App() {
  return (
    <BrowserRouter>
      <PageHeader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<SubmitComponent />} />

        <Route path="/login" element={<Login2 />} />
        <Route path="/signup" element={<Signup2 />} />
        <Route path="/hackaton/:id" element={<OptionVote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
