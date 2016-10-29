'use strict';

module.exports = function(app, passport) {



	app.get('/', function(req, res) {
        res.redirect('/login');
    });

    app.get('/login', function(req, res) {

        let message = req.flash('loginMessage');
        
    	res.render('login', {"loginMessage": message});
    });

    app.get('/signup', function(req, res) {
        res.render('signup');
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/splash', isLoggedIn, function(req, res) {
        res.render('splash', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

     app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/splash', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/chartdata1', function(req, res){
        setTimeout(()=>{
            let years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];
            let obj = years.reduce(function(o,v,i,arr){
                o[arr[i]] = Math.floor((Math.random() * 10000) + 1);
                return o;
            },{});


            res.json(obj);

        }, 1000);

    });

    app.get('/chartdata2', function(req, res){
        setTimeout(()=>{
            let years = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];
            let obj = years.reduce(function(o,v,i,arr){
                o[arr[i]] = Math.floor((Math.random() * 10000) + 1);
                return o;
            },{});


            res.json(obj);

        }, 1500);

    });


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log('is logged in');

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

