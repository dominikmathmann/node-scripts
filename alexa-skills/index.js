const https = require("https");
const querystring = require("querystring");

const config = require("./config.js");

const playlists = [
  { url: "spotify:playlist:37i9dQZF1DWU0ScTcjJBdj", name: "Relax und Unwind" },
  { url: "spotify:playlist:058Z3E0rcEZh8839BVzclQ", name: "Romantische Musik" },
  { url: "spotify:playlist:37i9dQZF1DWZeKCadgRdKQ", name: "Deep Focus" },
  { url: "spotify:playlist:4XnXfBf32rUj2dRic69dji", name: "Leise" }
];

const playlistsgl = [
  { url: "spotify:playlist:37i9dQZF1DWYBF1dYDPlHw", name: "Indie Songs" },
  { url: "spotify:playlist:37i9dQZF1DX8ttEdg9VJHO", name: "Feelgood Pop" },
  { url: "spotify:playlist:37i9dQZF1DX3Ebqev5IkYU", name: "Stimmungsmacher" },
  { url: "spotify:playlist:40X3QkxHzb6kF8XVf09OYi", name: "Gute Laune" }
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
  const data = `{  }`;

  httpGet(data, "/v1/me/player/shuffle?state=true", callback);
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
        shuffle(() => {});
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

getNewTokenAndPlay(getPL(playlists).url, () => {});
