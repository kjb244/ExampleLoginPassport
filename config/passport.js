'use strict';

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        
        console.log(email, password);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            console.log('sign up');
            console.log(user, err);
            // if there are any errors, return the error
            if (err){
                console.log('kevin');
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                console.log('user exists');
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } 
            else {
      
                console.log('creating user');
                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.datecreated = new Date();
                newUser.local.lastlogin = new Date(0);
                newUser.local.loginattempts = [];

                // save the user
                newUser.save(function(err) {
                    if (err){
                        console.log('saving user');
                        throw err;
                    }
                    console.log('saving user');
                    return done(null, newUser);
                });
            }

        });    

        });

    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
                return done(err);
            }

            // if no user is found, return the message
            else if (!user) {
                return done(null, false, req.flash('loginMessage', "Username/password invalid")); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            else if (!user.validPassword(password)){
                let msg = 'Username/password invalid';
                user.local.loginattempts.push( { successful: false, time: new Date() } );
                user.save();
                if (user.badXLogins(4)){
                    msg = "User account locked after unsuccessful logins";
                }
                return done(null, false, req.flash('loginMessage', msg)); // create the loginMessage and save it to session as flashdata
            }

            // all is well, store in db and return successful user
            else{
                user.local.lastlogin = new Date();
                user.local.loginattempts.push( { successful: true, time: new Date() } );
                user.save();

            }
            

            return done(null, user);
        });

    }));

};

