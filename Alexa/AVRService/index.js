// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
const socketHandler = require('socketHandler.js');
var connectionId = '';
/*DEFAULT INTENT HANDLERS */

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        var speechText = 'Benvenuto, mi chiamo AVR, il tuo <lang xml:lang="en-US">Personal Shopping Assistant</lang>. ';
        if (await dynamo.isClientConnected(util.AlexaId)) { 
            connectionId = await dynamo.getClientId(util.AlexaId);
            await socketHandler.sendMessageToClient('AVR Skill Inititated', connectionId);
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
        const handleRequest = handlerInput.requestEnvelope.request;
        if(handleRequest.type === 'IntentRequest'&& handleRequest.intent.name === 'Tutorial') {
            const slots = handleRequest.intent.slots;
            console.log(slots);
            if(slots.step || slots.stepCardinal){
                const attributesManager = handlerInput.attributesManager;
                const sessionAttributes = attributesManager.getSessionAttributes();
                sessionAttributes.step = handleRequest.intent.slots.step.value;
                sessionAttributes.stepCardinal = handleRequest.intent.slots.stepCardinal.value;
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
        var speechText = '';
        var mustWrite = true;
        console.log(sessionAttributes);
        // se AVR non riceve lo step ricominciamo dall'ultimo step eseguito (can be improved)
        if (typeof sessionAttributes.step === 'undefined' && typeof sessionAttributes.stepCardinal === 'undefined'){
            sessionAttributes = await attributesManager.getRowById(util.AlexaId) || {};
            proceeded = false;
        }
        else if (typeof sessionAttributes.step === 'undefined'){
            sessionAttributes.step = sessionAttributes.stepCardinal.slice(0,-1); 
        }
        else if (typeof sessionAttributes.stepCardinal === 'undefined'){
            sessionAttributes.stepCardinal = sessionAttributes.step + 'o';
        }
        if(sessionAttributes.step === '1' || sessionAttributes.stepCardinal === '1o'){
            speechText += '<emphasis level="reduced">Iniziamo con le presentazioni: mi chiamo <lang xml:lang="en-US">Assistant in Virtual Retailing</lang>, per gli amici AVR. E tu come ti chiami?</emphasis>';
        }else{
            speechText += '<emphasis level="reduced">Ok, iniziamo!</emphasis><say-as interpret-as="interjection">yippii</say-as>';
        }
        if (mustWrite) {
            const objToW = { step: sessionAttributes.step, stepCardinal: sessionAttributes.stepCardinal };
            await dynamo.writeRow(util.AlexaId, objToW);
        }
        var row = await dynamo.getRowById(util.AlexaId, 'step, stepCardinal');

        await socketHandler.sendMessageToClient(row, connectionId);
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
}

/* LAMBDA SETUP */
// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

exports.handler = Alexa.SkillBuilders.custom()
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
