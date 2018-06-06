var express = require('express');
var router = express.Router();
var Staff = require('../models/staff');
var Service = require('../models/service');
const chunks = require('array.chunk');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('front/default', { title: 'Home', home: true, layout:'../front/home'  });
    //res.send('Hello World!');

});
/* GET policy page. */
router.get('/policy', function(req, res, next) {
    res.render('front/policy', { title: 'Policy', policy: true, layout:'../front/index' });
    //res.send('Hello World!');

});
/* GET jobs page. */
router.get('/jobs', function(req, res, next) {
    res.render('front/jobs', { title: 'Jobs', jobs: true, layout:'../front/index' });
    //res.send('Hello World!');

});
/* GET staff page. */
router.get('/staff', function(req, res, next) {
    Staff.find().sort({'_id': -1})
        .then(function (records) {
            //console.log('records: ', records);

            records_chunk = (chunks(records, 2));
            res.render('front/staff', { title: 'Staff', staff: true,
                records_chunk: records_chunk,
                count: records.length, layout:'../front/index' });

            //req.session.success = null;
        });
    //res.send('Hello World!');

});
/* GET contact page. */
router.get('/contact', function(req, res, next) {
    res.render('front/contact', { title: 'Contact', contact: true, layout:'../front/index' });
    //res.send('Hello World!');

});
/* GET services page. */
router.get('/services', function(req, res, next) {

    Service.find().sort({'_id': -1})
        .then(function (records) {
            //console.log('records: ', records);

            res.render('front/services', { title: 'Services', services: true,
                records: records,
                count: records.length,
                layout:'../front/home' });

            //req.session.success = null;
        });

    //res.send('Hello World!');

});

/* GET portfolio page. */
router.get('/portfolio', function(req, res, next) {
    Service.find().sort({'_id': -1})
        .then(function (records) {
            //console.log('records: ', records);

            res.render('front/portfolio', { title: 'Portfolio', portfolio: true,
                records: records,
                count: records.length,
                layout:'../front/index' });

            //req.session.success = null;
        });

    //res.send('Hello World!');

});
module.exports = router;
