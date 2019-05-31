var express = require('express');
var router = express.Router();
var productModel = require('../models/product');
var Crypto = require('crypto-js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to WineTrust BackEnd' });
});


router.post('/createproduct', function(req, res, next) {
  console.log('ROUTE BACK - Create product req.body', req.body);

  var today = new Date();

  var productData = {
    productStatus : req.body.productStatus,
    productCreationDate : today,
    productDomaine : req.body.productDomaine,
    productCuvee : req.body.productCuvee,
    productDeskImg : req.body.productDeskImg,
    productYoutube : req.body.productYoutube,
    productMobImg : req.body.productMobImg,
    productMillesime : req.body.productMillesime,
    productCepages : req.body.productCepages,
    productAppellation : req.body.productAppellation,
    productRegion : req.body.productRegion,
    productCountry : req.body.productCountry,
    productQuality: req.body.productQuality,
    domainHistory : req.body.domainHistory,
    productAccords : req.body.productAccords,
    domainPostalAddress : req.body.domainPostalAddress,
    domainUrl : req.body.domainUrl,
    domainFacebook : req.body.domainFacebook,
    domainEmail : req.body.domainEmail,
  }

  var producerHash = Crypto.SHA256(productData).toString()

  var newProductWithHash = new productModel({
    producerHash : producerHash,
    productStatus : req.body.productStatus,
    productCreationDate : today,
    productDomaine : req.body.productDomaine,
    productCuvee : req.body.productCuvee,
    productDeskImg : req.body.productDeskImg,
    productYoutube : req.body.productYoutube,
    productMobImg : req.body.productMobImg,
    productMillesime : req.body.productMillesime,
    productCepages : req.body.productCepages,
    productAppellation : req.body.productAppellation,
    productRegion : req.body.productRegion,
    productCountry : req.body.productCountry,
    productQuality: req.body.productQuality,
    domainHistory : req.body.domainHistory,
    productAccords : req.body.productAccords,
    domainPostalAddress : req.body.domainPostalAddress,
    domainUrl : req.body.domainUrl,
    domainFacebook : req.body.domainFacebook,
    domainEmail : req.body.domainEmail,
  })

  newProductWithHash.save(
    function (error, product) {
      console.log('INDEX BACK - New product save', product);
      res.json({result : true, product});
    });

});

module.exports = router;
