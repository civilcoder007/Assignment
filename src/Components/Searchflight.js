import React, { useRef, useState } from "react";
import { GoArrowSwitch } from "react-icons/go";
import { FaMapMarker } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CryptoJS from "crypto-js";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Collapse,
} from "react-bootstrap";
import axios from "axios";


import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFlightData } from "../redux/FlightDataSlice";

const Searchflight = () => {
  const [flyingFrom, setFlyingFrom] = useState("");
  const [flyingTo, setFlyingTo] = useState("");
  const[flyingFromIata,setFlyingFromIata]=useState("");
  const [flyingToIata, setFlyingToIata] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const encryptText = (data) => {
    const key = "aLtAeNCrypT";

    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
    return encrypted;
  };

  const decryptText = (encryptedText) => {
    const key = "aLtAeNCrypT";
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

  // Form to api function

  const [options, setOptions] = useState([]);
  const previousController = useRef();

  const getData = async (searchTerm) => {
    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;
    const state = { search_key: searchTerm };
    const data = encryptText(state);
    const request_data = { request_data: data };

    const json = JSON.stringify(request_data);
    try {
      const response = await axios.post(
        "https://devadmin.altabooking.com/api/v2/flight/search-flight-airport",

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
      const updatedOptions = response.data.main_data.data.map((p) => {
        return {
          id: p.id,
          iata: p.iata,
          airport_name: p.airport_name,
          short_name:p.short_name
        };
      });

      setOptions(updatedOptions);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  console.log(options);

  const onInputChange = (event, value, reason) => {
    if (value) {
      getData(value);
    } else {
      setOptions([]);
    }
  };
  console.log("flying from options", flyingFrom);
  console.log("flying to options", flyingTo);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  const [traveller, setTraveller] = useState("");
  const travellerfun = () => {
    handleToggle();
    setTraveller(` ${adult} Adults 🔵 ${child} Child 🔵 ${infant} Infant`);
  };
  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [selectedPrefer, setSelectedPrefer] = useState("");

  const handleSelectChange = (event) => {
    setSelectedPrefer(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const state = {
      from_airport: flyingFromIata,
      to_airport: flyingToIata,
      departure_date: selectedDate.toISOString().split("T")[0],
      return_date: "",
      adults: adult,
      childs: child,
      infants: infant,
      class_type: selectedPrefer.toUpperCase(),
      travel_type: "oneway",
      max_result: 100,
      user_id: 0,
    };
    console.log("State", state);
    const data = encryptText(state);
    const request_data = { request_data: data };

    const json = JSON.stringify(request_data);

    try {
      const response = await axios.post(
        "https://devadmin.altabooking.com/api/v2/flight/flight-search-list",

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
      const decrypt = decryptText(response.data.response_data);
      dispatch(setFlightData(decrypt))
      console.log("response data code ", response.data);
      if (response.status === 200) {
        navigate("/flight/list",{
          state: {
            flyingFrom: flyingFrom,
            flyingTo: flyingTo,
            departure_date: selectedDate.toISOString().split("T")[0],
            class_type:selectedPrefer.toUpperCase()
          },
        });
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  return (
    <>
      <div style={{ padding: "15px" }}>
        <div className="card">
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <div className="row d-flex align-items-center">
                <div className="col-md-4">
                  <Form.Label>Flying From</Form.Label>
                  <InputGroup>
                    <Autocomplete
                      id="combo-box-demo"
                      options={options}
                      onInputChange={onInputChange}
                      getOptionLabel={(option) => option.short_name}
                      onChange={(event, newValue) => {
                        console.log("iata", newValue.iata);
                        setFlyingFromIata(newValue.iata)
                        setFlyingFrom(newValue.short_name||"");
                      }}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params} 
                          label="Flying from"
                          variant="outlined"
                        />
                      )}
                    />
                    <InputGroup.Text>
                      <FaMapMarker />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
                <div className="col-md-1">
                  <GoArrowSwitch />
                </div>
                <Col>
                  <Form.Label className="col-md-4">Flying To</Form.Label>
                  <InputGroup>
                    <Autocomplete
                      id="combo-box-demo"
                      options={options}
                      onInputChange={onInputChange}
                      getOptionLabel={(option) => option.short_name}
                      onChange={(event, newValue) => {
                        console.log("iata", newValue.iata);
                        setFlyingToIata(newValue.iata)
                        setFlyingTo(newValue.short_name);
                      }}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Flying to"
                          variant="outlined"
                        />
                      )}
                    />
                    <InputGroup.Text>
                      <FaMapMarker />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <div className="col-md-3">
                  <Form.Label>Depature Date</Form.Label>
                  <DatePicker
                    showIcon
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="eee d MMM yyyy" // format the displayed date
                    placeholderText="Select a date..."
                    className="input"
                  />
                </div>
              </div>
              <div style={{ margin: "15px" }}></div>
              <div className=" row">
                <div className="col-md-4">
                  <Form.Label>Traveller(S)</Form.Label>
                  <Form.Control
                    placeholder="Select traveller "
                    onClick={handleToggle}
                    value={traveller}
                  />

                  <Collapse in={isOpen}>
                    <div className="col-md-12" style={{ paddingLeft: "15px" }}>
                      <div className="row pt-2">
                        <div className="col-md-6">
                          <h4>Adult</h4>
                        </div>
                        <div className="col-md-2">
                          <Button
                            variant="primary"
                            onClick={() => setAdult(adult - 1)}
                            disabled={adult <= 0}
                          >
                          </Button>
                        </div>
                        <div className="col-md-2">{adult}</div>
                        <div className="col-md-2">
                          <Button
                            variant="primary"
                            onClick={() => setAdult(adult + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="row pt-2">
                        <div className="col-md-6">
                          <h4>Children(3-12yrs.) </h4>
                        </div>
                        <div className="col-md-2">
                          <Button
                            variant="primary"
                            onClick={() => setChild(child - 1)}
                            disabled={child <= 0}
                          >
                          </Button>
                        </div>
                        <div className="col-md-2">{child}</div>
                        <div className="col-md-2">
                          <Button
                            variant="primary"
                            onClick={() => setChild(child + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="row pt-2">
                        <div className="col-md-6">
                          <h4>Infant(0-2yrs.) </h4>
                        </div>
                        <div className="col-md-2">
                          <Button
                            variant="primary"
                            onClick={() => setInfant(infant - 1)}
                            disabled={infant <= 0}
                          >
                            {" "}
                            -{" "}
                          </Button>
                        </div>
                        <div className="col-md-2">{infant}</div>
                        <div className="col-md-2">
                          <Button
                            variant="primary"
                            onClick={() => setInfant(infant + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div
                        className="row mt-4"
                        style={{ width: "100px", margin: "0 auto" }}
                      >
                        <Button
                          variant="primary"
                          onClick={() => travellerfun()}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>

                <div className="col-md-4">
                  <Form.Label>Preferred Class</Form.Label>
                  <select
                    value={selectedPrefer}
                    onChange={handleSelectChange}
                    className="form-select"
                  >
                    <option value="">Preferred Class</option>
                    {PreferredClass.map((prefer) => (
                      <option key={prefer} value={prefer}>
                        {prefer}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Row>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-4"
                  style={{ width: "100px", margin: "0 auto" }}
                >
                  Submit
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchflight;
 export const PreferredClass = ["Economy", "Premium Economy", "Business", "First"];
