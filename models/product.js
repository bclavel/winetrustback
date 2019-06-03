var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
  transactAddressEth: String,
  transactStatus : String,
  sellerAddressEth: String,
  sellerName : String,
  sellerPostalAddress : String,
  transactCreationDate : String,
  buyerAddressEth: String,
  buyerName : String,
  buyerPostalAddress : String,
  transactValidationDate : String,
})

var productSchema = mongoose.Schema({
  ownerAddressEth: String,
  productStatus : String,
  producerHash : String,
  productHash : String,
  productCreationDate : Date,
  productAddressEth: String,
  producerAddressEth: String,
  productDomaine : String,
  productCuvee : String,
  productYoutube : String,
  productDeskImg : String,
  productMobImg : String,
  productMillesime : String,
  productCepages : String,
  productAppellation : String,
  productRegion : String,
  productCountry : String,
  productQuality : String,
  domainHistory : String,
  productAccords : String,
  domainPostalAddress : String,
  domainUrl : String,
  domainFacebook : String,
  domainEmail : String,
  historiqueTransactions : [transactionSchema]
});

// Export pour utilisation dans les routes (collection + schéma)
module.exports = mongoose.model('products', productSchema);
