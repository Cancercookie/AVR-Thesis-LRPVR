const util = require('util.js');
const mainFuncs = require('main.js');
const dynamo = require('dynamo.js');

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

async function AVRSays(speechText, connectionId) {
	if(speechText.charAt(0) === '_'){
		await sendMessageToClient(speechText, connectionId);
	}else{
		await sendMessageToClient('_AVRSAYS:' + speechText, connectionId);	
	}
}

async function connectionManager(event, context) {
	const eventType = event.requestContext.eventType;
	if (eventType === 'CONNECT'){
		await dynamo.putNewRow(event.requestContext.connectionId);
		await dynamo.writeRow(util.AlexaId, {cart: []}, true);
		await dynamo.writeRow(util.AlexaId, {cartPrice: '0'}, true);
	}else if (eventType === 'DISCONNECT') {
		await dynamo.updateUnityId([], 'disconnected');
		await dynamo.writeRow(util.AlexaId, {cart: []}, true);
		await dynamo.writeRow(util.AlexaId, {cartPrice: '0'}, true);
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

async function intoCart(event, context) {
	var speechText = '';
        var articles = await mainFuncs.intoCart(util.alexaId);
        if (articles.length === 0){
            speechText = 'Al momento il tuo carrello è vuoto.';
        }else{
            speechText = 'Nel tuo carrello sono presenti:';
            console.log(articles);
            articles.forEach((art, idx) => {
                speechText += art.qta + ' ' + art.name;
                if(idx < articles.length - 1) speechText += ', ';
                else speechText += '.';
            });
        }
	await sendMessageToClient(speechText, event.requestContext.connectionId);
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

async function buy(event, context, callback) {
	await mainFuncs.buy(util.AlexaId);
    return util.success;
}

async function addToCart(event, context, callback) {
	const body = JSON.parse(event.body);
	console.log(body);
	await mainFuncs.addToCart(util.AlexaId, body.articleIDs);
    return util.success;
}

async function getTotal(event, context, callback) {
	const cartPrice = await dynamo.getRowById(util.AlexaId, 'cartPrice', true);
	await sendMessageToClient(cartPrice, event.requestContext.connectionId);
	return util.success;
}

module.exports = {
    sendMessageToClient,
  	connectionManager,
  	read,
  	write,
  	buy,
  	addToCart,
  	intoCart,
  	getTotal,
  	getArticles,
  	AVRSays
};