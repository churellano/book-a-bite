import { BrowserRouter, Routes, Route } from "react-router-dom";

import GuestCurrentBookings from "./guest/GuestCurrentBookings";
import GuestMain from "./guest/GuestMain";
import GuestProfile from "./guest/GuestProfile";
import GuestRestaurantMap from "./guest/GuestRestaurantMap";
import OwnerMain from "./owner/OwnerMain";
import OwnerRestaurantMap from "./owner/OwnerRestaurantMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="guest/main" element={<GuestMain />} />
        <Route path="guest/profile" element={<GuestProfile />} />
        <Route path="guest/restaurant/map" element={<GuestRestaurantMap />} />
        <Route
          path="guest/currentBookings"
          element={<GuestCurrentBookings />}
        />
        <Route path="owner/main" element={<OwnerMain />} />
        <Route path="owner/map/create" element={<OwnerRestaurantMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;