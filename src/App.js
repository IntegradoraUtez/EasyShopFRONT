import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboardScreen from './views/AdminDashboardScreen.jsx';
import AdminProductScreen from './views/AdminProductScreen.jsx';
import AdminPurchaseScreen from './views/AdminPurchaseScreen.jsx';
import CardInsertScreen from './views/CardInsertScreen.jsx';
import CarScreen from './views/CarScreen.jsx';
import HomeScreen from './views/HomeScreen.jsx';
import PayScreen from './views/PayScreen.jsx';
import ProductScreen from './views/ProductScreen.jsx';
import ProfileScreen from './views/ProfileScreen.jsx';
import UpdateUserScreen from './views/UpdateUserScreen.jsx';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/products" element={<AdminProductScreen />} />
        <Route path="/admin/purchases" element={<AdminPurchaseScreen />} />
        <Route path="/card/insert" element={<CardInsertScreen />} />
        <Route path="/car" element={<CarScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/pay" element={<PayScreen />} />
        <Route path="/product" element={<ProductScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/user/update" element={<UpdateUserScreen />} />
        <Route path="/user/manageAddresses" element={<UpdateUserScreen />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
