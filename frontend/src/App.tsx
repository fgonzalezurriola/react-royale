import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";
import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <PageHeader />
      
      <Routes>
        <Route path="/" element={<LandingPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
