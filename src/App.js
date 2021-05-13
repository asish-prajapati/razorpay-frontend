import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const __DEV__ = document.domain === "localhost";

function App() {
  const [form, setForm] = useState({ email: "", mobile: "" });
  const inputChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  async function displayRazorpay(e) {
    e.preventDefault();
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch("http://localhost:4000/razorpay", {
      method: "POST",
    }).then((t) => t.json());

    console.log(data);

    const options = {
      key: __DEV__ ? "rzp_test_K06AuAIWEyth7a" : "PRODUCTION_KEY",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Donation",
      description: "Thank you for nothing. Please give us some money",
      image: "http://localhost:1337/logo.svg",
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        email: form.email,
        contact: form.mobile,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        {" "}
        <form onSubmit={displayRazorpay}>
          <div className="mb-3">
            <label for="name" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={inputChangeHandler}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label for="mobile" className="form-label">
              Mobile Number
            </label>
            <input
              type="number"
              name="mobile"
              onChange={inputChangeHandler}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Donate 1 Rupee
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
