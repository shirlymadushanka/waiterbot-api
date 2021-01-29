const io = require("socket.io-client");

const socket = io("ws://localhost:3000", {
  // autoConnect : false,

  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjAwZmU4YzNlMWFjZDMwNGZjNzhiNTBmIiwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYxMTgzMzI4MCwiZXhwIjoxNjEyNDM4MDgwfQ.-z2j-iA0M0Ht-eC-uy9z_fkoaYjGHxA5jnfTdg8XljI"
  },
});

socket.on("connection_success", msg => {
  console.log(msg);
});

socket.on("connect_error", (err) => {
  console.log(err.message); // prints the message associated with the error
});

socket.on("private", (data) => {
  console.log("[PRIVATE]  :", data);
});

socket.on("orderStateChange", (data) => {
  console.log("[ORDER STATE CHANGE ]  :", data);
});