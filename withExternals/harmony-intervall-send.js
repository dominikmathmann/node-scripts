var harmony = require("harmonyhubjs-client");

harmony("192.168.178.26").then(function(harmonyClient) {
  var tvActive = false;

  harmonyClient.getCurrentActivity().then(function(act) {
    //TV 35319342
    if (act == 35319342) {
      harmonyClient.getAvailableCommands().then(function(commands) {
        var device = commands.device[1];
        var controls = device.controlGroup
          .filter(function(group) {
            return group.name.toLowerCase() === "miscellaneous";
          })
          .pop();

        var deviceFunction = controls["function"]
          .filter(function(f) {
            return f.name.toLowerCase() === "inputaux";
          })
          .pop();

        if (deviceFunction) {
          var encodedAction = deviceFunction.action.replace(/\:/g, "::");
          harmonyClient.send("holdAction", "action=" + encodedAction + ":status=press");
          harmonyClient.send("holdAction", "action=" + encodedAction + ":status=press");

          harmonyClient.end();
        } else {
          harmonyClient.end();
          throw new Error("Cant fire command.");
        }
      });
    } else {
      harmonyClient.end();
    }
  });
});
