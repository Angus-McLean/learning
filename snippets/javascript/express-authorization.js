'use strict';

const _ = require('lodash');
const async = require('async');

module.exports = {
  all : function (...authFns) {
    authFns = _.flatMap(authFns);
    return function (req, res, next) {
      async.map(authFns, function (authFn, cb) {
        authFn(req, res, cb)
      }, function (err, results) {
        if(err) next(err);
        else next();
      })
    }
  },
  any : function (...authFns) {
    authFns = _.flatMap(authFns);
    return function (req, res, next) {
      async.map(authFns, function (authFn, cb) {
        authFn(req, res, cb.bind(null, null))
      }, function (err, results) {
        let rejections = _.filter(results);
        if(rejections.length < results.length)
          return next();
        else
          return next(rejections.pop())
      });
    }
  }
}


/* example usage */
let routeAuthRules = auth.any(
  userAuthMiddleware.allowTypes('Admin'),
  auth.all(userAuthMiddleware.allowTypes('LocalAdmin'), locationAuthMiddleware.isInLocal()),
  function (req, res, next) {
    return (req.user === req.params.userId) ? next() : next('Not allowed');
  }
)

app.route('/users').put(routeAuthRules, /* controller  here */)
