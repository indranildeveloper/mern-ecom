import React, { useState } from "react";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingState, setloadingState] = useState({
    loading: false,
    getRedirect: false,
  });

  const { user, token } = isAuthenticated();

  console.log(isAuthenticated());

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    // Backent request fired
    createCategory(user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setError("");
          setSuccess(true);
          setName("");

          setloadingState({
            ...loadingState,
            loading: true,
            getRedirect: false,
          });

          setTimeout(() => {
            setloadingState({ loading: false, getRedirect: true });

            console.log("TimeOut");
          }, 3000);
        }
      })
      .catch((error) => console.log(error));
  };

  if (loadingState.getRedirect) {
    console.log("Redirect");
    return <Redirect to="/admin/categories" />;
  }

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category Created Successfully!</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-danger">Failed to Create Category!</h4>;
    }
  };

  const loadMessage = () => {
    return (
      <div
        className="alert alert-primary mt-3"
        style={{ display: !error && loadingState.loading ? "" : "none" }}
      >
        <h4>Redirecting to Manage Categories Page!</h4>
      </div>
    );
  };

  const goBack = () => {
    return (
      <div className="mt-1">
        <Link className="btn btn-info mb-3" to="/admin/dashboard">
          Admin dashboard
        </Link>
      </div>
    );
  };

  const categoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter the category</p>
          <input
            type="text"
            className="form-control form-control-lg my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="e.g. Summer"
          />
          <button onClick={onSubmit} className="btn btn-outline-primary btn-lg">
            Create Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create a Category"
      description="Add a new category for products!"
      className="container bg-primary p-5 mb-5"
    >
      <div className="row bg-white py-3">
        <div className="col-md-8 offset-md-2">
          {successMessage()} {warningMessage()}
          {loadingState.loading && loadMessage()}
          {categoryForm()} {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
