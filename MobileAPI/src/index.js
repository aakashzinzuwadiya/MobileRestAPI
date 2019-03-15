const express = require('express');
const mongoose=require('mongoose');
const app = express();
const joi = require('joi');
const fs = require('fs');
const bodyparser = require('body-parser');
const User = require('./User');
const PORT = 1234;

app.use(bodyparser.json());

mongoose.connect('mongodb://localhost/mobileAppDB',{ useNewUrlParser: true });

app.get('/abcd', (req, res) => {
	res.json({result: true, message: 'success'});
});

app.get('/getAllUsers', (req, res) => {
	User.find({},function(err,dataObjs){
	  if(err){
	  	console.log(err);
	  	res.send("Error");
	  } else{
	  	res.status(200);
	  	res.send(JSON.stringify(dataObjs));
	  }
	});
});

app.post('/register', (req, res) => {
	console.log("q");
	console.log(req.query);
	console.log("p");
	console.log(req.params);
	console.log("data");
	let data = req.body;
	//console.log(data);
	const validationResult = User.validate(data);
	if(validationResult){
		let userObj = new User();
		userObj.firstname = data.firstname;
		userObj.lastname = data.lastname;
		userObj.email = data.email;
		userObj.password = data.password;
		userObj.birthday = data.birthday;
		userObj.gender = data.gender;
	  // userObj.image = data.image;
		User.findOne({email:data.email},function(err,dataObj){
			console.log("Email "+data.email);
			if(err){
				console.log(err);
				res.send({result:true, message: 'Error',success: false});
     		}else{
     			if(dataObj){
					console.log(dataObj);
					res.send({message: 'Email Already Exists',success: false});
	  			}else{
					console.log(dataObj);
					res.send({message: 'Lets Register',success: true});
					userObj.save();	
	  			}
     		}
    	});
	} else{
		res.send({result:true, message: 'Opps! Couldn\'t register'});
	}
});

// app.post('/login', function(req, res) {
// 	console.log("Email:"+req.body.email + "Password:" + req.body.password);
// 	User.findOne({email: req.body.email}, function(err, user) {
// 	  if (err) throw err;
// 	  //console.log("Email Id:"+req.body.email);
// 	//   console.log("Email:"+ req.body.email + "Password:" + req.body.password);
// 	  if (!user) {
// 		console.log("No User...");
// 		res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
// 	  } else {
// 		// check if password matches
// 		user.comparePassword({password:req.body.password}, function (err, isMatch) {
// 		  if (isMatch && !err) {
// 			// if user is found and password is right create a token
// 			// var token = jwt.sign(user, config.secret);
// 			// return the information including token as JSON
// 			// res.json({success: true, token: 'JWT ' + token});
// 			console.log("Login Succ...");
// 			// res.json({result:true, message: 'Login Success!'});
// 		  } else {
// 			console.log("Login Fail...");
// 			// res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
// 		  }
// 		});
// 	  }
// 	});
// });
  

app.post('/login', (req, res) => {
	// console.log( "Login" );
	// console.log(req.body.email);
	// console.log(req.body.password);
	User.findOne({email:req.body.email, password:req.body.password},function(err,dataObj){
		console.log("Email"+req.body.email);
		if(err){
				console.log(err);
				//  res.json({result:true, message: 'Error',success: false});
				res.json({result:true, message: 'Error',success: false});
	  		// res.json({result:true, message: 'Login failed!'});
     	}else{
			 console.log('dataobj : ', dataObj);
     		if(dataObj){
					//  res.status(200);
					console.log( "Login Succ" );
					//  res.json({message: 'Login Success',success: true});
					 res.json(dataObj);
		  		// res.jsogendern({result:true, message: 'Login Success', userData: dataObj});
	  		}else{
					console.log( "Login Fail" );
					// res.json({message: 'Login failed!',success: false});
					res.json({message: 'Login failed!',success: false});
	  			// res.json({result:true, message: 'Login failed!'});
	  		}
     	}
    });
});

app.post('/upload',(req,res) => {
	console.log(req.files.image.path);
	console.log(req.files.image.originalFilename);

	fs.readFile(req.files.image.path,(err,data)=> {
		const dirName = '/home/TestExercises/mobileAPIs/Images';
		const newFilePath = dirName + req.files.image.originalFilename;
		fs.writeFile(newFilePath, data, (err)=> {
			if(err){ 
				console.log(err);
				res.json({result: false, message:'Oops! Image uplaod failed!'});
			}
			else
			{
				console.log('Image uploaded...');
				res.json({result: true, message:'Image uploaded successfully.'});
			}
		});
	});

});

app.listen((PORT), () => {
	console.log(`Server Started On Port: ${PORT}`);
});