// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

// std-endpoint arn:aws:lambda:us-east-1:329392341144:function:fbb19cc1-50b2-4352-98cb-a2edaf497869:Release_0

const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const webSocketEndopoint = 'https://cxr4c7tqeh.execute-api.eu-west-1.amazonaws.com/production';
const webSocketHandler = require('socketHandler');

/*DEFAULT INTENT HANDLERS */

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Benvenuto, mi chiamo AVR, il tuo <lang xml:lang="en-US">Personal Shopping Assistant</lang>. In cosa posso aiutarti?';
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

/* CONSTANTS */

/* HELPER FUNCTIONS */

/* LAMBDA SETUP */
// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

exports.handler = Alexa.SkillBuilders.custom().withPersistenceAdapter(
    new persistenceAdapter.S3PersistenceAdapter({bucketName:'avrbucket'})
).addRequestHandlers(
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
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
