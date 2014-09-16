var isString = require('lodash.isstring');
var isObject = require('lodash.isobject');
var merge = require('lodash.merge');
var omit = require('lodash.omit');
var each = require('lodash.foreach');
var some = require('lodash.some');
var bind = require('lodash.bind');

var Emitter = module.exports = function Emitter(aliases) {
  this.aliases = aliases || {};
  this.queries = {};
};

Emitter.prototype.registerAlias = function(alias, query){
  if (isString(alias)) return this.aliases[alias] = query;
  if (isObject(alias)) merge(this.aliases, alias);
};

Emitter.prototype.on = function(query, callback, context){
  var queryObject;
  try {
    queryObject = this._getQueryObject(query);
  } catch(e) {
    queryObject = this._createQueryObject(query);
  }
  var handler = { callback: callback, context: context || this };
  queryObject.handlers.push(handler);
  if (queryObject.isActive) this._triggerHandler(handler);
};

Emitter.prototype.off = function(query, callback, context){
  if (!arguments.length) return each(this.queries, this._removeQueryObject, this);
  if (!callback && !context) return this._removeQueryObject(query);
  this._removeHandler(query, callback, context);
};

Emitter.prototype._removeAlias = function(query){
  this.aliases = omit(this.aliases, function(value){
    return value === query;
  });
};

Emitter.prototype._removeQueryObject = function(value, query){
  if (isString(value)) query = value;
  query = this.aliases[query] || query;
  var queryObject = this._getQueryObject(query);
  queryObject.mql.removeListener(queryObject.listener);
  delete this.queries[query];
  this._removeAlias(query);
};

Emitter.prototype._removeHandler = function(query, callback, context){
  var queryObject = this._getQueryObject(query);
  var handlers = queryObject.handlers;
  some(handlers, function(handler, i){
    var match = handler.callback === callback ? true : false;
    if (context) match = handler.context === context ? true : false;
    if (match) return handlers.splice(i, 1);
  });
  if (!handlers.length) this._removeQueryObject(query);
};

Emitter.prototype._createQueryObject = function(query){
  query = this.aliases[query] || query;
  var queryObject = { handlers: [] };
  var mql = queryObject.mql = window.matchMedia(query);
  var listener = queryObject.listener = bind(this._triggerHandlers, this, queryObject);
  queryObject.isActive = mql.matches;
  mql.addListener(listener);
  return this.queries[query] = queryObject;
};

Emitter.prototype._getQueryObject = function(query){
  var queryObject = this.queries[this.aliases[query] || query];
  if (!queryObject) throw new Error('"' + query + '" is not registered');
  return queryObject;
};

Emitter.prototype._triggerHandlers = function(queryObject){
  var isActive = queryObject.isActive = !queryObject.isActive;
  if (!isActive) return;
  each(queryObject.handlers, this._triggerHandler);
};

Emitter.prototype._triggerHandler = function(handler){
  handler.callback.call(handler.context);
};