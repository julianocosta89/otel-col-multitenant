"use strict";

const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || "8080";

app.get("/", async(req, res) => {
    let externalCall = await axios.get("https://inspiration.goprogram.ai/");

    return res.send(externalCall.data);
});

app.listen(parseInt(PORT, 10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});