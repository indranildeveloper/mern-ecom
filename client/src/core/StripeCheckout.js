import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactStripeCheckout from "react-stripe-checkout";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { emptyCartAfterOrder } from "./helper/CartHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  //   TODO: Get the total price using the reduce method

  //   const getFinalTotalPrice = () => {
  //     return products.reduce((currentValue, nextValue) => {
  //       return currentValue + nextValue.count * nextValue;
  //     }, 0);
  //   };

  const getFinalTotalPrice = () => {
    let amount = 0;
    // eslint-disable-next-line array-callback-return
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        // TODO: Create Order and Clear cart
        const { status } = response;
        console.log("STATUS: ", status);
        // emptyCartAfterOrder()
      })
      .catch((error) => console.log(error));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <ReactStripeCheckout
        stripeKey={process.env.REACT_APP_STRIPE}
        token={makePayment}
        amount={getFinalTotalPrice() * 100}
        name="Buy Products"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-warning">Pay With Stripe</button>
      </ReactStripeCheckout>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign In</button>
      </Link>
    );
  };

  return (
    <div className="text-center">
      <h3 className="text-white mb-3">
        Stripe Checkout {getFinalTotalPrice()}
      </h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
