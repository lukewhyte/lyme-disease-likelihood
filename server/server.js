// Module dependencies.
var express = require( 'express' ), //Web framework
  path = require( 'path' ), //Utilities for dealing with file paths
  mongoose = require( 'mongoose' ), //MongoDB integration
  application_root = path.join(__dirname, '../web/');

//Create server
var app = express();

//Start server
var port = 9876;

app.listen( port, function () {
  console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

//Connect to database
mongoose.connect('mongodb://localhost/lymelikelihood');

//Schemas
var Data = new mongoose.Schema({
  stateCode: Number,
  countyCode: Number,
  stateName: String,
  countyName: String,
  confirmedCount_1992_1996: Number,
  confirmedCount_1997_2001: Number,
  confirmedCount_2002_2006: Number,
  confirmedCount_2007_2011: Number
});

//Models
var lymeModel = mongoose.model('Data', Data, 'countycases');

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, './') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//Get a list of all cases
app.get( '/cases', function( request, response ) {
  return lymeModel.find( function( err, all ) {
    if( !err ) {
      return response.send( all );
    } else {
      return console.log( err );
    }
  });
});

//Get a single api by id
app.get( '/cases/:id', function (request, response) {
  return lymeModel.find({id: request.params.stateCode + request.params.countyCode}, function ( err, county ) {
    if( !err ) {
      return response.send( county );
    } else {
      return console.log( err );
    }
  });
});