import { BrowserRouter, Routes, Route } from 'react-router-dom'

import GuestCurrentBookings from './guest/GuestCurrentBookings'
import GuestMain from './guest/GuestMain'
import GuestProfile from './guest/GuestProfile'
import GuestRestaurantMap from './guest/GuestRestaurantMap'
import Login from './login/Login'
import GuestSignUp from './login/GuestSignUp'
import OwnerSignUp from './login/OwnerSignUp'
import OwnerMain from './owner/OwnerMain'
import OwnerRestaurantDetails from './owner/OwnerRestaurantDetails'
import OnwerRestaurantProfileEdit from './owner/OwnerRestaurantProfileEdit'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signupGuest" element={<GuestSignUp />} />
                <Route path="/signupRestaurant" element={<OwnerSignUp />} />
                <Route
                    path="/guest/main"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        !JSON.parse(localStorage.getItem('isOwner')) && (
                            <GuestMain />
                        )
                    }
                />
                <Route
                    path="/guest/profile"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        !JSON.parse(localStorage.getItem('isOwner')) && (
                            <GuestProfile />
                        )
                    }
                />
                <Route
                    path="/guest/restaurant/map"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        !JSON.parse(localStorage.getItem('isOwner')) && (
                            <GuestRestaurantMap />
                        )
                    }
                />
                <Route
                    path="/guest/currentBookings"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        !JSON.parse(localStorage.getItem('isOwner')) && (
                            <GuestCurrentBookings />
                        )
                    }
                />
                <Route
                    path="/owner/main"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        JSON.parse(localStorage.getItem('isOwner')) && (
                            <OwnerMain />
                        )
                    }
                />
                <Route
                    path="/owner/restaurant/details"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        JSON.parse(localStorage.getItem('isOwner')) && (
                            <OwnerRestaurantDetails />
                        )
                    }
                />
                <Route
                    path="/owner/restaurant/edit"
                    element={
                        JSON.parse(localStorage.getItem('isLoggedIn')) &&
                        JSON.parse(localStorage.getItem('isOwner')) && (
                            <OnwerRestaurantProfileEdit />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
