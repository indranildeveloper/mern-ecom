import React from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    user: { firstname, lastname, email, role },
  } = isAuthenticated();

  // console.log(isAuthenticated().user);

  const adminLeftSide = () => {
    return (
      <div className="card">
        <h4 className="card-header bg-dark text-white">Admin Navigation</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="mav-link text-primary" to="/admin/create/category">
              Create Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="mav-link text-primary" to="/admin/categories">
              Manage Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="mav-link text-primary" to="/admin/create/product">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="mav-link text-primary" to="/admin/products">
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="mav-link text-primary" to="/admin/orders">
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminRightSide = () => {
    return (
      <div className="card mb-3">
        <h4 className="card-header p-1">Admin Information</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <span className="bagde p-1 badge-primary mr-2">Name: </span>{" "}
            {firstname} {lastname}
          </li>
          <li className="list-group-item">
            <span className="bagde p-1 badge-primary mr-2">Email: </span>{" "}
            {email}
          </li>
          <li className="list-group-item">
            <span className="badge badge-danger p-1">Admin Area</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Base
      title="Welcome to Admin Area"
      description="Manage all of your products here"
      className="container bg-primary p-5 mb-5"
    >
      <div className="row">
        <div className="col-3">{adminLeftSide()}</div>
        <div className="col-9">{adminRightSide()}</div>
      </div>
    </Base>
  );
};

export default AdminDashboard;
