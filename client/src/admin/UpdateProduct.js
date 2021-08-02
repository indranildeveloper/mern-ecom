import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Base from "../core/Base";
import {
  getAllCategories,
  getProduct,
  updateProduct,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getRedirect,
    formData,
  } = values;

  const preloadCategories = () => {
    getAllCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          // TODO: Fix the minor warning
          categories: data,
          formData: new FormData(),
        });
      }
    });
  };

  const preload = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        preloadCategories();
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          stock: data.stock,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.productId);
  }, []);

  const onUpdate = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateProduct(match.params.productId, user._id, token, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            stock: "",
            photo: "",
            loading: true,
            getRedirect: false,
            createdProduct: data.name,
          });

          setTimeout(() => {
            setValues({ ...values, loading: false, getRedirect: true });
            console.log("TimeOut");
          }, 3000);
        }
      })
      .catch();
  };

  if (getRedirect) {
    console.log("Redirect");
    return <Redirect to="/admin/products" />;
  }

  const handleChange = (name) => (event) => {
    const inputValue =
      name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, inputValue);
    setValues({ ...values, [name]: inputValue });
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4>{createdProduct} Updated Successfully!</h4>
      </div>
    );
  };
  const warningMessage = () => {
    return (
      <div
        className="alert alert-danger mt-3"
        style={{ display: error ? "" : "none" }}
      >
        <h4>{error}</h4>
      </div>
    );
  };

  const loadMessage = () => {
    return (
      <div
        className="alert alert-primary mt-3"
        style={{ display: !error && loading ? "" : "none" }}
      >
        <h4>Redirecting to Manage Products Page!</h4>
      </div>
    );
  };

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-primary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((category, index) => {
              return (
                <option value={category._id} key={index}>
                  {category.name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onUpdate}
        className="btn btn-outline-primary"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Update Product Here!"
      description="Welcome to Product update section"
      className="container bg-primary p-5 mb-5"
    >
      <Link className="btn btn-dark mb-3" to="/admin/dashboard">
        Admin Dashboard
      </Link>
      <div className="row bg-white text-dark rounded">
        <div className="col-md-8 offset-md-2 my-5">
          {successMessage()}
          {loading && loadMessage()}
          {warningMessage()}
          {createProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
