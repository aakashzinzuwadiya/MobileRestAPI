const mongoose=require('mongoose');
const joi = require('joi');

let user=mongoose.model('users',{
	firstname : 'String',
	lastname : 'String',
	email: 'String',
	password: 'String',
	birthday: 'String',
	gender: 'String'
	// image: 'String'
});

user.validate = function(obj) {
	const schema = joi.object().keys({
		firstname : joi.string().required(),
		lastname : joi.string().required(),
		email: joi.string().email().required(),
	    password: joi.string().regex(/^[A-Za-z0-9]{6,20}/).required(),
	    birthday: joi.string(),
	    gender: joi.string(),
	    // image: joi.string()
	});

	return joi.validate(obj, schema,(err, res) => {
		if(err) return false;
		else return true;
	});
}

module.exports = user;