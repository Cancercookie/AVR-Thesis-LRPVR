const AWS = require('aws-sdk');
// change this to yours
const AlexaId = 'amzn1.ask.account.AHQIYF5CK37VTIUPHMQVKD5ZOO42XKDGIC2GUCHYRMMA7GOKPI6K7BZQR3JLEGPFVSOCD4UGHF5FYKZDA5XS65TPRRTMGHZWRGQGT2HHOCWFE5WBSQKUZNE3HHSTMBPHTEM64TMZ5R45YRCJNEPXORZLURCDIU223BLKBUSZE7V6TFHYA4QRXBOKHZ6CISSBNR7TOIYRDYGCUPQ';
const webSocketEndpoint = 'https://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production'; 
const success = {
  statusCode: 200
};

module.exports = {
    AWS,
    AlexaId,
    webSocketEndpoint,
    success
};