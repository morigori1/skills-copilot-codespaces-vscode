//Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    //Get the URL and parse it
    const parseUrl = url.parse(req.url, true);

    //Get the path
    const path = parseUrl.pathname;
    //Get the query string as an object
    const query = parseUrl.query;

    //Get the HTTP method
    const method = req.method;

    //Get the headers
    const headers = req.headers;

    //Get the payload if any
    let buffer = '';
    req.on('data', (chunk) => {
        buffer += chunk;
    });
    req.on('end', () => {
        //Choose the handler this request should go to. If one is not found, use the notFound handler
        const chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

        //Construct the data object to send to the handler
        const data = {
            path: path,
            query: query,
            method: method,
            headers: headers,
            payload: buffer
        };

        //Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            //Use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            //Use the payload called back by the handler or default to an empty object
            payload = typeof(payload) === 'object' ? payload : {};

            //Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
});

//Start the server
server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});

//Define the handlers
const handlers = {};

//Comments handler
handlers.comments = (data, callback) => {
    if (data.method === 'POST') {
        //Get the comment from the payload
        const comment = querystring.parse(data.payload).comment;

        //Get the comments from the file