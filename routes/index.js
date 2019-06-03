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
  // console.log('ROUTE BACK - Create product req.body', req.body);
  // cloudinary.v2.uploader.upload(req.body.productDeskImg,
  //   function(error, result) {
  //     console.log('gg result !', result)
  //     console.log('erreur gro !', error)
  //   });

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
      res.json({result : true, product});
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
      res.json({result:true, isUserExist: true});
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
    req.files.productDeskImg.mv('./public/images/'+req.files.productDeskImg.name+'.'+desktopExtention,

      function(err) {
        if (err) {
          console.log(err);
          res.json({result: false, message: err} );
        } else {
          cloudinary.v2.uploader.upload('./public/images/'+req.files.productDeskImg.name+'.'+desktopExtention,
            function(error, result) {
              console.log('gg result !', result)
              console.log('erreur gro !', error)

              productModel.findById(req.files.productDeskImg.name, function(err, product){
                if (product) {
                  console.log('Produit trouvé', product);
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
    req.files.productMobImg.mv('./public/images/'+req.files.productMobImg.name+'.'+mobileExtention,

      function(err) {
        if (err) {
          console.log(err);
          res.json({result: false, message: err} );
        } else {
          cloudinary.v2.uploader.upload('./public/images/'+req.files.productMobImg.name+'.'+mobileExtention,
            function(error, result) {
              console.log('gg result !', result)
              console.log('erreur gro !', error)

              productModel.findById(req.files.productMobImg.name, function(err, product){
                if (product) {
                  console.log('Produit trouvé', product);
                } else {
                  console.log('walou pas de produit');
                }
                product.productMobImg = result.secure_url
                console.log('Produit updaté', product);
                product.save(function (error, product) {
                  console.log('INDEX BACK - product Update save productMobImg', product);
                  res.json({result : true, product});
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



module.exports = router;
