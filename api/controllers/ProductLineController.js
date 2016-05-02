/**
 * ProductLineController
 *
 * @description :: Server-side logic for managing productlines
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	mod: function(req, res){
		product.find().exec(function(err, products){
			res.view('productline', {products: products});
		});
	},
	create: function(req, res){
		var name = req.param('name');
		var description = req.param('description');
		var remarks = req.param('remarks');
		var price = req.param('price');
		var discount = req.param('discount');
		var stock = req.param('stock');
		if(!name||!price){
			res.end();
			return;
		}
		ProductLine.create({name: name, description: description, remarks: remarks, price: price, discount: discount, stock: stock }).exec(function(err, ad){
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
		var price = req.param('price');
		if(price){
			updateOptions.price = price;
		}
		var discount = req.param('discount');
		if(discount){
			updateOptions.discount = discount;
		}
		var stock = req.param('stock');
		if(stock){
			updateOptions.stock = stock;
		}
		ProductLine.update({id: id}, updateOptions).exec(function(err){
			res.status(200);
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
		ProductLine.findOne({id: id}).exec(function(err, adOne){
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
							res.redirect('/productline.html');
							return;
						});
					})
				});
			});
		});
	},
	find: function(req, res){
		ProductLine.find().populate('frontImage').exec(function(err, ads){
			res.json(ads);
			return;
		});
	},
	findOne: function(req, res){
		var id = req.param("id");
		ProductLine.findOne({id: id}).populate('frontImage').exec(function(err, adOne){
			var images = adOne.images;
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
		ProductLine.findOne({id: prodId}).populate('frontImage').exec(function(err, productLineOne){
			var images = productLineOne.images;
			images = _.without(images, imageId);
			productLineOne.images = images;
			productLineOne.save(function(){
				res.end();
				return;
			});

		});

	},
	setAsFrontImage: function(req, res){
		var prodLineId = req.param("prodLineId");
		var imageId = req.param("imageId");
		ProductLine.findOne({id: prodLineId}).exec(function(err, productLineOne){
			var images = productLineOne.images;
			if(-1!=images.indexOf(imageId)){
				productLineOne.frontImage = imageId;
				productLineOne.save(function(){
					res.end();
					return;
				});
			}
			res.end();
			return;

		});
	}
};
