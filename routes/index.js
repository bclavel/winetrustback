var express = require('express');
var router = express.Router();
var productModel = require('../models/product');
var Crypto = require('crypto-js');
var userModel = require('../models/user');
var cloudinary = require('cloudinary');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to WineTrust BackEnd' });
});


router.post('/createproduct', function(req, res, next) {

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
  console.log('productData', productData);

  var producerHash = Crypto.SHA256(JSON.stringify(productData)).toString()
  console.log('producerHash', producerHash);

  var newProductWithHash = new productModel({
    producerAddressEth : req.body.producerAddressEth,
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
      res.json(product);
    });
  });

// route POST connexion via un compte user existant MOBILE
router.post('/signin', (req,res,next)=> {
  console.log('signin is running...');
  userModel.findOne({
    email: req.body.email,
    password: req.body.password
  },
  (error,data)=>{
    if(!data){
      res.json({result: false, isUserExist:false});
    } else {
      res.json({result:true, isUserExist: true, data});
    }
  });
});


// route POST création d'un nouveau User sur Mobile
router.post('/createuser', function(req,res,next){
  console.log('creating user is running...');
  const newUser= new userModel({
    adress0x: req.body.adress0x,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    companyName: req.body.companyName,
    companyAddress: req.body.companyAddress
  })
  userModel.findOne({
    email: req.body.email,
  }, (error, data) =>{
    if(data){
      res.json({result: false, error})
      console.log('user déja connu')
    } else {
      newUser.save(function(error, user){
        console.log('creatinguser Successed')
        res.json({result: true, user});
      });
    }
  });
});

// route GET récupération des données produits mobile
router.get('/getproductmobile', function(req,res,next){
  console.log('récupération en cours...');
  productModel.findOne({
    producerHash: req.query.producerHash
  }, (error, product) =>{
    if(product){
      res.json(product)
      console.log('produit retrouvé')
    } else {
      res.json({ result: false, error})
    }
  })
});

router.get('/updateproduct', function(req, res, next) {
  productModel.findById(req.query.productId, function(err, product){
    if (product) {
      console.log('Produit trouvé', product);
    } else {
      console.log('walou pas de produit');
    }
    product.ownerAddressEth =  req.query.ownerAddressEth;
    product.productAddressEth = req.query.productAddressEth
    console.log('Produit updaté', product);
    product.save(function (error, product) {
      console.log('INDEX BACK - product Update save', product);
      res.json({result : true, product});
    })
  })
})


router.post('/uploadpictures', function(req, res, next) {
  console.log('Route Upload Pictures - Req.files >>', req.files)

  var desktopExtention;
  if(req.files.productDeskImg.mimetype == "image/jpeg") {
    desktopExtention = 'jpg';
  } else if(req.files.productDeskImg.mimetype == "image/png") {
    desktopExtention = 'png';
  }

  if(desktopExtention) {
    req.files.productDeskImg.mv('./public/imagesdesktop/'+req.files.productDeskImg.name+'.'+desktopExtention,

      async function(err) {
        if (err) {
          console.log(err);
        } else {
          await cloudinary.v2.uploader.upload('./public/imagesdesktop/'+req.files.productDeskImg.name+'.'+desktopExtention,
            function(error, result) {
              console.log('gg result desktop !', result)
              console.log('erreur gro desktop !', error)

              productModel.findById(req.files.productDeskImg.name, function(err, product){
                if (product) {
                  console.log('Produit trouvé desktop', product);
                } else {
                  console.log('walou pas de produit');
                }
                product.productDeskImg =  result.secure_url;
                console.log('Produit updaté', product);
                product.save(function (error, product) {
                  console.log('INDEX BACK - product Update save productDeskImg', product);
                })
              })
            }
          );
        }
      }
    );
  } else {
    console.log('pas extention, ça dégage ! ');
  }

  var mobileExtention;
  if(req.files.productMobImg.mimetype == "image/jpeg") {
    mobileExtention = 'jpg';
  } else if(req.files.productMobImg.mimetype == "image/png") {
    mobileExtention = 'png';
  }

  if(mobileExtention) {
    req.files.productMobImg.mv('./public/imagesmobile/'+req.files.productMobImg.name+'.'+mobileExtention,

      async function(err) {
        if (err) {
          console.log(err);
        } else {
          await cloudinary.v2.uploader.upload('./public/imagesmobile/'+req.files.productMobImg.name+'.'+mobileExtention,
            function(error, result) {
              console.log('gg result mobile !', result)
              console.log('erreur gro mobile !', error)

              productModel.findById(req.files.productMobImg.name, function(err, product){
                if (product) {
                  console.log('Produit trouvé mobile', product);
                } else {
                  console.log('walou pas de produit');
                }
                product.productMobImg = result.secure_url
                console.log('Produit updaté', product);
                product.save(function (error, product) {
                  console.log('INDEX BACK - product Update save productMobImg', product);
                  res.json(product);
                })
              })
            }
          );
        }
      }
    );
  } else {
    console.log('pas extention, ça dégage ! ');
  }
})

