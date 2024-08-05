import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Audio, MagnifyingGlass } from "react-loader-spinner";
import "./OrderDash.css";

const OrderTable = () => {
  const [ordersData, setOrderData] = useState([]);
  const [filter, setfilter] = useState("");
  const [isLoad, setIsLoad] = useState(false);

  const lowtohigh = () => {
    const sortedData = [...ordersData].sort(
      (a, b) => a.totalPrice - b.totalPrice
    );

    console.log(sortedData);
    setOrderData(sortedData);
  };

  const navigate = useNavigate();

  const getOrdersData = async () => {
    try {
      setIsLoad(true);
      const response = await axios.get(
        "https://orderapp-tzsk.onrender.com/orders"
      );
      if (response.data.status) {
        setIsLoad(false);
        setOrderData(response.data.data);
        console.log(response.data.data);
      } else {
        setIsLoad(false);
        toast.error(response.data.message);
      }
    } catch (err) {
      setIsLoad(false);
      toast.error(err);
    }
  };

  const handleView = (orderId) => {
    navigate(`/view/${orderId}`);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to remove?")) {
      try {
        setIsLoad(true);
        const response = await axios.delete(
          `https://orderapp-tzsk.onrender.com/del-order/${orderId}`
        );
        if (response.data.status) {
          setIsLoad(false);
          const filter = ordersData.filter((item) => item._id !== orderId);
          setOrderData([...filter]);
          toast.success(response.data.message);
        } else {
          setIsLoad(false);
          toast.error(response.data.message);
        }
      } catch (err) {
        setIsLoad(false);
        toast.error(err);
      }
    }
  };

  useEffect(() => {
    getOrdersData();
  }, []);
  useEffect(() => {}, [ordersData]);
  console.log(ordersData);
  return (
    <div className="order-body ">
      <h3 className="text-center mt-3">Orders Table</h3>
      <div className="summary-item align-items-center align-self-end d-flex">
        <label className="w-50" for="cars">
          sort by:
        </label>
        <select
          className="w-75"
          value={filter}
          onChange={(e) => setfilter(e.target.value)}
        >
          <option value="">Sort by</option>
          <option onClick={() => lowtohigh()} value="Price low to high">
            Price low to high
          </option>
          <option value="Price low to high">Price hign to low</option>
          <option value="asc">Asending order</option>
          <option value="dec">Decending order</option>
        </select>
      </div>

      {isLoad ? (
        <div className="loader ">
          <MagnifyingGlass height="100" width="100" />
        </div>
      ) : (
        <div className="order-table mt-3">
          <table striped bordered hover>
            <thead>
              <tr>
                <th>OrderId</th>
                <th>Total Price</th>
                <th>Discount</th>
                <th>DiscountPrice</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(ordersData) && ordersData.length > 0 ? (
                ordersData.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>${item.totalPrice}</td>
                    <td>{item.discount} %</td>
                    <td>${item.discountPrice}</td>
                    <td>{item.status ? "Sold" : "Not sold"}</td>
                    <td>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleView(item._id)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-outline-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <footer className="mt-4">
        <div className="d-flex flex-row justify-content-center align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/add")}
          >
            Go To Add Products
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OrderTable;
