import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AllListings from "./pages/AllListings";
import ContactListing from "./pages/ContactListing";
import EditListing from "./pages/EditListing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManageListing from "./pages/ManageListing";
import NewListing from "./pages/NewListing";
import Profile from "./pages/Profile";
import ShowListing from "./pages/ShowListing";
import Signup from "./pages/Signup";
// import AntiGravityHub from "./pages/AntiGravityHub";
import ChatBot from "./components/ChatBot";
import PricePredict from "./pages/PricePredict";

function App() {
  return (
    <div className="min-h-screen">
      <ChatBot/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/listings" element={<AllListings />} />
          <Route path="/listings/:id" element={<ShowListing />} />
          <Route path="/listing/:id" element={<ShowListing />} />
          <Route path="/predict" element={<PricePredict />} />

          <Route
            path="/listings/:id/contact"
            element={
              <ProtectedRoute>
                <ContactListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/new"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <NewListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newListing"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <Navigate to="/listings/new" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:id/manage"
            element={
              <ProtectedRoute>
                <ManageListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:id/edit"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/ai-hub" element={<AntiGravityHub />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
