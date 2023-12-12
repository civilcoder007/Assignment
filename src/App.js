// Toast message
import { ToastContainer } from "react-toastify";
import "./App.css";
import Login from "./Components/Login";
import { Routes, Route } from "react-router-dom";
import Searchflight from "./Components/Searchflight";
import FlightList from "./Components/FlightList";
import NavbarComponent from "./Components/Navbar";
import Cart from "./Components/Cart";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/search-flight" element={<Searchflight />} />
          <Route path="/flight/list" element={<FlightList />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
