const Alexa = require('ask-sdk-core');

// PURE NODE 
const https = require("https");
const querystring = require("querystring");


const config = {
  accessToken:"XXX"
  authHeader: "XXX",
  refreshToken:"XXX"
};

const playlists = [ 
  { url: "spotify:playlist:4XnXfBf32rUj2dRic69dji", name: "Leise" },
  { url: "spotify:playlist:37i9dQZF1DWU0ScTcjJBdj", name: "Relax und Unwind" },
  { url: "spotify:playlist:058Z3E0rcEZh8839BVzclQ", name: "Romantische Musik" },
  { url: "spotify:playlist:37i9dQZF1DWZy0j22jjWNA", name: "Good People Good Music" },
  { url: "spotify:playlist:37i9dQZF1DWXmlLSKkfdAk", name: "Acoustic Covers" },
  { url: "spotify:playlist:37i9dQZF1DWUH2AzNQzWua", name: "Acoustic Hits" },
  { url: "spotify:playlist:37i9dQZF1DXaIrEwuQ3hyy", name: "Frühlings Chillout" },
  { url: "spotify:playlist:37i9dQZF1DX1htCFhfVtyK", name: "Zuhause" }
];

const playlistsgl = [
  { url: "spotify:playlist:37i9dQZF1DX8ttEdg9VJHO", name: "Feelgood Pop" },
  { url: "spotify:playlist:37i9dQZF1DX3Ebqev5IkYU", name: "Stimmungsmacher" },
  { url: "spotify:playlist:37i9dQZF1DX3rxVfibe1L0", name: "Mood Booster" },
  { url: "spotify:playlist:37i9dQZF1DWZESE3fHLhmD", name: "Frühlingsgefühle" },
  { url: "spotify:playlist:37i9dQZF1DX9nkam6FKfgM", name: "Spring Pop" },
  { url: "spotify:playlist:6dSyGnWdA6zG2ZeALuWTeC", name: "Gute Laune Notfall Playlist" },
  { url: "spotify:playlist:451iVL3QJ3nargldsaykib", name: "Gute Laune Radio 2023" },
  { url: "spotify:playlist:37i9dQZF1DWYJeWl6ior4d", name: "Indie Klassiker" }
];

const playlistrock = [
  { url: "spotify:playlist:37i9dQZF1DX99DRG9N39X3", name: "10s Rock Anthems" },
  { url: "spotify:playlist:37i9dQZF1DWYJeWl6ior4d", name: "Indie Klassiker" },
  { url: "spotify:playlist:37i9dQZF1DX4vth7idTQch", name: "Rockhymnen" },
  { url: "spotify:playlist:37i9dQZF1DWZJhOVGWqUKF", name: "Rock Rotation" },
  { url: "spotify:playlist:37i9dQZF1DWTKihkFkHXam", name: "Alles Rock" },
  { url: "spotify:playlist:37i9dQZF1DX8FwnYE6PRvL", name: "Rock Party" }
];

function httpGet(data, url, callback) {
  const options = {
    hostname: "api.spotify.com",
    port: 443,
    path: url,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Authorization: "Bearer " + config.accessToken
    }
  };

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    callback();
    res.on("data", d => {
      console.log(JSON.parse(d));
    });
  });

  req.on("error", error => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

function callPlaylist(plist, callback) {
  const data = `{
      "context_uri": "${plist}",
      "offset": {
        "position": ${Math.floor(Math.random() * 25)}
      },
      "position_ms": 0
    }`;

  httpGet(data, "/v1/me/player/play", callback);
}

function shuffle(callback) {
  const data = `{}`;

  httpGet(data, "/v1/me/player/shuffle?state=true", callback);
}

function next(callback) {
  const data = `{}`;

  httpGet(data, "/v1/me/player/next", callback);
}

function getNewTokenAndPlay(plist, callback) {
  var data = {
    grant_type: "refresh_token",
    refresh_token: config.refreshToken
  };

  const options = {
    hostname: "accounts.spotify.com",
    port: 443,
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: config.authHeader
    }
  };

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    res.on("data", d => {
      const jsRe = JSON.parse(d);
      config.accessToken = jsRe.access_token;
      callPlaylist(plist, () => {
        shuffle(() => {
            next(() => {});
        });
      });
    });
  });

  req.on("error", error => {
    console.error(error);
  });

  req.write(querystring.stringify(data));
  req.end();
}

function getPL(list) {
  const indx = Math.floor(Math.random() * list.length);
  console.log(indx);
  return list[indx];
}
// PURE NODE ///


//ALEXA
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log("Here we go");
        const pl=getPL(playlists);
        const speechText = 'Hier eine tolle leise Playlist für Dich: ' + pl.name;

        getNewTokenAndPlay(pl.url,  (theResult) => {
            console.log(theResult);
        });
    
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};



const LeiseIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'leise'
    },
    handle(handlerInput) {
        const pl=getPL(playlists);
        const speechText = 'Hier eine tolle leise Playlist für Dich: ' + pl.name;

        getNewTokenAndPlay(pl.url,  (theResult) => {
            console.log(theResult);
        });
    
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};

const GutelauneIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'guteLaune'
    },
    handle(handlerInput) {
        const pl=getPL(playlistsgl);
        const speechText = 'Hier eine tolle gutelaune Playlist für Dich: ' + pl.name;

        getNewTokenAndPlay(pl.url,  (theResult) => {
            console.log(theResult);
        });
    
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};

const RockIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'rock'
    },
    handle(handlerInput) {
        const pl=getPL(playlistrock);
        const speechText = 'Hier eine tolle Rock Playlist für Dich: ' + pl.name;

        getNewTokenAndPlay(pl.url,  (theResult) => {
            console.log(theResult);
        });
    
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

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
        const speechText = 'Goodbye!';
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
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        LeiseIntentHandler,
        GutelauneIntentHandler,
        RockIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
