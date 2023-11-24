const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Replace the key and processing channel with your own
const PROCESSING_CHANNEL_ID = "pc_XXXXXX";
const SECRET_KEY = "sk_sbox_XXXXX";

app.post("/create-context", async (req, res) => {
  // Create a Payment Context
  const paymentContext = await fetch(
    "https://api.sandbox.checkout.com/payment-contexts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: {
          type: "paypal",
        },
        currency: "USD",
        amount: 2000,
        capture: true,
        payment_type: "regular",
        items: [
          {
            name: "keyboard",
            unit_price: 2000,
            quantity: 1,
          },
        ],
        processing_channel_id: PROCESSING_CHANNEL_ID,
        success_url: "http://www.example.com/success.html",
        failure_url: "http://www.example.com/failure.html",
      }),
    }
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  console.log(paymentContext);

  res.send(paymentContext);
});

app.post("/pay", async (req, res) => {
  // Create a Payment Context
  const payment = await fetch("https://api.sandbox.checkout.com/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment_context_id: req.body.payment_context_id,
      processing_channel_id: PROCESSING_CHANNEL_ID,
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  console.log(payment);

  res.send(payment);
});

app.listen(3000, () =>
  console.log("Node server listening on port http://localhost:3000")
);
