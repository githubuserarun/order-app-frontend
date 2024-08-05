import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/Form";
import "./AddOrder.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import { FallingLines } from "react-loader-spinner";
import "./AddOrder.css";

const InputTable = () => {
  const [rows, setRows] = useState([
    { id: 1, productName: "", quantity: 0, price: 0, totalPrice: 0 },
  ]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [totalAftDiscount, setTotalAftDiscount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoad, setIsLoad] = useState(false);

  const coupen = [
    { coupen: "coupen 1", coupenDis: 10 },
    { coupen: "coupen 2", coupenDis: 20 },
    { coupen: "coupen 3", coupenDis: 30 },
  ];

  const navigate = useNavigate();

  const handleCouponChange = (e) => {
    setSelectedCoupon(parseInt(e.target.value));
  };

  const handleInputChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        if (field === "quantity" || field === "price") {
          updatedRow.totalPrice = updatedRow.quantity * updatedRow.price;
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  const addNewRow = () => {
    const newRow = {
      id: rows.length + 1,
      productName: "",
      quantity: 0,
      price: 0,
      totalPrice: 0,
    };
    setRows([...rows, newRow]);
  };

  const getGrantTotal = () => {
    let total = rows.reduce((sum, row) => sum + row.totalPrice, 0);
    setGrandTotal(total);
  };

  const submitOrder = async () => {
    const body = {
      totalPrice: grandTotal,
      discount: selectedCoupon,
      discountPrice: totalAftDiscount,
      productdata: rows,
    };
    try {
      setIsLoad(true);
      const response = await axios.post(
        "https://orderapp-tzsk.onrender.com/add-order",
        body
      );
      if (response.data.status) {
        setIsLoad(false);
        toast.success(response.data.message);
        setRows([
          { id: 1, productName: "", quantity: 0, price: 0, totalPrice: 0 },
        ]);
        setGrandTotal(0);
        setSelectedCoupon("");
        setTotalAftDiscount(0);
        setSelectedRows([]);
      } else {
        setIsLoad(false);
        toast.error(
          "Make sure all inputs are provided" || response.data.message
        );
      }
    } catch (err) {
      setIsLoad(false);
      toast.error(err);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const deleteSelectedRows = () => {
    console.log(selectedRows);

    if (selectedRows.length > 0) {
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.includes(row.id))
      );
      setSelectedRows([]);
    } else {
      toast.error("Please select any or more item");
      console.log("Please select any or more item");
    }
  };

  useEffect(() => {
    getGrantTotal();
  }, [rows]);

  useEffect(() => {
    setTotalAftDiscount(grandTotal - (selectedCoupon / 100) * grandTotal);
  }, [selectedCoupon, grandTotal]);

  return (
    <div className="input-table-container ">
      <div className="table">
        {isLoad ? (
          <div className="loader">
            <FallingLines />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === rows.length && rows.length > 0
                    }
                  />
                </th>
                <th>S.No</th>
                <th>Enter Product Name</th>
                <th>Quantity</th>
                <th>Enter Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </td>
                  <td>{row.id}</td>
                  <td>
                    <input
                      type="text"
                      value={row.productName}
                      onChange={(e) =>
                        handleInputChange(row.id, "productName", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => {
                        handleInputChange(
                          row.id,
                          "price",
                          parseFloat(e.target.value) || 0
                        );
                      }}
                    />
                  </td>
                  <td>{row.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bottom-data">
        <div className="button-container">
          <button onClick={addNewRow}>Add New Row</button>
          <button
            onClick={deleteSelectedRows}
            // disabled={selectedRows.length === 0}
          >
            Delete Selected Rows
          </button>
        </div>

        <div className="summary-container d-flex flex-column align-items-end mt-4">
          <div className="summary-item d-flex">
            <h className="w-100">Grand Total</h>
            <input type="number" value={grandTotal} disabled />
          </div>
          <div className="summary-item">
            <select value={selectedCoupon} onChange={handleCouponChange}>
              <option value="">Select a coupon</option>
              {coupen.map((item) => (
                <option key={item.coupen} value={item.coupenDis}>
                  {item.coupen}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className="discount-text">
                Selected discount: {selectedCoupon}%
              </p>
            )}
          </div>
          <div className="summary-item d-flex">
            <h className="w-100">Discount Price</h>
            <input type="number" value={totalAftDiscount} disabled />
          </div>
        </div>

        <div className="button-container">
          <button onClick={submitOrder}>Submit Order</button>
        </div>
      </div>
      <footer className="d-flex flex-row justify-content-center align-self-center">
        <div>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/")}
          >
            Go to order view page
          </button>
        </div>
      </footer>
    </div>
  );
};

export default InputTable;
