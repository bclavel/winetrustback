var express = require('express');
var router = express.Router();
var productModel = require('../models/product');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to WineTrust BackEnd' });
});


router.get('/createproduct', function(req, res, next) {

  var newProduct = new productModel({
    productDomaine : req.body.productDomaine,
    productCuvee : req.body.productCuvee,
    productDeskImg : req.body.productDeskImg,
    productMobImg : req.body.productMobImg,
    productMillesime : req.body.productMillesime,
    productCepages : req.body.productCepages,
    productAppellation : req.body.productAppellation,
    productRegion : req.body.productRegion,
    productCountry : req.body.productCountry,
    domainHistory : req.body.domainHistory,
    productAccords : req.body.productAccords,
    domainPostalAddress : req.body.domainPostalAddress,
    domainUrl : req.body.domainUrl,
    domainFacebook : req.body.domainFacebook,
    domainEmail : req.body.domainEmail,
  })
  newProduct.save(
    function (error, product) {
      console.log('INDEX BACK - New product save', product);
      res.json({result : true, data});
    });
});

module.exports = router;
