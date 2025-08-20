import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import AuthContext from "./context/AuthContext.jsx";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="pt-5"> {/* padding for navbar */}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

