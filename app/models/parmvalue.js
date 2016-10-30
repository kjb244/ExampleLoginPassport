'use strict';

var mongoose = require('mongoose');

var parmValueSchema = mongoose.Schema({
	securityprincipal:{
		lockout: {
			maxloginattempts: { type: Number, get: v => Math.round(v), set: v => Math.round(v)},
			secondthreshold: { type: Number, get: v => Math.round(v), set: v => Math.round(v)}
		}
	}

});



// create the model for users and expose it to our app
module.exports = mongoose.model('parmvalue', parmValueSchema, 'parmvalue');