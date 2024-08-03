import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "./App.css";
import OrderTable from './Components/OrderDashBord/OrderDash';
import InputTable from './Components/AddOrder/AddOrder';
import Detailview from './Components/DetailView/Detailview';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<OrderTable />} />
          <Route path="/add" element={<InputTable />} />
          <Route path="/view/:id" element={<Detailview />} />

        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
