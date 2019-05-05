const util = require('util.js');
const _ = require('lodash');
const dynamodb = new util.AWS.DynamoDB();

const params = {
	TableName: 'AVRTable'
};


async function broadcast() {
    console.log('broadcast');
}

async function putNewRow(connectionId, alexaId = util.AlexaId) {
	var putParams = _.cloneDeep(params);
	putParams.Item = {
		"alexaUserId": {
			S: alexaId
		},
		"unityUserId": {
			S: connectionId
		}
	}
	const alreadyPresentItems = await getRowById(alexaId); // there should be only one
	if (alreadyPresentItems.length > 0) {
		await updateUnityId(alreadyPresentItems, connectionId);
	}else {
		return new Promise(function(resolve, reject) {
			dynamodb.putItem(putParams, 
			(err, data) => {
   				if (err) {
					console.log('Error: ', err);
					reject(err);
				}
  				resolve(data);
  			});
		})
	}
}

async function getArticles() {
	const scanParams = {
		TableName: 'Articles',
		Select: 'ALL_ATTRIBUTES'
	}
	var documentClient = new util.AWS.DynamoDB.DocumentClient();
	return await new Promise(function(resolve, reject) {
		documentClient.scan(scanParams, 
			(err, data) => {
   				if (err) {
					console.log('Error: ', err);
					reject(err);
				}
  				resolve(data.Items);
  		});
	})
}

async function getRowById(alexaId, projection) {
	var scanParams = _.cloneDeep(params);
	scanParams.ExpressionAttributeValues = {
   		":a": {
    	 	S: alexaId    
 		}
  	};
  	if (!!projection) {
  		scanParams.ProjectionExpression = projection;
  	}
	scanParams.FilterExpression = "alexaUserId = :a";
	return await new Promise(function(resolve, reject) {
		dynamodb.scan(scanParams, 
			(err, data) => {
   				if (err) {
					console.log('Error: ', err);
					reject(err);
				}
  				resolve(data.Items);
  		});
	})
}

// if the alexaUserId is already present we update the id for the client
async function updateUnityId(items, connectionId) {
	if (items.length === 0) {
		items = _.cloneDeep(await getRowById(util.AlexaId));
	}
	var updateParams = _.cloneDeep(params);
	updateParams.ExpressionAttributeValues = {
   		":u": {
    	 	S: connectionId    
 		}
  	};
  	updateParams.Key = {
   		"alexaUserId": items[0].alexaUserId
  	};
  	updateParams.UpdateExpression = "SET unityUserId = :u";
	return await new Promise(function(resolve, reject) {
		dynamodb.updateItem(updateParams, 
			(err, data) => {
   				if (err) {
					console.log('Error: ', err);
					reject(err);
				}
  				resolve(data);
  		});
	})
}

async function isClientConnected(alexaId = util.AlexaId) {
	return !(await getClientId(alexaId) === 'disconnected');
}

async function getClientId(alexaId = util.AlexaId) {
	const row = await getRowById(alexaId);
	return row[0].unityUserId.S;
}

async function writeRow(alexaId = util.AlexaId, writeParams) {
	var updateParams = _.cloneDeep(params);
  	updateParams.Key = {
   		"alexaUserId": {
   			S: alexaId
   		}
  	};
  	updateParams.ExpressionAttributeValues = {};
  	updateParams.UpdateExpression = "SET ";
  	const keys = Object.keys(writeParams);
  	const vals = Object.values(writeParams);
  	keys.forEach((k, idx) => { 
  		const EAV = ':' + idx;
  		updateParams.ExpressionAttributeValues[EAV] = { S: vals[idx]};
  		if (idx > 0) { updateParams.UpdateExpression += ', ';}
  		const s = k + ' = ' + EAV;
  		updateParams.UpdateExpression += s;
  	});
	return await new Promise(function(resolve, reject) {
		dynamodb.updateItem(updateParams, 
			(err, data) => {
   				if (err) {
					console.log('Error: ', err);
					reject(err);
				}
  				resolve(data);
  		});
	})
}

module.exports = {
    broadcast,
    params,
    putNewRow,
    getRowById,
    getArticles,
    getClientId,
    updateUnityId,
    isClientConnected,
    writeRow
};