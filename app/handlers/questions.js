const
bodyParser   = require('body-parser'),
Router       = require('router'),
upload       = require('../es/master-screener/upload'),
getAll       = require('../es/master-screener/get').getAll,
get          = require('../es/master-screener/get').getVersion;

class QuestionsHandler {
  static addRoutes(client, router) {
    if (client === undefined ) {
      throw new Error('[BOOTSTRAP]: client or cache undefined in ProgramHandler');
    }
    const api = Router();
    api.use(bodyParser.json());

    api.post('/', uploadNewQuestionSet(client));
    api.get('/', getAllQuestions(client));
    api.get('/version/:version/', getVersion(client));
    api.get('/latest/', getLatestVersion(client));
    // this is the router that handles all incoming requests for the server
    router.use('/api/questions/', api);
  }
}

module.exports = {
  QuestionsHandler
};

function uploadNewQuestionSet(client) {
  return (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const questions = req.body;
    res.statusCode = 200;
    upload.uploadMasterScreenerQuestions(client, questions)
      .then( questions => res.end(JSON.stringify({response: questions})))
      .catch( error => {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({
          message: error.message
        }));
        next();
      });
  };
}

function getAllQuestions(client) {
  return (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    getAll(client)
      .then( questions => res.end(JSON.stringify({response: questions})))
      .catch( error => {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({
          message: error.message
        }));
        next();
      });
  };
}

function getVersion(client) {
  return (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    get(client, req.params.version)
      .then( questions => res.end(JSON.stringify({response: questions})))
      .catch( error => {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({
          message: error.message
        }));
        next();
      });
  };
}

function getLatestVersion(client) {
  return (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    getAll(client)
      .then(questions => {
        if (Array.isArray(questions) && questions.length > 1) {
          const sorted = questions.sort((a, b) => a.version > b.version);
          res.end(JSON.stringify({response: sorted[0].questions}));
          next();
        }
        res.end(JSON.stringify({response: {}}));
        next();
      })
      .catch( error => {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({
          message: error.message
        }));
        next();
      });
  };
}
