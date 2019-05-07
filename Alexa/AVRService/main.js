const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
const socketHandler = require('socketHandler.js');
var connectionId = '';

async function addToCart(alexaId = util.AlexaId, articles) {
	var cart = getCart(alexaId);
	await dynamo.writeRow(alexaId, {cart: cart}, true);
    return ;
}

async function buy(alexaId = util.AlexaId) {
	var cart = getCart(alexaId);
    return ;
}

async function getCart(alexaId = util.AlexaId) {
	var r = await dynamo.getRowById(util.AlexaId, 'cart', true);
	var cart = r.cart;
	cart = cart.concat(articles);
	return cart;
}

module.exports = {
    buy,
    addToCart
};