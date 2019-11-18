var harmony = require("harmonyhubjs-client");

harmony("192.168.178.26").then(function(harmonyClient) {
  harmonyClient.getAvailableCommands().then(function(commands) {
    var device = commands.device[1];
    var powerControls = device.controlGroup
      .filter(function(group) {
        return group.name.toLowerCase() === "volume";
      })
      .pop();
    var functionUp = powerControls["function"][1];
    var functionDown = powerControls["function"][2];

    if (functionUp && functionDown) {
      var encodedActionUp = functionUp.action.replace(/\:/g, "::");
      var encodedActionDown = functionDown.action.replace(/\:/g, "::");
      harmonyClient.send("holdAction", "action=" + encodedActionDown + ":status=press");
      harmonyClient.send("holdAction", "action=" + encodedActionDown + ":status=release");
      harmonyClient.send("holdAction", "action=" + encodedActionUp + ":status=press");
      harmonyClient.send("holdAction", "action=" + encodedActionUp + ":status=release");
      harmonyClient.end();
    } else {
      throw new Error("Cant fire command.");
    }
  });
});
