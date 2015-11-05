var express = require('express');
var router = new express.Router;
var passport = require('passport');

var sitename = "Happe hardver";
//
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('info', 'A kért tartalom megjelenítéséhez bejelentkezés szükséges');
    res.redirect('/auth/login');
}

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            //next(new Error('Unauthorized'));
            req.flash('info', 'A kért tartalomhoz megfelelő jogosultság szükséges');
            res.redirect('/auth/login');
        }
    }
}

router.route('/auth/login')
    .get(function(req, res) {
        //console.log("Error: '"+req.flash('error')+"' Info: '"+req.flash('info')+"' ");
        res.render('auth/login', {
            title: sitename,
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/user/list',
        failureRedirect: '/auth/login',
        failureFlash: true,
        badRequestMessage: 'Hiányzó adatok'
    }));

router.route('/auth/signup')
    .get(function(req, res) {
        res.render('auth/signup', {
            title: sitename,
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-signup', {
        successRedirect: '/user/list',
        failureRedirect: '/auth/signup',
        failureFlash: true,
        badRequestMessage: 'Hiányzó adatok'
    }));

router.use('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
});



router.get('/', function(req, res) {
    res.render('home', {
        title: sitename,
        uzenetek: req.flash()
    });
});


//router.route('/list').get(function(req, res) {/*...*/});
//router.route('/user/list').get(ensureAuthenticated, function(req, res) {/*...*/});

//feltöltött termékek böngészése
router.route('/list').get(function(req, res) {

    var result;
    
    //console.log(Object.keys(req.query).length);

    req.sanitize('nameQuery').escape();
    req.sanitize('nameQuery').trim();
    
    if (req.query.dateQuery) {
        var keresettDatum = new Date(req.query.dateQuery);
        var nextDay = new Date();
        nextDay.setTime(keresettDatum.getTime() + 86400000);

        result = req.app.Models.item.find({
            createdAt: {
                '>=': keresettDatum,
                '<': nextDay
            },
            itemName: {
                'contains' :  req.query.nameQuery || ""
            }
        }).populate('category').populate('user');;
    }
    else {
        result = req.app.Models.item.find({
            itemName: {
                'contains' : req.query.nameQuery || ""
            }
        }).populate('category').populate('user');;
    }


    result
    // Ha nem volt hiba fusson le ez
        .then(function(data) {

            res.render('list', {
                title: sitename,
                data: data,
                dateQuery: req.query.dateQuery,
                nameQuery: req.query.nameQuery,
                uzenetek: req.flash()
            });
        })
        // Ha volt hiba fusson le ez
        .catch(function() {
            console.log('Hiba!!');
            throw 'error';
        });
});

//felhasználó termékeinek listázása, szerkesztése, törlése
router.route('/user/list').get(ensureAuthenticated, function(req, res) {

    var result;
    req.sanitize('nameQuery').escape();
    req.sanitize('nameQuery').trim();
 
    if (req.query.dateQuery) {
        var keresettDatum = new Date(req.query.dateQuery);
        var nextDay = new Date();
        nextDay.setTime(keresettDatum.getTime() + 86400000);

        result = req.app.Models.item.find({
            createdAt: {
                '>=': keresettDatum,
                '<': nextDay
            },
            itemName: {
                'contains' :  req.query.nameQuery || ""
            },
            user: req.user.id
        }).populate('category').populate('user');
    }
    else {
        result = req.app.Models.item.find({
            itemName: {
                'contains' :  req.query.nameQuery || ""
            },
            user: req.user.id
        }).populate('category').populate('user');
    }
    result
    // Ha nem volt hiba fusson le ez
        .then(function(data) {
            res.render('user/item_list', {
                title: sitename,
                data: data,
                dateQuery: req.query.dateQuery,
                nameQuery: req.query.nameQuery,
                uzenetek: req.flash()
            });
        })
        // Ha volt hiba fusson le ez
        .catch(function() {
            console.log('Hiba!!');
            throw 'error';
        });
    //console.log(req.session.data);

});

//felhasználó új termék felvétele
router.route('/user/upload')
    .get(ensureAuthenticated, function(req, res) {

        var result;
        result = req.app.Models.category.find();

        result
        // Ha nem volt hiba fusson le ez
            .then(function(data) {
                res.render('upload', {
                    title: sitename,
                    categoryData: data,
                    uzenetek: req.flash()
                });
            })
            // Ha volt hiba fusson le ez
            .catch(function() {
                console.log('Hiba!!');
                throw 'error';
            });
    })
    .post(ensureAuthenticated, function(req, res) {

        req.sanitize('itemName').escape();
        req.sanitize('itemDescription').escape();

        req.sanitize('itemName').trim();
        req.sanitize('itemDescription').trim();

        req.checkBody('itemName', 'Hiba a névvel')
            .notEmpty();
        req.checkBody('itemPrice', 'Hiba a megjelölt árral')
            .notEmpty()
            .isInt();
        req.checkBody('itemCategory', 'Hiba a megjelölt kategóriával')
            .notEmpty()
            .isInt();

        if (req.validationErrors()) {
            req.validationErrors().forEach(function(error) {
                req.flash('error', error.msg);
            });
            res.redirect('/user/upload');
        }
        else {
            req.app.Models.item.create({
                    itemName: req.body.itemName,
                    itemPrice: req.body.itemPrice,
                    itemDescription: req.body.itemDescription,
                    category: req.body.itemCategory,
                    user: req.user.id
                })
                .then(function() {
                    req.flash('success', 'Hírdetés sikeresen felvéve');
                    res.redirect('/user/upload');
                })
                .catch(function() {
                    req.flash('error', 'Hírdetés felvétele sikertelen!');
                    res.redirect('/user/upload');
                });
        }

    });

router.route('/user/edit/:id').get(ensureAuthenticated, function(req, res) {



    var categoryResult = req.app.Models.category.find();
    var itemResult = req.app.Models.item.findOne({
        id: req.params.id,
    }).populate('category');

    categoryResult
    // Ha nem volt hiba fusson le ez
        .then(function(categoryData) {

            itemResult
            // Ha nem volt hiba fusson le ez
                .then(function(itemData) {

                    res.render('user/item_edit', {
                        title: sitename,
                        itemData: itemData,
                        categoryData: categoryData,
                        uzenetek: req.flash()
                    });
                })
                // Ha volt hiba fusson le ez
                .catch(function() {
                    console.log('Hiba!!');
                    throw 'error';
                });
        })
        // Ha volt hiba fusson le ez
        .catch(function() {
            console.log('Hiba!!');
            throw 'error';
        });




}).post(ensureAuthenticated, function(req, res) {


    req.sanitize('itemName').escape();
    req.sanitize('itemDescription').escape();

    req.sanitize('itemName').trim();
    req.sanitize('itemDescription').trim();

    req.checkBody('itemName', 'Hiba a névvel')
        .notEmpty();
    req.checkBody('itemPrice', 'Hiba a megjelölt árral')
        .notEmpty()
        .isInt();
    req.checkBody('itemCategory', 'Hiba a megjelölt kategóriával')
        .notEmpty()
        .isInt();

    if (req.validationErrors()) {
        req.validationErrors().forEach(function(error) {
            req.flash('error', error.msg);
        });
        res.redirect('/user/list');
    }
    else {
        req.app.Models.item.update({
                id: req.params.id,
            }, {
                itemName: req.body.itemName,
                itemPrice: req.body.itemPrice,
                itemDescription: req.body.itemDescription,
                category: req.body.itemCategory,
            }).then(function() {
                req.flash('success', 'Hírdetés sikeresen módosítva');
                res.redirect('/user/list');
            })
            .catch(function() {
                req.flash('error', 'Hírdetés módosítása sikertelen!');
                res.redirect('/user/list');
            });
    }
});

router.use('/user/delete/:id', ensureAuthenticated, function(req, res) {

    req.app.Models.item.destroy({
            id: req.params.id,
            user: req.user.id
        })
        .then(function() {
            req.flash('success', 'Hírdetés sikeresen törölve');
            res.redirect('/user/list');
        })
        .catch(function() {
            req.flash('error', 'Hírdetés törlése sikertelen');
            res.redirect('/user/list');
        });;

});

//operátor 
router.route('/op/categories/')
    .get(ensureAuthenticated, andRestrictTo('operator'), function(req, res) {
        res.render('op/category', {
            title: sitename,
            uzenetek: req.flash()
        });
    })
    .post(ensureAuthenticated, andRestrictTo('operator'), function(req, res) {
        req.sanitize('categoryName').escape();
        req.sanitize('categoryName').trim();
        req.checkBody('categoryName', 'Hiba a névvel')
            .notEmpty();

        if (req.validationErrors()) {
            req.validationErrors().forEach(function(error) {
                req.flash('error', error.msg);
            });
            res.redirect('/op/categories');
        }
        else {
            req.app.Models.category.create({
                    categoryName: req.body.categoryName,
                })
                .then(function() {
                    req.flash('success', 'Kategória felvéve');
                    res.redirect('/op/categories');
                })
                .catch(function() {
                    req.flash('error', 'Kategória felvétele sikertelen!');
                    res.redirect('/op/categories');
                });
        }

    });



module.exports = router;