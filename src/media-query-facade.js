import {
  isString,
  isObject,
  merge,
  omitBy,
  each,
  some,
  bind
} from 'lodash'

export default class MQFacade {

  constructor (aliases = {}) {
    this.aliases = aliases
    this.queries = {}
  }

  registerAlias (alias, query) {
    if (isString(alias)) {
      this.aliases[alias] = query
      return
    }
    if (isObject(alias)) merge(this.aliases, alias)
  }

  on (query, callback, context) {
    let queryObject
    try {
      queryObject = this._getQueryObject(query)
    } catch (e) {
      queryObject = this._createQueryObject(query)
    }
    const handler = { callback: callback, context: context || this }
    queryObject.handlers.push(handler)
    if (queryObject.isActive) this._triggerHandler(handler)
  }

  off (query, callback, context) {
    if (!arguments.length) return each(this.queries, bind(this._removeQueryObject, this), this)
    if (!callback && !context) return this._removeQueryObject(query)
    this._removeHandler(query, callback, context)
  }

  _removeAlias (query) {
    this.aliases = omitBy(this.aliases, value => value === query)
  }

  _removeQueryObject (value, query) {
    if (isString(value)) query = value
    query = this.aliases[query] || query
    const queryObject = this._getQueryObject(query)
    queryObject.mql.removeListener(queryObject.listener)
    delete this.queries[query]
    this._removeAlias(query)
  }

  _removeHandler (query, callback, context) {
    const queryObject = this._getQueryObject(query)
    const handlers = queryObject.handlers
    some(handlers, (handler, i) => {
      let match = handler.callback === callback
      if (context) match = handler.context === context
      if (match) return handlers.splice(i, 1)
    })
    if (!handlers.length) this._removeQueryObject(query)
  }

  _createQueryObject (query) {
    query = this.aliases[query] || query
    const queryObject = { handlers: [] }
    const mql = queryObject.mql = window.matchMedia(query)
    const listener = queryObject.listener = bind(this._triggerHandlers, this, queryObject)
    queryObject.isActive = mql.matches
    mql.addListener(listener)
    this.queries[query] = queryObject
    return queryObject
  }

  _getQueryObject (query) {
    const queryObject = this.queries[this.aliases[query] || query]
    if (!queryObject) throw new Error(`"${query}" is not registered`)
    return queryObject
  }

  _triggerHandlers (queryObject) {
    const isActive = queryObject.isActive = !queryObject.isActive
    if (!isActive) return
    each(queryObject.handlers, this._triggerHandler)
  }

  _triggerHandler (handler) {
    handler.callback.call(handler.context)
  }

}
