import React, { useState } from "react";
import moment from "moment";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { addToCart } from "../redux/FlightSlice";

const FlightList = () => {
  const location = useLocation();
  const { flyingFrom, flyingTo, class_type } = location.state;
  const selectedDate = location.state.departure_date;
  const formattedDate = moment(selectedDate).format("ddd D MMM YYYY");

  const selector = useSelector((state) => state.flight.flightData.data);
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(Array(selector.length).fill(false));

  const toggleDetails = (itineraryIndex) => {
    setShowDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[itineraryIndex] = !updatedDetails[itineraryIndex];
      return updatedDetails;
    });
  };

  const handleSelect = (flightdatalist) => {
    // Dispatch the addToCart action with the selected flight data
    dispatch(addToCart(flightdatalist));
  };

  return (
    <>
      <div
        style={{ padding: "20px", border: "4px solid #f7f7f7" }}
        className="card"
      >
        <div className="row ">
          <div className="col-md-5 d-flex align-item-top">
            <span style={{ color: "blue", marginRight: "4px" }}>
              <FiMapPin />
            </span>
            <p>From Station</p>
          </div>
          <div className="col-md-2">
            <HiOutlineArrowLongRight />
          </div>
          <div className="col-md-5 d-flex align-item-top">
            <span style={{ color: "blue", marginRight: "4px" }}>
              <FiMapPin />
            </span>
            <p>To Station</p>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-5">
            <p>{flyingFrom}</p>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-5">
            <p>{flyingTo}</p>
          </div>
        </div>
        {formattedDate}
      </div>
      <div>
        {selector.map((flight, index) => (
          <div key={flight.flight_id}>
            {flight.flightitineraries.map((itinerary, i) => (
              <div key={i} className="px-4">
                <div className="card mt-3 mb-3 px-4">
                  <p>{class_type}</p>
                  <div className="card-body">
                    <div className="row d-flex align-items-center">
                      <div className="col-md-3">
                        <img
                          src={itinerary.airline_logo}
                          alt=""
                          style={{ height: "124px", width: "230px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={() => toggleDetails(flight.flight_id)}
                        >
                          {showDetails[flight.flight_id] ? "Hide Details" : "Show Details"}
                        </button>
                      </div>
                      <div className="col-md-2">
                        <p>{itinerary.departure_time}</p>
                        <p>{itinerary.departure_code}</p>
                      </div>
                      <div className="col-md-3">
                        <HiOutlineArrowLongRight />
                        <p>{flight.stoppage}</p>
                        <p>{itinerary.duration_text}</p>
                      </div>
                      <div className="col-md-2">
                        <p>{itinerary.arrival_time}</p>
                        <p>{itinerary.arrival_code}</p>
                      </div>
                      <div className="col-md-2">
                        {" "}
                        <p>
                          {flight.currency_symbol}
                          {flight.price}
                        </p>
                        <Button variant="primary" onClick={() => handleSelect(flight)}>Select</Button>
                      </div>
                    </div>

                    {showDetails[flight.flight_id] && (
                      <div className="row">
                        {itinerary.segments &&
                          itinerary.segments.length >= 2 && (
                            <>
                              {itinerary.segments.map(
                                (segment, segmentIndex) => (
                                  <React.Fragment key={segmentIndex}>
                                    <div className="col-md-2">
                                      <p>Depart</p>
                                    </div>
                                    <div className="col-md-2 d-flex">
                                      <p>{segment.departure_iata} </p>
                                      <p> - {segment.arrival_iata}</p>
                                    </div>
                                    <div className="col-md-12 d-flex">
                                      <p>{formattedDate}</p>
                                      <p className="px-3">{class_type}</p>
                                      <p>{segment.segment_duration}</p>
                                    </div>
                                    <hr />
                                    <div className="row d-flex align-items-center">
                                      <div className="col-md-3">
                                        <img
                                          src={segment.carrier_logo}
                                          alt=""
                                          style={{
                                            height: "124px",
                                            width: "230px",
                                          }}
                                        />
                                        <p>{segment.carrier_name}</p>
                                        <p>{segment.aircraft_name}</p>
                                      </div>
                                      <div className="col-md-3">
                                        <p>
                                          {moment(segment.departure_at).format(
                                            "Do MMM YYYY HH:mm"
                                          )}
                                        </p>
                                        <p>{segment.departure_airport}</p>
                                        <p>{segment.departure_location}</p>
                                      </div>
                                      <div className="col-md-3">
                                        <HiOutlineArrowLongRight />
                                      </div>
                                      <div className="col-md-3">
                                        <p>
                                          {moment(segment.arrival_at).format(
                                            "Do MMM YYYY HH:mm"
                                          )}
                                        </p>
                                        <p>{segment.arrival_airport}</p>
                                        <p>{segment.arrival_location}</p>
                                      </div>
                                    </div>
                                    <hr/>
                                  </React.Fragment>
                                  
                                )
                              )}
                            </>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default FlightList;
