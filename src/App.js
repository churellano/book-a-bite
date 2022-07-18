import { BrowserRouter, Routes, Route } from "react-router-dom";

import GuestCurrentBookings from "./guest/GuestCurrentBookings";
import GuestMain from "./guest/GuestMain";
import GuestProfile from "./guest/GuestProfile";
import GuestRestaurantMap from "./guest/GuestRestaurantMap";
import Login from "./login/Login";
import GuestSignUp from "./login/GuestSignUp";
import OwnerSignUp from "./login/OwnerSignUp";
import OwnerMain from "./owner/OwnerMain";
import OwnerRestaurantMap from "./owner/OwnerRestaurantMap";
import OwnerRestaurantProfile from "./owner/OwnerRestaurantProfile";
import OwnerRestaurantDetails from "./owner/OwnerRestaurantDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signupGuest" element={<GuestSignUp />} />
        <Route path="/signupRestaurant" element={<OwnerSignUp />} />
        <Route path="/guest/main" element={<GuestMain />} />
        <Route path="/guest/profile" element={<GuestProfile />} />
        <Route path="/guest/restaurant/map" element={<GuestRestaurantMap />} />
        <Route
          path="/guest/currentBookings"
          element={<GuestCurrentBookings />}
        />
        <Route path="/owner/main" element={<OwnerMain />} />
        <Route path="/owner/restaurant/details" element={<OwnerRestaurantDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
