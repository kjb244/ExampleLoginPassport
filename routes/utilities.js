'use strict';

var parmValue = require('../app/models/parmvalue');

var exports = module.exports = {};

exports.getParmValueObj = function(){
	let promise = parmValue.findOne({}).exec();
	return promise;
	


}
