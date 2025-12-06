export default function paymentAction(payload, token) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      ...payload,
      redirection_url: {
        success:
          // "http://localhost:3000/redirection/success?external_reference=OID123456789",
          "http://localhost:3000",
        // TODO: create error page
        error:
          "http://localhost:3000/redirection/error?external_reference=OID123456789",
        default: "http://localhost:3000",
      },
    }),
  };

  fetch("https://api.payclip.com/v2/checkout", options)
    .then((res) => {
      // console.log("RESPONE", res);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      window.location.href = data.payment_request_url;
    })
    .catch((err) => console.error(err));
}
