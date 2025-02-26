const axios = require("axios");

axios
  .get("http://127.0.0.1:8000/api/test")
  .then((response) => {
    console.log("Response from Laravel:", response.data);
  })
  .catch((error) => {
    console.error("Error connecting to Laravel:", error.message);
  });
