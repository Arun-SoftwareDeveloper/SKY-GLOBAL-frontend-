import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import DashBoard from "./Components/DashBoard";
import useAuthentication from "./Components/UserAuthendication";
import NotFound from "./Components/NotFound";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const { authenticated, login, logout } = useAuthentication();

  // const handleLogin = async (credentials) => {
  //   await login(credentials);
  // };
  const handleLogin = (token) => {
    Navigate("/dashboard"); // Redirect to dashboard after successful login
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <RegisterForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )
            }
          />
          <Route
            path="/login"
            element={
              <LoginForm
                handleLogin={handleLogin}
                authenticated={authenticated}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<DashBoard />}
            authenticated={authenticated}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

const PrivateRoute = ({ authenticated, ...props }) => {
  return authenticated ? <Route {...props} /> : <Navigate to="/" />;
};

export default App;
