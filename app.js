var express = require( 'express' );
var nunjucks = require( 'nunjucks' );
var sassMiddleware = require( 'node-sass-middleware' );
var morgan = require( 'morgan' );
var path = require( 'path' );
var app = express();
var port = process.env.PORT || 3000;

var words = {
  'foo': 2,
  'bar': 4,
  'baz': 5,
  'hello': 1
}

nunjucks.configure( path.join( __dirname, '/views'), {
  autoescape: true,
  express: app
});

// log http requests
app.use( morgan( 'dev' ) );

// write stylesheet from sass to public
app.use( sassMiddleware( {
  src: path.join( __dirname, '/sass' ),
  dest: path.join( __dirname, '/public' )
}));

// seems to be neccesary in order to get style.css
app.use( express.static( path.join( __dirname, '/public' )));

// render template
app.get( '/', function( req, res ) {
  res.render( 'index.html', { title: 'Express Tests' });
});

app.get( '/add/:word/:score', addWord );
app.get( '/search/:word', retrieveWord );
app.get( '/json', sendJson );

var server = app.listen( port );

console.log( 'server started on port %s', port );

function addWord( req, res ) {
  var reply;
  var data = req.params;
  var word = data.word;
  var score = Number( data.score );
  var testEx = /d+/;
  if ( !score ) {
    reply = {
      'message': 'Score is required.'
    }
  } else {
    words[ word ] = score;
    reply = {
      'message': 'Thank you for your word.'
    }
  }
  res.send( reply );
}

function retrieveWord( req, res ) {
  var reply;
  var word = req.params.word;
  if ( words[ word ] ) {
    reply = {
      'status': 'found',
      'word': word,
      'score': words[ word ]
    }
  } else {
    reply = {
      'status': 'not found',
      'word': word,
      'score': null
    }
  }
  res.send( reply );
}

function sendJson( req, res ) {
  res.send( words );
}
