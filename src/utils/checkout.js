export default function paymentAction(payload) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Basic dGVzdF9mZmU1NTdjMi1jZGZlLTQ5MDAtODcxYi1kNWNmMmE3ODIwYzM6ZjNjNDFjMmEtNDFjNi00ODdkLWJhMTUtZGMxYjAzNjMwNTk0",
    },
    body: JSON.stringify({
      ...payload,
      redirection_url: {
        success:
          "https://localhost:3000/redirection/success?external_reference=OID123456789",
        error:
          "https://localhost:3000/redirection/error?external_reference=OID123456789",
        default: "https://localhost:3000/redirection/default",
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
