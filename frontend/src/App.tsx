import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";
import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubmitComponent from "./pages/SubmitComponent";

function App() {
  return (
    <BrowserRouter>
      <PageHeader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<SubmitComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
