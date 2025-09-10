export default function paymentAction() {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Basic dGVzdF9mZmU1NTdjMi1jZGZlLTQ5MDAtODcxYi1kNWNmMmE3ODIwYzM6ZjNjNDFjMmEtNDFjNi00ODdkLWJhMTUtZGMxYjAzNjMwNTk0",
    },
    body: JSON.stringify({
      amount: 100.5,
      currency: "MXN",
      purchase_description: "ejemplo de compra",
      redirection_url: {
        success: "https://localhost:3000",
        error: "https://localhost:3000",
        default: "https://localhost:3000",
      },
    }),
  };

  fetch("https://api.payclip.com/v2/checkout", options)
    .then((res) => {
      console.log("RESPONE", res);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("DATA", data);
      console.log("URL", data.payment_request_url);
      window.location.href = data.payment_request_url;
    })
    .catch((err) => console.error(err));
}
