const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
const socketHandler = require('socketHandler.js');
var connectionId = '';

async function addToCart(alexaId = util.AlexaId, articles) {
	console.log('Add: ' + articles);
	var cart = await getCart(alexaId);
	cart = cart.concat(articles);
	if (await dynamo.writeRow(alexaId, {cart: cart}, true)) {
		// await socketHandler.sendMessageToClient({articles, cart}, connectionId);
	}
}

async function buy(alexaId = util.AlexaId) {
	var cart = getCart(alexaId);
	if (await dynamo.writeRow(alexaId, {cart: []}, true)){
		// await socketHandler.sendMessageToClient(cart, connectionId);
	}
}

async function getCart(alexaId = util.AlexaId) {
	var r = await dynamo.getRowById(alexaId, 'cart, unityUserId', true);
	connectionId = r.unityUserId
	var cart = r.cart;
	return cart;
}

module.exports = {
    buy,
    addToCart
};