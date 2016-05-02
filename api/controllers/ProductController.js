/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('underscore');
module.exports = {
	create: function(req, res){
		var name = req.param('name');
		var description = req.param('description');
		var remarks = req.param('remarks');

		if(!name){
			res.end();
			return;
		}
		product.create({name: name, description: description, remarks: remarks }).exec(function(err, ad){
			if(err){
				res.end();
				return;
			}
			res.status(200);
			res.json(ad);
			return;
		});
	}
  ,
	update: function(req, res){
		console.log('31');
		var id = req.param('id');
		var updateOptions = {};
		var name = req.param('name');
		if(name){
			updateOptions.name = name;
		}
		var description = req.param('description');
		if(description){
			updateOptions.description = description;
		}
		var remarks = req.param('remarks');
		if(remarks){
			updateOptions.remarks = remarks;
		}
		console.log("45");
		product.update({id: id}, updateOptions).exec(function(err){
			res.status(200);
			console.log("48");
			res.end();
			return;
		});
	},
	image: function(req, res){
		var id = req.param("id");
		if(!id){
			res.end();
			return;
		}
		product.findOne({id: id}).exec(function(err, adOne){
			if(err||!adOne){
				res.end();
				return;
			}
			req.file('files[]').upload(function (err, files) {
				if(err||!files||files.length!=1){
					res.end();
					return;
				}
				var imagePath;
				imagePath = files[0].fd;
				var cloudinary = sails.config.cloudinary.get();
				console.log("84");
				cloudinary.uploader.upload(imagePath, function(cloudinaryRes) {
					console.log(cloudinaryRes);
					image.create({publicId: cloudinaryRes.public_id, version: cloudinaryRes.version, format: cloudinaryRes.format}).exec(function(err, imageCreated){
						var images = adOne.images;
						images.push(imageCreated.id);
						adOne.images = images;
						adOne.save(function(err){
							res.status(200);
							res.redirect('/product.html');
							return;
						});
					})
				});
			});
		});
	},
	find: function(req, res){
		product.find().populate('frontImage').exec(function(err, ads){
			res.json(ads);
			return;
		});
	},
	findOne: function(req, res){
		console.log("108");
		var id = req.param("id");
		product.findOne({id: id}).populate('frontImage').exec(function(err, adOne){
			var images = adOne.images;
			console.log("112");
			if(images.length){
				image.find({id: images}).exec(function(err, imagesArr){
					adOne.images = imagesArr;
					res.json(adOne);
					return;
				});
			}else{
				adOne.images = [];
				res.json(adOne);
				return;
			}

		});

	},
	deleteImage: function(req, res){
		var prodId = req.param("prodId");
		var imageId = req.param("imageId");
		product.findOne({id: prodId}).populate('frontImage').exec(function(err, productOne){
			var images = productOne.images;
			images = _.without(images, imageId);
			productOne.images = images;
			productOne.save(function(){
				res.end();
				return;
			});

		});

	},
	setAsFrontImage: function(req, res){
		var prodId = req.param("prodId");
		var imageId = req.param("imageId");
		product.findOne({id: prodId}).exec(function(err, productOne){
			var images = productOne.images;
			if(-1!=images.indexOf(imageId)){
				productOne.frontImage = imageId;
				productOne.save(function(){
					res.end();
					return;
				});
			}
			res.end();
			return;

		});
	}

};
