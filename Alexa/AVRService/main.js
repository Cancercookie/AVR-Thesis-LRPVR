const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
const main = require('main.js');
const socketHandler = require('socketHandler.js');
var connectionId = '';

async function addToCart(alexaId = util.AlexaId, articles) {
	var cart = await dynamo.getRowById(util.AlexaId, 'cart', true);
	console.log(cart);
	console.log(typeof cart); 
	// dynamo.writeRow(alexaId, {cart: []});
    return ;
}

async function buy(alexaId = util.AlexaId) {

    return ;
}

module.exports = {
    buy,
    addToCart
};