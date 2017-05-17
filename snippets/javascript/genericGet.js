
// Fetches values in object from the path specified
// Uses _.get on paths where object is the root and _.map for paths in arrays of objects
function genericGet(objs, path) {
  if(!path || !path.length) return objs;
  // return genericGet( (_.isArray(objs)?_.map:_.get)(objs, path[0]), path.slice(1) );
  if(_.isArray(objs)) {
    return genericGet(_.map(objs, path[0]), path.slice(1))
  } else {
    return genericGet(_.get(objs, path[0]), path.slice(1))
  }
}


// middleware for validating arbitrary attributes
function attributeMatch(reqPath, userDocPath) {
  return function (req, res, next) {
    let reqParamValue = _.toString(_.get(req, _.toPath(reqPath)));
    let sessionValues = genericGet(req, _.toPath(userDocPath));
    sessionValues = _.isArray(sessionValues) ? sessionValues : [sessionValues];
    if(_.map(sessionValues, _.toString).includes(reqParamValue)) {
      return next()
    } else {
      return next('failed')
    }
  }
}
