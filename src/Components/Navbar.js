import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";
import { NavLink, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const selector = useSelector((state) => state.auth.user);
  const itemNum = useSelector((state) => state.flightdatalist?.cart.length);
  
  
  // console.log("Cart Item Count:", cartItemCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <Navbar
      className=" bg-body-tertiary d-flex justify-content-between "
    >
      <Navbar.Brand href="#home">Book Your Flight</Navbar.Brand>
      <Nav className="mr-auto">
        {/* <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link> */}
      </Nav>
      <Nav className="ml-auto ">
        <NavLink to="/cart" >
          <FaShoppingCart size={40}/>
          <span className="badge bg-secondary">{itemNum}</span>          
        </NavLink>
        <span style={{ color: "", marginTop: "12px",padding:"12px" }}>
          {selector?.first_name} {selector?.last_name}
        </span>
        <Nav.Link>
          <Button variant="outline-danger" onClick={logoutHandler}>
            <FaSignOutAlt className="mr-1" />
            Logout
          </Button>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavbarComponent;
