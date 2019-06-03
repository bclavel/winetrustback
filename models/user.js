var mongoose = require('mongoose'); 

var userSchema = mongoose.Schema({
    adress0x: String,
    lastName: String,
    firstName: String,
    email: String,
    password: String,
    role: String,
    companyName: String,
    companyAddress: String
});

// Export pour utilisation dans les routes (collection + Schéma)
module.exports = mongoose.model('users', userSchema); 