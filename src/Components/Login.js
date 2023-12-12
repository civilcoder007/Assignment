import React, { useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { login } from "../redux/AuthSlice";

// Login Validation //
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string()
    .max(255)
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});
// Login Validation //

const Login = () => {
  const dispatch = useDispatch()
 
  const navigate = useNavigate();
  const { state } = useLocation();
  const { from = "/search-flight" } = state || {};

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      showPassword: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const state = { email: values.email, password: values.password };
      const data = encryptText(state);

      const request_data = { request_data: data };
      const json = JSON.stringify(request_data);

      try {
        const response = await axios.post(
          "https://devadmin.altabooking.com/api/v2/auth/login",
          json,
          {
            headers: {
              "Content-Type": "application/json",
              apikey: "indusAltaR2PSM",
              currency:
                "U2FsdGVkX1/O0sFe9FnokQdTBRP/rRIlcPZEWbzHL9ncZwZzp/Fu/2Jnt0z8ukCALQNDRknKwa5WdmjDRC2XA2a0gz/ZfvHeYTIq7fBZi9P4kQ7KvQYueLB2Rl4puqOTSQyBsbLGPc8cQ9KDZLMVapCruTsJcGzRnaOo1CZksLPMzmNOPqe+ePZk6UJiAUmoDS6p4JvLCmpe0RATiqDh7g==",
            },
          }
        );
        console.log(response.data.main_data.data.profile);
        dispatch(login({
          user:{
            first_name: response.data.main_data.data.profile.first_name,
            last_name : response.data.main_data.data.profile.last_name,
            email:response.data.main_data.data.profile.email,
            token:response.data.main_data.data.profile.token
          }
        }))

        if (response.data.main_data.res_code === 200) {
          navigate(from);
          toast.success(response.data.main_data.response);
        } else {
          toast.error(response.data.main_data.response);
        }
       
      } catch (error) {
        console.error("Login error:", error.message);
      }
    },
  });
  

  const togglePasswordVisibility = () => {
    formik.setValues({
      ...formik.values,
      showPassword: !formik.values.showPassword,
    });
  };

  const encryptText = (data) => {
    const key = "aLtAeNCrypT";
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
    return encrypted;
  };

  return (
    <Container>
      <Row className="align-items-center justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address*</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && formik.errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password*</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  type={formik.values.showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.password && formik.errors.password}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                >
                  {formik.values.showPassword ? <BsEyeSlash /> : <BsEye />}
                </span>
              </div>
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
