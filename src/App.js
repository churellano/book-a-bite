import { BrowserRouter, Routes, Route } from "react-router-dom";

import GuestCurrentBookings from "./guest/GuestCurrentBookings";
import GuestMain from "./guest/GuestMain";
import GuestProfile from "./guest/GuestProfile";
import Login from "./login/Login";
import SignUp from "./login/SignUp";
import OwnerMain from "./owner/OwnerMain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="login/signup" element={<SignUp />} />
        <Route path="guest/main" element={<GuestMain />} />
        <Route path="guest/profile" element={<GuestProfile />} />
        <Route
          path="guest/currentBookings"
          element={<GuestCurrentBookings />}
        />
        <Route path="owner/main" element={<OwnerMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;