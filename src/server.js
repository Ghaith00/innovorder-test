const logger          = require('morgan'),
http            = require('http'),
url             = require('url'),
express         = require('express'),
errorhandler    = require('errorhandler'),
bodyParser      = require('body-parser'),
config          = require('./config'),
routing         = require('./routes'),
mongoose        = require('mongoose');
const app = express();
const HOST_NAME = config.host;

/**
* Body parsers
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
* Error intercept handler
*/
app.use((error, request, response, next) =>{
    if (error.name === 'StatusError') {
        response.send(error.status, error.message);
    } else {
        next(error);
    }
});

/**
* Set Content-Type header json (RESTful)
*/
app.use('/api/*', (request, response, next) =>
{
    response.header("Content-Type",'application/json');
    next();
});

/**
* Set public assets for front-app
*/
app.get('/', (request, response) =>
{
    const dirPath = __dirname;
    response.sendFile(`${dirPath}/public/index.html`);
});


app.use('/static', express.static('public'));

/**
* Environment type
*/
if (config.debug) {
    app.use(logger('dev'));
    app.use(errorhandler())
}

/**
* Get routing settings
*/
app.use('/api', routing);

/**
* Connect to database (sudo service mongod start)
*/
(async ()=>{
try {
    await mongoose.connect(config.database);
        console.log(`[.] Connected to database`);
    } catch (e) {
        console.log(`[!] Error connection to database: ${e}`);
        // exit server with status 1
        process.exit(1);
    }
})()


/**
* Create server
*/
const server =  http.createServer(app);
const port = process.env.PORT || config.port;


/**
* Start server
*/
server.listen(port, (error) => {
    console.log(`[.] Listening on ${HOST_NAME}:${port}`);
});
