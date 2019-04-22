const AWS = require('aws-sdk');
const util = require('util');
const s3 = new AWS.S3();

const webSocketEndopoint = 'https://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production';

const success = {
  statusCode: 200
};

async function broadcast() {
    console.log('broadcast');
}

module.exports = {
    broadcast
};