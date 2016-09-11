var test = require('tape')
var MQFacade = require('../lib/media-query-facade')

test('registration of aliases upon creation', function (assert) {
  var mq = new MQFacade({ foo: '(max-width: 400px)' })

  assert.equal(mq.aliases.foo, '(max-width: 400px)')
  assert.end()
})

test('registration of a single alias', function (assert) {
  var mq = new MQFacade()

  mq.registerAlias('foo', '(max-width: 400px)')

  assert.equal(mq.aliases.foo, '(max-width: 400px)')
  assert.end()
})

test('registration of multiple aliases', function (assert) {
  var mq = new MQFacade()

  mq.registerAlias({ foo: '(max-width: 400px)' })
  mq.registerAlias({ bar: '(min-width: 800px)' })

  assert.deepEqual(mq.aliases, {
    foo: '(max-width: 400px)',
    bar: '(min-width: 800px)'
  })
  assert.end()
})

test('registration of event handlers', function (assert) {
  var mq = new MQFacade()
  var callbackOne = function () {}
  var callbackTwo = function () {}

  mq.on('foo', callbackOne)
  mq.on('foo', callbackTwo)

  assert.deepEqual(mq.queries.foo.handlers, [
    { callback: callbackOne, context: mq },
    { callback: callbackTwo, context: mq }
  ])
  assert.end()
})

test('setting of the event handler callback context', function (assert) {
  var mq = new MQFacade()
  var callbackOne = function () {}
  var callbackTwo = function () {}
  var contextOne = {}
  var contextTwo = {}

  mq.on('foo', callbackOne, contextOne)
  mq.on('foo', callbackTwo, contextTwo)

  assert.deepEqual(mq.queries.foo.handlers, [
    { callback: callbackOne, context: contextOne },
    { callback: callbackTwo, context: contextTwo }
  ])
  assert.end()
})

test('removal of all event handlers', function (assert) {
  var mq = new MQFacade()
  var callback = function () {}
  mq.on('foo', callback)
  mq.on('bar', callback)
  mq.on('bar', callback)

  mq.off()

  assert.looseEquals(mq.queries, {})
  assert.end()
})

test('removal of all event handlers for a query', function (assert) {
  var mq = new MQFacade()
  var callback = function () {}
  mq.on('foo', callback)
  mq.on('bar', callback)
  mq.on('bar', callback)

  mq.off('bar')

  assert.equals(mq.queries.bar, undefined)
  assert.end()
})

test('removal of a single handler for a query', function (assert) {
  var mq = new MQFacade()
  var callback = function () {}
  var callbackTwo = function () {}
  mq.on('foo', callback)
  mq.on('bar', callback)
  mq.on('bar', callbackTwo)

  mq.off('bar', callback)

  assert.deepEqual(mq.queries.bar.handlers, [
    { callback: callbackTwo, context: mq }
  ])
  assert.end()
})

test('removal of aliases if queries are removed', function (assert) {
  var mq = new MQFacade({
    fooAlias: 'foo',
    barAlias: 'bar'
  })
  var callback = function () {}
  mq.on('fooAlias', callback)
  mq.on('barAlias', callback)
  mq.on('barAlias', callback)

  mq.off('barAlias')

  assert.equals(mq.aliases.barAlias, undefined)
  assert.end()
})

test('removal of a single handler with a specific context for a query', function (assert) {
  var mq = new MQFacade()
  var callback = function () {}
  var callbackTwo = function () {}
  var context = {}
  mq.on('foo', callback)
  mq.on('bar', callbackTwo)
  mq.on('bar', callback, context)

  mq.off('bar', callback, context)

  assert.deepEqual(mq.queries.bar.handlers, [
    { callback: callbackTwo, context: mq }
  ])
  assert.end()
})

test('removal of a query object if its last handler is removed', function (assert) {
  var mq = new MQFacade()
  var callback = function () {}
  mq.on('foo', callback)

  mq.off('foo', callback)

  assert.equals(mq.queries.foo, undefined)
  assert.end()
})

test('attempting to remove a query that doesn\'t exist should throw an error', function (assert) {
  var mq = new MQFacade()
  assert.throws(function () {
    mq.off('bar')
  }, '"bar" is not registered')
  assert.end()
})

test('only triggering event handlers when a media query is entered', function (assert) {
  var mq = new MQFacade()
  var callCount = 0
  var callback = function () { callCount++ }
  mq.on('foo', callback)

  mq.queries.foo.listener()
  mq.queries.foo.listener()

  assert.equals(callCount, 1)
  assert.end()
})

test('triggering a newly registered event handler if the query matches', function (assert) {
  var mq = new MQFacade()
  var callCount = 0
  var callback = function () { callCount++ }

  mq.on('all', callback)

  assert.equals(callCount, 1)
  assert.end()
})
