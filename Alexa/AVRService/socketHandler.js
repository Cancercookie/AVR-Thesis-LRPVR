const util = require('util.js');
const dynamo = require('dynamo.js')

async function sendMessageToClient(data, connectionId) {
	if(await dynamo.isClientConnected(util.AlexaId)) {
		const apigatewaymanagementapi = new util.AWS.ApiGatewayManagementApi({apiVersion: '2029', endpoint: util.webSocketEndpoint});
		return new Promise(function(resolve, reject) {
			apigatewaymanagementapi.postToConnection({
    			ConnectionId: connectionId, // connectionId of the receiving ws-client
    			Data: JSON.stringify(data)
			}, 
			(err, data) => {
			if (err) {
				console.log('Error: ', err);
				reject(err);
			}
			resolve(data);
			});	
		})
	} else {
		console.log('client is disconnected');
	}
}

async function connectionManager(event, context) {
	const eventType = event.requestContext.eventType;
	if (eventType === 'CONNECT'){
		await dynamo.putNewRow(event.requestContext.connectionId);
	}else if (eventType === 'DISCONNECT') {
		await dynamo.updateUnityId([], 'disconnected');
	}else {
		console.log('dunno');
		return
	}
    return util.success;
}

async function main(event, context) {
    return util.success;
}

async function getArticles(event, context) {
	const articles = await dynamo.getArticles();
	await sendMessageToClient(articles, event.requestContext.connectionId);
    return util.success;
}

async function read(event, context, callback) {
	const row = await dynamo.getRowById(util.AlexaId);
	await sendMessageToClient(row, event.requestContext.connectionId);
	return util.success;
}

async function write(event, context, callback) {
	const body = JSON.parse(event.body);
	const row = await dynamo.writeRow(util.AlexaId, body.writeParams);
	await sendMessageToClient(row, event.requestContext.connectionId);
    return util.success;
}

module.exports = {
    sendMessageToClient,
  	connectionManager,
  	read,
  	write,
  	getArticles
};