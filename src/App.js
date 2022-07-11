import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Main from "./guest/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="guest/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App