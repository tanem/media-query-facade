const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const merge = require('lodash.merge');
const omitBy = require('lodash.omitby');
const each = require('lodash.foreach');
const some = require('lodash.some');
const bind = require('lodash.bind');

const MQFacade = module.exports = function MQFacade(aliases) {
  this.aliases = aliases || {};
  this.queries = {};
};

MQFacade.prototype.registerAlias = function registerAlias(alias, query) {
  if (isString(alias)) {
    this.aliases[alias] = query;
    return;
  }
  if (isObject(alias)) merge(this.aliases, alias);
};

MQFacade.prototype.on = function on(query, callback, context) {
  let queryObject;

  try {
    queryObject = this.getQueryObject(query);
  } catch (e) {
    queryObject = this.createQueryObject(query);
  }

  const handler = { callback, context: context || this };
  queryObject.handlers.push(handler);
  if (queryObject.isActive) this.triggerHandler(handler);
};

MQFacade.prototype.off = function off(query, callback, context) {
  if (!arguments.length) return each(this.queries, bind(this.removeQueryObject, this), this);
  if (!callback && !context) return this.removeQueryObject(query);
  return this.removeHandler(query, callback, context);
};

MQFacade.prototype.removeAlias = function removeAlias(query) {
  this.aliases = omitBy(this.aliases, value => value === query);
};

MQFacade.prototype.removeQueryObject = function removeQueryObject(value, queryParam) {
  let query = queryParam;
  if (isString(value)) query = value;
  query = this.aliases[query] || query;
  const queryObject = this.getQueryObject(query);
  queryObject.mql.removeListener(queryObject.listener);
  delete this.queries[query];
  this.removeAlias(query);
};

MQFacade.prototype.removeHandler = function removeHandler(query, callback, context) {
  const queryObject = this.getQueryObject(query);
  const handlers = queryObject.handlers;
  some(handlers, (handler, i) => {
    let match = handler.callback === callback;
    if (context) match = handler.context === context;
    if (match) return handlers.splice(i, 1);
    return match;
  });
  if (!handlers.length) this.removeQueryObject(query);
};

MQFacade.prototype.createQueryObject = function createQueryObject(queryParam) {
  const query = this.aliases[queryParam] || queryParam;
  const queryObject = { handlers: [] };
  const mql = queryObject.mql = window.matchMedia(query);
  const listener = queryObject.listener = bind(this.triggerHandlers, this, queryObject);
  queryObject.isActive = mql.matches;
  mql.addListener(listener);
  this.queries[query] = queryObject;
  return queryObject;
};

MQFacade.prototype.getQueryObject = function getQueryObject(query) {
  const queryObject = this.queries[this.aliases[query] || query];
  if (!queryObject) throw new Error(`"${query}" is not registered`);
  return queryObject;
};

MQFacade.prototype.triggerHandlers = function triggerHandlers(queryObjectParam) {
  const queryObject = queryObjectParam;
  const isActive = queryObject.isActive = !queryObject.isActive;
  if (!isActive) return;
  each(queryObject.handlers, this.triggerHandler);
};

MQFacade.prototype.triggerHandler = function triggerHandler(handler) {
  handler.callback.call(handler.context);
};
