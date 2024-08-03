import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";

const Detailview = () => {
  const [productData, setProductData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await axios.post("https://orderapp-tzsk.onrender.com/view-details", {
        id,
      });
      if (response.data.status) {
        setProductData(response.data.data);
        setOrderData(response.data.orderData);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(productData);
  console.log(orderData);
  return (
    <div className="d-flex flex-column container mt-5">
      <h3 className="text-center ">Products Table</h3>
      
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>productName</th>
            <th>productPrice</th>
            <th>productQuantity</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(productData) && productData.length > 0 ? (
            productData.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.productName}</td>
                <td>${item.productPrice}</td>
                <td>{item.productQuantity}</td>
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
      </Table>
      <div className="align-self-end mt-4 mb-4 border border-primary m-4 p-4 ">
        <h4>TotalPrice : {orderData.totalPrice}</h4>
        <h4>Discount : {orderData.discount}</h4>
        <h4>DiscountPrice : {orderData.discountPrice}</h4>
      </div>

      <footer className="mt-4">
        <div className="d-flex flex-row justify-content-center align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Detailview;
