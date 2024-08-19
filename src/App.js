import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboardScreen from "./views/AdminDashboardScreen.jsx";
import AdminProductScreen from "./views/AdminProductScreen.jsx";
import AdminPurchaseScreen from "./views/AdminPurchaseScreen.jsx";
import AdminCategoryScreen from "./views/AdminCategoryScreen.jsx";
import CardInsertScreen from "./views/CardInsertScreen.jsx";
import CarScreen from "./views/CarScreen.jsx";
import HomeScreen from "./views/HomeScreen.jsx";
import PayScreen from "./views/PayScreen.jsx";
import ProductScreen from "./views/ProductScreen.jsx";
import ProfileScreen from "./views/ProfileScreen.jsx";
import UpdateUserScreen from "./views/UpdateUserScreen.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ManageAddressesScreen from "./views/ManageAddressesScreen.jsx";
import ManageCardsScreen from "./views/ManageCardsScreen.jsx";
import AdminUsersScreen from "./views/AdminUsersScreen.jsx";
import ViewPurchasesUserIdScreen from "./views/ViewPurchasesUserIdScreen.jsx";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/products" element={<AdminProductScreen />} />
        <Route path="/admin/purchases" element={<AdminPurchaseScreen />} />
        <Route path="/admin/category" element={<AdminCategoryScreen />} />
        <Route path="/user/insertCard" element={<CardInsertScreen />} />
        <Route path="/car" element={<CarScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/pay" element={<PayScreen />} />
        <Route path="/product" element={<ProductScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/user/update" element={<UpdateUserScreen />} />
        <Route path="/user/manageAddresses" element={<ManageAddressesScreen />} />
        <Route path="/user/manageCards" element={<ManageCardsScreen />} />
        <Route path="/admin/users" element={<AdminUsersScreen />} />
        <Route path="/user/viewPurchases" element={<ViewPurchasesUserIdScreen />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
