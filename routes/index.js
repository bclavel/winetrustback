var express = require('express');
var router = express.Router();
var productModel = require('../models/product');
var Crypto = require('crypto-js');
var userModel = require('../models/user');

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

// route POST connexion via un compte user existant MOBILE
router.post('/signin', (req,res,next)=> {
  console.log('logIn is running...');
  userModel.findOne({
    email: req.body.email,
    password: req.body.password
  },
  (error,data)=>{
    if(!data){
      res.json({result: false, isUserExist:false});
    } else {
      res.json({result:true, isUserExist: true});
    }
  });
});
// res.render? 

// route POST création d'un nouveau User sur Mobile
router.post('/createuser', function(req,res,next){
  console.log('creating user is running');
  const newUser= new userModel({
    adress0x: req.body.adress0x,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    companyName: req.body.companyName,
    companyAddress: req.body.companyAddress
  });
  newUser.save(function(error, user){
    console.log('creatinguser Successed')
    res.json({result: true, user});
  });
});

module.exports = router;
