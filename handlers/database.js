require('dotenv').config();
var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = function(done) {
  if (state.db) return done()
  const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

  MongoClient.connect(process.env.DATABASE, options, function(err, db) {
    if (err) return done(err)
    state.db = db.db('guildBot');
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}