//Julio
import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { BsPersonCircle, BsFillCartDashFill } from "react-icons/bs";
import Logo from '../../src/assets/easyshop.png'

function Header() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} style={{height:90, width:150}} alt="EasyShop" className="imagenLogo"/>
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/category">Category</Link>
                            </li>
                        </ul>
                        <button className="btn" >
                            <BsPersonCircle size={25} />
                        </button>
                        <button className="btn">
                            <Link to="/car">
                                <BsFillCartDashFill size={25} />
                            </Link>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    )
}

export default Header
