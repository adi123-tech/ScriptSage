const express = require('express');
const { axios } = require('axios');
const { xRapidApiKey,  xRapidApiHost} = require('./../config')

const compilerRouter = express.Router();

compilerRouter.post("/compile", async (req, res) => {
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    // Only process requests for the C language
    if (language.toLowerCase() !== "c") {
        return res.status(400).json({ error: "Only C language is supported" });
    }

    const options = {
        method: 'POST',
        url: 'https://online-code-compiler.p.rapidapi.com/v1/',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': xRapidApiKey,
            'X-RapidAPI-Host': xRapidApiHost
        },
        data: {
            language: 'c',
            version: 'latest',
            code: code,
            input: input
        }
    };

    try {
        const response = await axios.request(options);
        res.send(response.data);
        console.log(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = compilerRouter;
