var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/internet');

var schema = new Schema({ title: String, description: String, image: String, date:Date, ios: Number, android: Number, web: Number, web_url: String, ios_url: String, android_url: String, service_type: Number, user_name: String, user_comment: String, user_image: String , colorcode: String }, {collection: 'service'});
module.exports =  mongoose.model('Service', schema);