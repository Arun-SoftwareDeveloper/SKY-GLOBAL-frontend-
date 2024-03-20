import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendApi from "../BackendApi";
import "../Styles/RegisterForm.css";

function RegisterForm({ formData, handleInputChange }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validations
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendApi}/auth/register`,
        formData
      );
      if (response.status === 201) {
        toast.success("User registered successfully");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error("Error in registering user");
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    // Basic email format validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role:</label>
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <br />
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Already have an account? <Link to="/login">Login</Link>
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

export default RegisterForm;
