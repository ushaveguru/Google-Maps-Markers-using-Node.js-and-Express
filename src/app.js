var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loc');

var Schema = mongoose.Schema;
var userDataSchema = new Schema({
id: String,
type: String,
address: String,
latitude: Number,
longitude: Number,
$revenue: Number
},{collection: 'loc'});

var loc = mongoose.model('loc',userDataSchema);
var pass_loc_distr = {color:{}, location:[]};
var pass_loc_head = {color:{}, location:[]};
var pass_loc_retail = {color:{}, location:[]};
var pass_loc_call = {color:{}, location:[]};

var query_1 = loc.find({"location.type":"Distribution Facility"});
var query_2 = loc.find({"location.type":"HeadQuarters"});
var query_3 = loc.find({"location.type":"Call Center"});
var query_4 = loc.find({"location.type":"RetailLocation"});

query_1.select('location.latitude location.longitude');
query_1.exec(function(err,loc_val){
	if (err) 
	{
			return handleError(err);
	}
	else
	{
		pass_loc_distr.color = "Red";
		for (i=0; i < loc_val.length; i++){
			var X = loc_val[i].toObject({getters:true});
			console.log(X.location[0].longitude);
			pass_loc_distr.location.push({lat: X.location[0].latitude,lng: X.location[0].longitude});
			
		}
		console.log(pass_loc_distr);
	}
});

query_2.select('location.latitude location.longitude');
query_2.exec(function(err,loc_val){
	if (err) 
	{
			return handleError(err);
	}
	else
	{
		pass_loc_head.color = "Yellow";
		for (i=0; i < loc_val.length; i++){
			var X = loc_val[i].toObject({getters:true});
			console.log(X.location[0].longitude);
			pass_loc_head.location.push({lat: X.location[0].latitude,lng: X.location[0].longitude});
			
		}
		console.log(pass_loc_head);
	}
});

query_3.select('location.latitude location.longitude');
query_3.exec(function(err,loc_val){
	if (err) 
	{
			return handleError(err);
	}
	else
	{
		pass_loc_call.color = "Blue";
		for (i=0; i < loc_val.length; i++){
			var X = loc_val[i].toObject({getters:true});
			console.log(X.location[0].longitude);
			pass_loc_call.location.push({lat: X.location[0].latitude,lng: X.location[0].longitude});
			
		}
		console.log(pass_loc_call);
	}
});

query_4.select('location.latitude location.longitude');
query_4.exec(function(err,loc_val){
	if (err) 
	{
			return handleError(err);
	}
	else
	{
		pass_loc_retail.color = "Green";
		for (i=0; i < loc_val.length; i++){
			var X = loc_val[i].toObject({getters:true});
			console.log(X.location[0].longitude);
			pass_loc_retail.location.push({lat: X.location[0].latitude,lng: X.location[0].longitude});
			
		}
		console.log(pass_loc_retail);
	}
});

var connection = mongoose.connection;

var app = express();
//View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
//app.use(express.static(path.join(__dirname,'public')));

//map options
var mapOptions = {
		//center: new google.maps.LatLng(51.5,-0.12),
		center: {lat: 39.5, lng: -98.35},
		zoom: 10
	};

//Send : print out on to screen
app.get('/',function(req,res){
	res.render('index.ejs',{c: [
		{color: pass_loc_retail.color , location:pass_loc_retail.location},
		{color: pass_loc_distr.color, location:pass_loc_distr.location },
		{color: pass_loc_head.color, location:pass_loc_head.location },
		{color: pass_loc_call.color, location:pass_loc_call.location }
		]
	});
	
});

app.listen(5000, function(){
	console.log("Server started on port 5000 ")
})