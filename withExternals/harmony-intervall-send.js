var harmony = require("harmonyhubjs-client");

harmony("192.168.178.26").then(function(harmonyClient) {
  harmonyClient.getAvailableCommands().then(function(commands) {
    var device = commands.device[1];
    var powerControls = device.controlGroup
      .filter(function(group) {
        return group.name.toLowerCase() === "displaymode";
      })
      .pop();
    var functionToCall = powerControls["function"][0];

    if (functionToCall) {
      var encodedAction = functionToCall.action.replace(/\:/g, "::");
      harmonyClient.send("holdAction", "action=" + encodedAction + ":status=press");
      harmonyClient.send("holdAction", "action=" + encodedAction + ":status=release");
      harmonyClient.end();
    } else {
      throw new Error("Cant fire command.");
    }
  });
});
