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

async function getRowById(alexaId) {
	var scanParams = _.cloneDeep(params);
	scanParams.ExpressionAttributeValues = {
   		":a": {
    	 	S: alexaId    
 		}
  	};
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
  	}
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

module.exports = {
    broadcast,
    params,
    putNewRow,
    getRowById,
    updateUnityId
};