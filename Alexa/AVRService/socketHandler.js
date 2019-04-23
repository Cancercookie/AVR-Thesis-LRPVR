const AWS = require('aws-sdk');
const util = require('util');
const s3 = new AWS.S3();

const webSocketEndopoint = 'https://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production';

const success = {
  statusCode: 200
};

const params = {
	Bucket: 'avrbucket',
	Key: 'amzn1.ask.account.AHQIYF5CK37VTIUPHMQVKD5ZOO42XKDGIC2GUCHYRMMA7GOKPI6K7BZQR3JLEGPFVSOCD4UGHF5FYKZDA5XS65TPRRTMGHZWRGQGT2HHOCWFE5WBSQKUZNE3HHSTMBPHTEM64TMZ5R45YRCJNEPXORZLURCDIU223BLKBUSZE7V6TFHYA4QRXBOKHZ6CISSBNR7TOIYRDYGCUPQ'
};

async function sendMessageToClient(data, event) {
	const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({apiVersion: '2029', endpoint: webSocketEndopoint});
	return new Promise(function(resolve, reject) {
		apigatewaymanagementapi.postToConnection({
	    ConnectionId: event.requestContext.connectionId, // connectionId of the receiving ws-client
	    Data: JSON.stringify(data),
	}, (err, data) => {
			if (err) {
				console.log('Error: ', err);
				reject(err);
			}
			resolve(data);
		});	
	})
}

async function connectionManager(event, context) {
    return success;
}

async function main(event, context) {
    return success;
}

async function read(event, context, callback) {
	const domain = event.requestContext.domainName;
  	const stage = event.requestContext.stage;
	const returnData = await s3.getObject(params).promise()
	.then((data) => { return data.Body.toString('utf-8'); })
	.catch((err) => { console.log(err) }); 
	await sendMessageToClient(returnData, event);
	return success;
}

async function write(event, context, callback) {
    return success;
}

module.exports = {
    sendMessageToClient,
  	connectionManager,
  	read,
  	write,
 	main
};