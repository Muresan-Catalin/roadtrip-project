import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuildItineraryPage from "./pages/BuildItineraryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/build" element={<BuildItineraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
