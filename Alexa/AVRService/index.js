// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

const Alexa = require('ask-sdk-core');
const dynamo = require('dynamo.js');
const util = require('util.js');
const mainFuncs = require('main.js');
const socketHandler = require('socketHandler.js');
var connectionId = '';

/*DEFAULT INTENT HANDLERS */

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        var speechText = 'Ciao, sono il tuo personal shopping assistant. ';
        if (await dynamo.isClientConnected(util.AlexaId)) { 
            connectionId = await dynamo.getClientId(util.AlexaId);
            speechText += 'In cosa posso aiutarti?'; 
        }
        else { 
            dynamo.putNewRow('disconnected');
            speechText += 'Avvia il programma nella realtà virtuale per procedere. Fammi sapere quando sei pronto.'; 
        }
        await socketHandler.AVRSays('_SESSION:STARTED', connectionId);
        await socketHandler.AVRSays(speechText, connectionId);
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        const speechText = 'Il punto che vedi davanti a te è l\'indicatore del tuo centro focale, ti servirà per selezionare. Premi il grilletto per confermare. Per spostarti usa il teletrasporto premendo il tasto rotondo. ';
        await socketHandler.AVRSays('_INSTRUCTIONS: ' + speechText, connectionId);
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
    async handle(handlerInput) {
        const speechText = 'arrivederci';
        await socketHandler.AVRSays('_SESSION:ENDED', connectionId);
        return handlerInput.responseBuilder
            .speak('<say-as interpret-as="interjection">' + speechText + '</say-as>')
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    async handle(handlerInput) {
        await socketHandler.AVRSays('_SESSION:ENDED', connectionId); 
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
    async handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `Intento: ${intentName}`;
        console.log('Errore nell handler');
        await socketHandler.AVRSays(speechText, connectionId); 
        return handlerInput.responseBuilder
            .speak(speechText)
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
    async handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Scusa, non ho capito. Riprova.`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

/*CUSTOM INTENT HANDLERS */

const BuyIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Buy';
    },
    async handle(handlerInput){
    	if (handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED') {
    		await mainFuncs.buy(util.alexaId);
        	return handlerInput.responseBuilder
            .speak('<audio src="https://s3-eu-west-1.amazonaws.com/avrbucket/Cash+Register+(Kaching).mp3"/> Grazie mille per il tuo acquisto')
            .withShouldEndSession(false)
            .getResponse();
    	} else {
           	return handlerInput.responseBuilder
            .speak('Ok! Fammi sapere quando ci sei. <break time="1s"/> Se vuoi, dimmi pure cosa posso fare per te')
            .withShouldEndSession(false)
            .getResponse();
    	}
    }
};

const AddToCartIntentHandler = {
    canHandle(handlerInput){
        const handleRequest = handlerInput.requestEnvelope.request;
        if(handleRequest.type === 'IntentRequest'&& handleRequest.intent.name === 'addToCart') {
            const slots = handleRequest.intent.slots;
            console.log(slots);
            if(slots.article){
                const attributesManager = handlerInput.attributesManager;
                const sessionAttributes = attributesManager.getSessionAttributes();
                if(slots.article.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH'){
                    sessionAttributes.article = handleRequest.intent.slots.article.value;
                }else {
                    sessionAttributes.article = 'REJECTED';
                }
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
        console.log(sessionAttributes);
        if(sessionAttributes.article !== 'REJECTED'){
            var speechText = await mainFuncs.addToCart(util.alexaId, sessionAttributes.article);
        }
        else {
            var speechText = 'Putroppo l\'articolo richiesto è errato. Riprova';
            await socketHandler.AVRSays(speechText, connectionId);
        }
        return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    }
};

const IntoCartIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'IntoCart';
    },
    async handle(handlerInput){
        var speechText = '';
        var articles = await mainFuncs.intoCart(util.alexaId);
        if (articles.length === 0){
            speechText = 'Al momento il tuo carrello è vuoto.';
        }else{
            speechText = 'Nel tuo carrello sono presenti:';
            console.log(articles);
            articles.forEach((art, idx) => {
                speechText += art.qta + ' ' + art.name;
                if(idx < articles.length - 1) speechText += ', ';
                else speechText += '.';
            });
        }
        await socketHandler.AVRSays(speechText, connectionId);
        return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    }
};

const HideIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Hide';
    },
    async handle(handlerInput){
        var speechText = 'Per riattivarmi, chiamami o premi il pulsante. Arrivederci';
        await socketHandler.AVRSays(speechText, connectionId);
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const PriceIntentHandler = {
    canHandle(handlerInput){
        const handleRequest = handlerInput.requestEnvelope.request;
        if(handleRequest.type === 'IntentRequest'&& handleRequest.intent.name === 'Price') {
            const slots = handleRequest.intent.slots;
            console.log(slots);
            if(slots.article){
                const attributesManager = handlerInput.attributesManager;
                const sessionAttributes = attributesManager.getSessionAttributes();
                sessionAttributes.article = handleRequest.intent.slots.article.value;
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
        console.log(sessionAttributes);
        const a = await dynamo.getArticle(sessionAttributes.article);
        console.log(a);
        const price = parseFloat(a.price);
        console.log(price);
        var speechText = sessionAttributes.article + ' costa ' + price + '€';
        await socketHandler.AVRSays(speechText, connectionId);
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
};

const ChatIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Chat';
    },
    async handle(handlerInput){
        var speechText = '';
        await socketHandler.AVRSays(speechText, connectionId);
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
};

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
        // se AVR non riceve lo step ricominciamo continuiamo
        if (typeof sessionAttributes.step === 'undefined' && typeof sessionAttributes.stepCardinal === 'undefined'){
            sessionAttributes = await dynamo.getRowById(util.AlexaId) || {};
            if (Object.keys(sessionAttributes).length === 0 || typeof sessionAttributes.step === 'undefined' && typeof sessionAttributes.stepCardinal === 'undefined'){
                sessionAttributes.step = '1';
                sessionAttributes.stepCardinal = '1o';
            }else if (typeof sessionAttributes.step === 'undefined'){ sessionAttributes.step = sessionAttributes.stepCardinal.slice(0,-1); }
            else if (typeof sessionAttributes.stepCardinal === 'undefined'){ sessionAttributes.stepCardinal = sessionAttributes.step + 'o'; }
        }
        else if (typeof sessionAttributes.step === 'undefined'){ sessionAttributes.step = sessionAttributes.stepCardinal.slice(0,-1); }
        else if (typeof sessionAttributes.stepCardinal === 'undefined'){ sessionAttributes.stepCardinal = sessionAttributes.step + 'o'; }
        if(sessionAttributes.step === '1'){
            speechText += `<emphasis level="reduced">Iniziamo con le presentazioni: mi chiamo 
            <lang xml:lang="en-US">Assistant in Virtual Retailing</lang>, per gli amici AVR. 
            Ogni volta che vorrai sarò pronto a rispondere alle tue richieste. 
            Ponimi le domande rivolgendoti a me in maniera più naturale possibile e chiamandomi per nome.
            Mi raccomando sii cortese.</emphasis>
            Per spostarti usa il teletrasporto premendo il tasto centrale del tuo controller. Proviamo! 
            Puntalo verso la porta, rilascia non appena il cursore sarà verde. 
            Fammi sapere non appena sei pronto chiedendomi di continuare, non dimenticarti di usare il mio nome!`;
        }else if(sessionAttributes.step === '2'){
            speechText += `Il punto che vedi davanti a te è l'indicatore del tuo centro focale, mi servirà per indicarmi cosa vuoi.
            Per iniziare avvicinati allo scaffale, punta l'articolo desiderato e premi il grilletto del tuo controller.
            Prova ora, una volta fatto potremo continuare col tour.`;
        }else if(sessionAttributes.step === '3'){
            speechText += `Come puoi vedere in corrispondenza dell'articolo si è aperta l'interfaccia di acquisto del prodotto. 
            Mentre nella finestra sotto di me sono presenti le principali informazioni del prodotto. 
            Per nasconderle basta puntare altrove e premere il grilletto.
            Per aggiungere l'articolo al carrello è sufficiente tenere premuto il grilletto partendo dal centro e scorrendo verso il tasto aggiungi.
            Prova per continuare.`;
        }else if(sessionAttributes.step === '4'){
            speechText += `Per l'acquisto avvicinati al registratore di cassa vicino all'ingresso. Per confermare premi il pulsante verde usando il grilletto.
            Prova per completare il tutorial.`;
        }else{
            speechText += 'Male male';
        }
        if (mustWrite) {
            var next = parseInt(sessionAttributes.step) + 1; 
            const objToW = { step: next.toString(), stepCardinal: next + 'o' };
            await dynamo.writeRow(util.AlexaId, objToW);
        }
        var row = await dynamo.getRowById(util.AlexaId, 'step, stepCardinal');
        await socketHandler.sendMessageToClient(row, connectionId);
        await socketHandler.AVRSays(speechText, connectionId);
        return handlerInput.responseBuilder.speak(speechText).withShouldEndSession(false).getResponse();
    }
};

/*HANDLERS */

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        BuyIntentHandler,
        AddToCartIntentHandler,
        IntoCartIntentHandler,
        ChatIntentHandler,
        PriceIntentHandler,
        HideIntentHandler,
        TutorialIntentHandler,
        LaunchRequestHandler, // defaults
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(ErrorHandler)
.lambda();
