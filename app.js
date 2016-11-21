// INIT 
var express 				= require("express"), 
		app							= express();

var mongoose 				= require("mongoose"); 
var bodyParser 			= require("body-parser");

var methodOverride 	= require("method-override");


// SETTINGS
app.set("view engine", "ejs"); // sets the ending to all files being rendered as ejs
app.use(express.static(__dirname + "/public")); // public folder
app.use(bodyParser.urlencoded({extended: true})); // body parser
app.use(methodOverride("_method")); // sets up method-override verb syntax to ?_method=PUT/DELETE

// MONOGODB
mongoose.connect("mongodb://tester:tester@ds157247.mlab.com:57247/spotlist");

// schema for spot 

var spotSchema = new mongoose.Schema({
	name: String, 
	address: String, 
	reason: String, 
});

var Spot = mongoose.model("Spot", spotSchema);

//==============
// ROUTES 
//==============

// home
app.get("/", function(req, res){
	res.render("home")
});

// index
app.get("/spots", (req, res) => {
	Spot.find({}, function(err, foundData){
		if(err) {
			console.log("SOMETHING WENT WRONG WITH FINDING DATA!");
		}
		else {
			console.log("WE FOUND THE DATA!:");
			console.log(foundData);
			res.render("spots/index", {spotList: foundData})
		}
	})
});

// new form
app.get("/spots/new", (req, res) => {
	res.render("spots/new");
});

// make new 
app.post("/spots", (req, res) => {
	var spotName = req.body.name;
	var spotAddress = req.body.address;
	var spotReason = req.body.reason;

	Spot.create({
		name: spotName, 
		address: spotAddress, 
		reason: spotReason
	}, function(err, newSpotData){
		if(err) {
			console.log("ERROR CREATING NEW SPOT!");
		}
		else {
			console.log("NEW SPOT CREATED: ");
			console.log(newSpotData);
			res.redirect("/spots");
		}
	});

});

// show 
app.get("/spots/:id", function(req, res){

	Spot.findById(req.params.id, function(err, foundData) {
		if(err) {
			console.log("COULDN'T FIND THE SPOT YOU WERE LOOKING FOR!");
		}
		else {
			console.log("FOUND IT!");
			console.log(foundData);
			res.render("spots/view", {spotData: foundData});
		}
	});
});

// edit

// delete
app.delete("/spots/:id", (req, res) => {
	Spot.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			console.log("SOMETHING WENT WRONG");
			res.redirect("/spots/" + req.params.id);
		}
		else {
			console.log("DELETED!");
			res.redirect("/spots");
		}
	});
});

// map page 
app.get("/map", (req, res) => {
	res.render("./map")
});


//==============
// SERVER
//==============
app.listen(process.env.PORT, process.env.IP, function(){console.log("LOCAL SERVER IS UP AND RUNNING")});

