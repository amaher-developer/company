var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/internet');
var schema = new Schema({ title: String, name: String, image: String }, {collection: 'staff'});
module.exports = mongoose.model('Staff', schema);