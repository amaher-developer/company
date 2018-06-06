var express = require('express');
var router = express.Router();
var Staff = require('../models/staff');
var Service = require('../models/service');
var passport = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/profile', isLoggedIn, function (req, res, next) {
    res.render('admin/profile', {
        layout: '../admin/index'
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});


router.get('/', isLoggedIn, function (req, res, next) {
    res.render('admin/default', {
        title: 'Home',
        page_name: 'home',
        layout: '../admin/index',
        username: req.session.uniqueID
    });
});


/* -------------------------------- Staff --------------------- */

/* GET staff listing. */
router.get('/staff', isLoggedIn, function (req, res, next) {

    Staff.find().sort({'_id': -1})
        .then(function (records) {
            console.log('records: ', records);
            res.render('admin/staff', {
                title: 'Staff List',
                records: records,
                count: records.length,
                page_name: 'staff',
                layout: '../admin/index'
            });
            //req.session.success = null;
        });

});

/* GET add staff. */
router.get('/staff-add', isLoggedIn, function (req, res, next) {
    // res.send('respond with a resource');
    res.render('admin/staffAdd', {
        csrfToken: req.csrfToken(),
        title: 'Add Staff',
        success: req.session.success,
        errors: req.session.errors,
        layout: '../admin/index'
    });
    req.session.errors = null;
});

/* POST add staff. */
router.post('/staff-add', isLoggedIn, function (req, res, next) {

    req.check('title', 'Enter title correctly.').notEmpty();
    req.check('name', 'Enter name correctly.').notEmpty();

    var image = req.files.image;
    if (image) {
        var image_type = image.name.split('.').pop();
        var timestamp = Math.floor(Date.now());
        var image_name = timestamp + '.' + image_type;

        image.mv('uploads/staff/' + image_name, function (err) {
            if (err)
                return res.status(500).send(err);

            // res.send('File uploaded!');
        });
    } else {
        req.check('image', 'Enter image correctly.').notEmpty();
    }
    var staff = {
        title: req.body.title,
        name: req.body.name,
        image: image_name
    };
    console.log('staff: ', staff);

    var errors = req.validationErrors();
    console.log('errors: ', errors);
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/operate/staff-add');
    } else {
        var data = new Staff(staff);
        data.save();
        req.session.success = true;

        res.redirect('/operate/staff');
    }
});


/* GET edit staff. */
router.get('/staff-edit/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    console.log('id: ', id);
    Staff.findById(id)
        .then(function (record) {
            console.log('record: ', record);
            res.render('admin/staffEdit', {
                csrfToken: req.csrfToken(),
                title: 'Edit Staff',
                record: record,
                layout: '../admin/index'
            });
            req.session.errors = null;
        });

});

/* Post edit staff. */
router.post('/staff-edit/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    req.check('title', 'Enter title correctly.').notEmpty();
    req.check('name', 'Enter name correctly.').notEmpty();

    var image = req.files.image;
    if (image) {
        var image_type = image.name.split('.').pop();
        var timestamp = Math.floor(Date.now());
        var image_name = timestamp + '.' + image_type;

        image.mv('uploads/staff/' + image_name, function (err) {
            if (err)
                return res.status(500).send(err);

            // res.send('File uploaded!');
        });
    }

    var errors = req.validationErrors();
    console.log('errors: ', errors);
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/operate/staff-edit/' + id);
    } else {
        Staff.findById(id, function (err, doc) {
            if (err) {
                console.error('error, no entry found');
            }
            doc.name = req.body.name;
            doc.title = req.body.title;
            if (image_name) doc.image = image_name;
            doc.save();
        });
        req.session.success = true;
        res.redirect('/operate/staff-edit/' + id);
    }
});


router.get('/staff-delete/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    console.log('id: ', id);
    Staff.findByIdAndRemove(id).exec();
    res.redirect('/operate/staff');
});


/* -------------------------- services ---------------------------- */


/* GET users listing. */
router.get('/service', isLoggedIn, function (req, res, next) {

    Service.find().sort({'_id': -1})
        .then(function (records) {
            console.log('records: ', records);
            res.render('admin/service', {
                title: 'Service List',
                records: records,
                count: records.length,
                success: req.session.success,
                layout: '../admin/index'
            });
            //req.session.success = null;
        });

});

