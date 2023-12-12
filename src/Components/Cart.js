import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editCartItem, removeFromCart, selectCartItems } from '../redux/FlightSlice';
import moment from 'moment';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';

const Cart = () => {
    const dispatch = useDispatch()
    const data = useSelector((state)=> state.flightdatalist?.cart || [])
    const cartItems = useSelector(selectCartItems);

  const handleRemove = (flightId) => {
    dispatch(removeFromCart(flightId));
  };

  const handleEdit = (id, updatedItem) => {
    dispatch(editCartItem({ id, updatedItem }));
  };
    console.log(data,"19");
  return (
    <div>
      {data.map((flight, index) => (
          <div key={flight.flight_id}>
            {flight.flightitineraries.map((itinerary, i) => (
              <div key={i} className="px-4">
                <div className="card mt-3 mb-3 px-4">
                  
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
                          className="btn btn-danger"
                          onClick={()=>handleRemove(flight.flight_id)}
                        >
                         Remove
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}

export default Cart