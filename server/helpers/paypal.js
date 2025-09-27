// server/helpers/paypal.js

const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AamWJMcxh7XCLlISrc4WIX-iqAkjv9ZAOldHXUcq_PfJPOjjoGwCjewPiGGjMhU9Y3--gbeWm_UglZu9",
  client_secret:
    "EHT1kDidKyqafYqFv6SnjZf-EQ6BzuqFMbVj8OgYSVw2v_vntk3fSBC3jJP64O0nWH8s8N3XXQolQnAG",
});

module.exports = paypal;
