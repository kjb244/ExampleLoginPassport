'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local:{
		email: String,
		password: String,
		datecreated: { type: Date },
		lastlogin: { type: Date },
		lockedout: Boolean,
		loginattempts: [ { successful: Boolean, time: Date} ]

	}

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.badXLogins = function(numBadLogins, secThreshold) {
	let loginArr = this.local.loginattempts;
	numBadLogins = numBadLogins || 3;
	secThreshold = secThreshold * 1000 || 10 * 60 * 1000;
	let dt = new Date();
	let backXMin = new Date (dt.getTime() - secThreshold);
	let holderArr = loginArr.filter(login => login.successful == false && login.time.getTime() > backXMin);
	return holderArr.length >= numBadLogins ? true: false;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('users', userSchema, 'users');