(async () => {
  const response = await fetch("/create-context", { method: "POST" });
  const paymentContext = await response.json();

  paypal
    .Buttons({
      createOrder() {
        return paymentContext.partner_metadata.order_id;
      },
      onApprove: function (data) {
        console.log("onApprove called", data);

        // Complete the payment
        fetch("/pay", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            payment_context_id: paymentContext.id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            alert(`You payment id: ${data.id}`);
          })
          .catch((error) => console.error(error));
      },
    })
    .render("#paypal-button-container");
})();
