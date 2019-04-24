// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
const persistenceAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const webSocketHandler = require('socketHandler.js');

/*DEFAULT INTENT HANDLERS */

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const row = await dynamo.getRowById(util.AlexaId);
        var speechText = 'Benvenuto, mi chiamo AVR, il tuo <lang xml:lang="en-US">Personal Shopping Assistant</lang>. ';
        if (row.length > 0 && await dynamo.isClientConnected(util.AlexaId)) { 
            speechText += 'In cosa posso aiutarti?'; 
        }
        else { 
            dynamo.putNewRow('disconnected');
            speechText += 'Avvia il programma nella realtà virtuale per procedere. Fammi sapere quando sei pronto.'; 
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Benvenuto, mi chiamo AVR. In cosa posso aiutarti?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = '<say-as interpret-as="interjection">vabbè</say-as>';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;
        console.log('Errore nell handler');
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Scusa, non ho capito. Riprova.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

/*CUSTOM INTENT HANDLERS */

const BuyIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Buy';
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('Grazie mille per il tuo acquisto').getResponse();
    }
}

const HideIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Hide';
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('').getResponse();
    }
}

const SuggestIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Suggest';
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('').getResponse();
    }
}

const PriceIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Price';
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('').getResponse();
    }
}

const ChatIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Chat';
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('').getResponse();
    }
}

const StartIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Start';
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('').getResponse();
    }
}

const TutorialIntentHandler = {
    canHandle(handlerInput){
        if(handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Tutorial') {
            console.log(handlerInput.requestEnvelope.request.intent.slots.step);
            const slots = handlerInput.requestEnvelope.request.intent.slots;
            if(slots.step || slots.stepCardinal){
                const attributesManager = handlerInput.attributesManager;
                const sessionAttributes = attributesManager.getSessionAttributes();
                sessionAttributes.step = handlerInput.requestEnvelope.request.intent.slots.step.value;
                sessionAttributes.stepCardinal = handlerInput.requestEnvelope.request.intent.slots.stepCardinal.value;
                attributesManager.setSessionAttributes(sessionAttributes);
                return true;
            }
        }else{
            return false;
        }
    },
    async handle(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        let sessionAttributes = attributesManager.getSessionAttributes();
        // se AVR non riesce a ricevere lo step ricominciamo daccapo (can be improved)
        if (typeof sessionAttributes.step === 'undefined' && typeof sessionAttributes.stepCardinal === 'undefined'){
            sessionAttributes = await attributesManager.getPersistentAttributes() || {};
        }
        console.log(sessionAttributes);
        if(sessionAttributes.step === '1' || sessionAttributes.stepCardinal === '1o'){
            sessionAttributes.step = '1';
            sessionAttributes.stepCardinal = '1o';
            attributesManager.setPersistentAttributes({step: sessionAttributes.step});
            attributesManager.setPersistentAttributes({stepCardinal: sessionAttributes.stepCardinal});
            webSocketHandler.sendMessageToClient({Body: 'funziona'}, {requestContext: {connectionId: sessionAttributes.connectionId}});
            await attributesManager.savePersistentAttributes();
            return handlerInput.responseBuilder.speak('<emphasis level="reduced">Iniziamo con le presentazioni: mi chiamo <lang xml:lang="en-US">Assistant in Virtual Retailing</lang>, per gli amici AVR. E tu come ti chiami?</emphasis>').getResponse();
        }else{
            return handlerInput.responseBuilder.speak('<emphasis level="reduced">Ok, iniziamo!</emphasis><say-as interpret-as="interjection">yippii</say-as>').getResponse();
        }
    }
}

/* LAMBDA SETUP */
// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(new persistenceAdapter.DynamoDbPersistenceAdapter({tableName: 'AVRTProvable', createTable: true}))
    .addRequestHandlers(
        BuyIntentHandler,
        ChatIntentHandler,
        PriceIntentHandler,
        SuggestIntentHandler,
        HideIntentHandler,
        TutorialIntentHandler,
        StartIntentHandler,
        LaunchRequestHandler, // defaults
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(ErrorHandler)
.lambda();
