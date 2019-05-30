var mongoose = require('mongoose');

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
}
mongoose.connect('mongodb+srv://winetrustadmin:vfTqNoXBTtD01Ks3@winetrust-filml.mongodb.net/winetrust?retryWrites=true&w=majority',

    options,
    function(err) {
     console.log(err);
    }
);