/* GET add service. */
router.get('/service-add', isLoggedIn, function (req, res, next) {
    // res.send('respond with a resource');
    res.render('admin/serviceAdd', {
        csrfToken: req.csrfToken(),
        title: 'Add Service',
        success: req.session.success,
        errors: req.session.errors,
        layout: '../admin/index'
    });
    req.session.errors = null;
});

/* POST add service. */
router.post('/service-add', function (req, res, next) {

    req.check('title', 'Enter title correctly.').notEmpty();
    req.check('description', 'Enter Description correctly.').notEmpty();
    req.check('date', 'Enter Date correctly.').notEmpty();

    var image = req.files.image;
    if (image) {
        var image_type = image.name.split('.').pop();
        var timestamp = Math.floor(Date.now());
        var image_name = timestamp + '.' + image_type;

        image.mv('uploads/service/' + image_name, function (err) {
            if (err)
                return res.status(500).send(err);

            // res.send('File uploaded!');
        });
    } else {
        req.check('image', 'Enter image correctly.').notEmpty();
    }

    var user_image = req.files.user_image;
    if (user_image) {
        var user_image_type = user_image.name.split('.').pop();
        var user_timestamp = Math.floor(Date.now());
        var user_image_name = user_timestamp + '.' + user_image_type;

        image.mv('uploads/service/' + user_image_name, function (err) {
            if (err)
                return res.status(500).send(err);

            // res.send('File uploaded!');
        });
    }

    var service = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        colorcode: req.body.colorcode,
        web: req.body.web,
        web_url: req.body.web_url,
        ios: req.body.ios,
        ios_url: req.body.ios_url,
        android: req.body.android,
        android_url: req.body.android_url,
        image: image_name,
        user_name: req.body.user_name,
        user_comment: req.body.user_comment,
        user_image: user_image_name,
    };

    var errors = req.validationErrors();
    console.log('errors: ', errors);
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/operate/service-add');
    } else {
        var data = new Service(service);
        data.save();
        req.session.success = true;

        res.redirect('/operate/service');
    }
});


/* GET edit service. */
router.get('/service-edit/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    console.log('id: ', id);


    Service.findById(id)
        .then(function (record) {
            console.log('record: ', record);

            product = false;brand = false;
            if(record.service_type == 1) product = true; else brand = true;

            res.render('admin/serviceEdit', {
                csrfToken: req.csrfToken(),
                title: 'Edit Service',
                record: record,
                product: product,
                brand: brand,
                layout: '../admin/index'
            });
            req.session.errors = null;
        });

});

/* Post edit staff. */
router.post('/service-edit/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    req.check('title', 'Enter title correctly.').notEmpty();
    req.check('description', 'Enter Description correctly.').notEmpty();
    req.check('date', 'Enter Date correctly.').notEmpty();

    var image = req.files.image;
    if (image) {
        var image_type = image.name.split('.').pop();
        var timestamp = Math.floor(Date.now());
        var image_name = timestamp + '.' + image_type;

        image.mv('uploads/service/' + image_name, function (err) {
            if (err)
                return res.status(500).send(err);

            // res.send('File uploaded!');
        });
    }


    var user_image = req.files.user_image;
    if (user_image) {
        var user_image_type = user_image.name.split('.').pop();
        var user_timestamp = Math.floor(Date.now());
        var user_image_name = user_timestamp + '.' + user_image_type;

        user_image.mv('uploads/service/' + user_image_name, function (err) {
            if (err)
                return res.status(500).send(err);

            // res.send('File uploaded!');
        });
    }

    var errors = req.validationErrors();
    console.log('errors: ', errors);
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/operate/service-edit/' + id);
    } else {
        Service.findById(id, function (err, doc) {
            if (err) {
                console.error('error, no entry found');
            }
            doc.description = req.body.description;
            doc.title = req.body.title;
            doc.date = req.body.date;
            doc.colorcode = req.body.colorcode;
            doc.web = req.body.web;
            doc.ios = req.body.ios;
            doc.android = req.body.android;


            doc.web_url = req.body.web_url;
            doc.ios_url = req.body.ios_url;
            doc.android_url = req.body.android_url;

            doc.user_name = req.body.user_name;
            doc.user_comment = req.body.user_comment;

            if (image_name) doc.image = image_name;
            if (user_image_name) doc.user_image = user_image_name;

            doc.save();
        });
        req.session.success = true;
        res.redirect('/operate/service-edit/' + id);
    }
});


router.get('/service-delete/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;
    console.log('id: ', id);
    Service.findByIdAndRemove(id).exec();
    res.redirect('/operate/service');
});


router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}