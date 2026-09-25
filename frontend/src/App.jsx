import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import useAuth from "./hooks/useAuth";
import { jwtDecode } from "jwt-decode";

import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";

import Trip from "./pages/trips/Trip";
import AddTrip from "./pages/trips/AddTrip";
import EditTrip from "./pages/trips/EditTrip";
import TripDetails from "./pages/trips/TripDetails";

import Baggage from "./pages/baggage/Baggage";
import BaggageDetail from "./pages/baggage/BaggageDetail";

import AcceptInvitation from "./pages/AcceptInvitation";

// Itineraries
import Itinerary from "./pages/itineraries/Itinerary";
import ItineraryDetail from "./pages/itineraries/ItineraryDetail";
import EditItinerary from "./pages/itineraries/EditItinerary";

const App = () => {
  const { token, onLogout } = useAuth();

  const ProtectedRoutes = () => {
    try {
      const decodedToken = token ? jwtDecode(token) : null;
      const userId = decodedToken?.userId;

      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000;

        if (currentTime > decodedToken.exp) {
          onLogout();
          return <Navigate to="/login" />;
        }
      }

      if (!token || !userId) {
        onLogout();
        return <Navigate to="/login" />;
      }

      return <AppLayout />;
    } catch (error) {
      console.error(error);
      onLogout();
      return <Navigate to="/login" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Trips */}
          <Route
            path="/trips"
            element={<Trip />}
          />

          <Route
            path="/trips/add"
            element={<AddTrip />}
          />

          <Route
            path="/trips/:id"
            element={<TripDetails />}
          />

          <Route
            path="/trips/edit/:id"
            element={<EditTrip />}
          />

          {/* Baggage */}
          <Route
            path="/baggage"
            element={<Baggage />}
          />

          <Route
            path="/baggage/:id"
            element={<BaggageDetail />}
          />

          {/* Invitation */}
          <Route
            path="/trips/:id/invite/accept"
            element={<AcceptInvitation />}
          />

          {/* ============================= */}
          {/* ITINERARIES */}
          {/* ============================= */}

          {/* Itinerary List */}
          <Route
            path="/itineraries"
            element={<Itinerary />}
          />

          {/* Add Itinerary */}
          <Route
            path="/itineraries/new"
            element={<EditItinerary />}
          />

          {/* Itinerary Details */}
          <Route
            path="/itineraries/:id"
            element={<ItineraryDetail />}
          />

          {/* Edit Itinerary */}
          <Route
            path="/itineraries/:id/edit"
            element={<EditItinerary />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;