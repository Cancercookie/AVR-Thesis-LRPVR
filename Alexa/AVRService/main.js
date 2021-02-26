const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
var connectionId = '';

async function addToCart(alexaId = util.AlexaId, article) {
	console.log('Add: ' + article);
	var cart = await getCart(alexaId);
	cart = cart.concat(article);
	if (await dynamo.writeRow(alexaId, {cart: cart}, true)) {
		const a = await dynamo.getArticle(article);
		console.log(a);
		const articlePrice = parseFloat(a.price);
		const p = await dynamo.getRowById(alexaId, 'cartPrice', true);
		const cartPrice = parseFloat(p.cartPrice);
		await dynamo.writeRow(alexaId, {cartPrice: (cartPrice + articlePrice).toString()})
		var speechText = 'Articolo aggiunto al carrello: ' + article;
		await sendMessageToClient('_ARTICLE: ' + article, connectionId);
		await sendMessageToClient('_AVRSAYS: ' + speechText, connectionId);
		return speechText;
	}
}

async function buy(alexaId = util.AlexaId) {
	var cart = getCart(alexaId);
	if (await dynamo.writeRow(alexaId, {cart: [], cartPrice: '0'}, true)){
		await sendMessageToClient('_SESSION:BOUGHT', connectionId);
		await sendMessageToClient('_AVRSAYS: Grazie mille per il tuo acquisto', connectionId);
	}
}

function crossCart(articles, cart) {
	articles.forEach(a => {
		cart.forEach(c => {
			if (a.articleID === c.articleID){
				c['name'] = a.name;
			}
		});
	});
}

async function intoCart(alexaId = util.AlexaId){
	var cart = await getCart(alexaId);
	var aInfo = await dynamo.getArticles();
	var articles = [];
	if (cart.length > 0){
		cart.forEach(a => {
			var pos = -1;
			articles.forEach((b, idx) => a === b.articleID && pos === -1 ? pos = idx : pos = -1);
			if (pos === -1){
				articles.push({
					articleID: a,
					qta: 1
				});
			}
			else{
				articles[pos].qta += 1;
			} 
		});
	}
	crossCart(aInfo, articles);
	return articles;
}

async function getCart(alexaId = util.AlexaId) {
	var r = await dynamo.getRowById(alexaId, 'cart, unityUserId', true);
	// we expect this to be the first called function so we set connectionId here
	connectionId = r.unityUserId;
	var cart = r.cart;
	return cart;
}

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

module.exports = {
    buy,
    addToCart,
    intoCart
};