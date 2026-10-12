import { Routes, Route } from "react-router";
import { AppProvider } from "@/state/app";
import Home from "./pages/Home";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </AppProvider>
  );
}
