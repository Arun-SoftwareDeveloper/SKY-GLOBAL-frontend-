import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import backendApi from "../BackendApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm({ handleLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Get the navigate function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendApi}/auth/login`, formData);
      const token = response.data;

      // Store token in local storage
      localStorage.setItem("token", token);
      console.log(token);
      toast.success("Login successful");
      navigate("/dashboard"); // Navigate to dashboard
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Error logging in user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginForm;
