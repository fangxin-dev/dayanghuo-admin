/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categorys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	create: function(req, res){
		var name = req.param('name');
		if(!name){
			res.end();
			return;
		}
		category.create({name: name}).exec(function(err, ad){
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
		category.update({id: id}, updateOptions).exec(function(err){
			res.status(200);
			console.log("48");
			res.end();
			return;
		});
	},

	find: function(req, res){
		category.find().exec(function(err, ads){
			res.json(ads);
			return;
		});
	},
	findOne: function(req, res){
		var id = req.param("id");
		category.findOne({id: id}).exec(function(err, adOne){
			res.json(adOne);
			return;
		});
	}
};