router.get('/getproducts', function(req, res, next) {
  productModel.find()
  .or([{ownerAddressEth : req.query.userAddress}, {lastBuyerAddressEth : req.query.userAddress}])
  .exec(function(err, products){
    if (products) {
      console.log('Produits trouvés', products);
      res.json(products);
    } else {
      console.log('walou pas de produit');
      res.json({result : false, err});
    }
  })
})

// route GET récupération des données produits desktop
router.get('/getproductdesktop', function(req,res,next){
  console.log('récupération en cours...');
  productModel.findOne({
    productAddressEth: req.query.productAddressEth
  }, (error, product) =>{
    if(product){
      res.json(product)
      console.log('produit retrouvé')
    } else {
      res.json({ result: false, error})
    }
  })
});

router.post('/createtransact', function(req, res, next) {
  console.log('req body route create transact>>', req.body);

  var today = new Date();

  userModel.findOne({companyName: req.body.buyerName})
  .exec(function(err, user){
    if(user){

      productModel.findOne({productAddressEth : req.body.productAddressEth})
      .exec(function(err, product){
        if (product) {
        console.log('Produit trouvé', product);
        product.productStatus = 'transaction en cours';
        product.lastBuyerAddressEth = user.adress0x;
        product.lastTransactCreationDate = today;
        product.historiqueTransactions.push({
        transactStatus : 'Validation en attente',
        sellerAddressEth: req.body.sellerAddressEth,
        sellerName : req.body.sellerName,
        buyerPostalAddress : user.companyAddress,
        transactCreationDate : today,
        buyerAddressEth: user.adress0x,
        buyerName : req.body.buyerName,
        buyerPostalAddress : user.CompanyAddress,
         });
            product.save(
              function(error, product) {
              console.log('INDEX BACK - transact save', product);
              res.json({product});
            })
     } else {
      console.log('walou pas de produit');
      res.json({result : false, err});
    }
  })}
  })
})

router.get('/productHash', function(req,res,next) {
  productModel.findOne({productAddressEth: req.query.productAddressEth})
  .exec(function(err, product){
    if(product) {
      console.log('Voici votre historique transact', product);
      var productHash = Crypto.SHA256(JSON.stringify(product)).toString()
      console.log('voici mon productHash', productHash);
      res.json({product, productHash});
    }
  })
});


router.post('/validtransact', function(req,res,next) {
  console.log('req body route valid transact>>', req.body);

  var today = new Date();

  productModel.findOne({productAddressEth : req.body.productAddressEth})
  .exec(function(err,product){
    if(product){
      console.log('Produit trouvé', product);
      product.historiqueTransactions[req.body.transactCount-1].transactStatus = 'validée'
      product.historiqueTransactions[req.body.transactCount-1].transactValidationDate = today
      product.historiqueTransactions[req.body.transactCount-1].transactProductHash = req.body.transactProductHash
      product.transactProductHash = req.body.transactProductHash
      product.ownerAddressEth = req.body.buyerAddress
      product.productStatus = 'en stock'
      product.save(
      function (error, product) {
        console.log('validation transaction save', product);
        res.json(product);
      });
    }
  })
});


module.exports = router;
