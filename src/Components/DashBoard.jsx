import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "./UserAuthendication";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsBoxArrowRight } from "react-icons/bs";
import { ListGroup, Badge, Button, Row, Col } from "react-bootstrap"; // Import Row and Col from react-bootstrap
import backendApi from "../BackendApi";
import "../Styles/DashBoard.css";

function DashBoard() {
  const { logout, authenticated } = useAuthentication();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendApi}/auth/getAllUsers`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${backendApi}/auth/deleteUser/${userId}`);
      toast.success("User deleted successfully");
      // After deleting, fetch users again to update the list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const decodeJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    console.log(jsonPayload);
    return JSON.parse(jsonPayload);
  };

  const decodedToken = localStorage.getItem("token")
    ? decodeJwt(localStorage.getItem("token"))
    : null;
  const isAdmin = decodedToken && decodedToken.role === "Admin";
  console.log(decodedToken);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Dashboard</h3>
              <Button
                variant="danger"
                block
                className="d-flex align-items-center justify-content-center mb-3"
                onClick={handleLogout}
              >
                <BsBoxArrowRight className="mr-2" />
                Logout
              </Button>
              <h2 className="mt-4">Users:</h2>
              {loading ? (
                <p className="text-center">Loading users...</p>
              ) : (
                <ListGroup>
                  {users.map((user) => (
                    <ListGroup.Item key={user._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>{user.name}</div>
                        <Badge variant="primary">{user.role}</Badge>
                        {authenticated && isAdmin && (
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DashBoard;
