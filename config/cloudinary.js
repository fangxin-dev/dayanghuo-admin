
function Cloudinary() {
    this.config = {
        cloud_name: 'djdts3tqq', 
        api_key: '751938897414326', 
        api_secret: '-fFGH3b-tp6RhZGgt8VnU6Z7m74' 
        
    };
    this.url = "url: 'cloudinary://751938897414326:-fFGH3b-tp6RhZGgt8VnU6Z7m74@djdts3tqq'";
}

Cloudinary.prototype.get = function get(){
    var cloudinary = require("cloudinary");
    cloudinary.config(this.config);
    return cloudinary;
    
};



module.exports.cloudinary = {
    get: function(){
        var cloudinary = new Cloudinary().get();
        return cloudinary;
    }
}
