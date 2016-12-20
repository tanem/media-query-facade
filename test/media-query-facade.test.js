import MQFacade from '../src/media-query-facade'

test('registration of aliases upon creation', () => {
  const mq = new MQFacade({ foo: '(max-width: 400px)' })

  expect(mq.aliases.foo).toBe('(max-width: 400px)')
})

test('registration of a single alias', () => {
  const mq = new MQFacade()

  mq.registerAlias('foo', '(max-width: 400px)')

  expect(mq.aliases.foo).toBe('(max-width: 400px)')
})

test('registration of multiple aliases', () => {
  const mq = new MQFacade()

  mq.registerAlias({ foo: '(max-width: 400px)' })
  mq.registerAlias({ bar: '(min-width: 800px)' })

  expect(mq.aliases).toEqual({
    foo: '(max-width: 400px)',
    bar: '(min-width: 800px)'
  })
})

test('registration of event handlers', () => {
  const mq = new MQFacade()
  const callbackOne = () => {}
  const callbackTwo = () => {}

  mq.on('foo', callbackOne)
  mq.on('foo', callbackTwo)

  expect(mq.queries.foo.handlers).toEqual([
    { callback: callbackOne, context: mq },
    { callback: callbackTwo, context: mq }
  ])
})

test('setting of the event handler callback context', () => {
  const mq = new MQFacade()
  const callbackOne = () => {}
  const callbackTwo = () => {}
  const contextOne = {}
  const contextTwo = {}

  mq.on('foo', callbackOne, contextOne)
  mq.on('foo', callbackTwo, contextTwo)

  expect(mq.queries.foo.handlers).toEqual([
    { callback: callbackOne, context: contextOne },
    { callback: callbackTwo, context: contextTwo }
  ])
})

test('removal of all event handlers', () => {
  const mq = new MQFacade()
  const callback = () => {}
  mq.on('foo', callback)
  mq.on('bar', callback)
  mq.on('bar', callback)

  mq.off()

  expect(mq.queries).toEqual({})
})

test('removal of all event handlers for a query', () => {
  const mq = new MQFacade()
  const callback = () => {}
  mq.on('foo', callback)
  mq.on('bar', callback)
  mq.on('bar', callback)

  mq.off('bar')

  expect(mq.queries.bar).toBeUndefined()
})

test('removal of a single handler for a query', () => {
  const mq = new MQFacade()
  const callback = () => {}
  const callbackTwo = () => {}
  mq.on('foo', callback)
  mq.on('bar', callback)
  mq.on('bar', callbackTwo)

  mq.off('bar', callback)

  expect(mq.queries.bar.handlers).toEqual([
    { callback: callbackTwo, context: mq }
  ])
})

test('removal of aliases if queries are removed', () => {
  const mq = new MQFacade({
    fooAlias: 'foo',
    barAlias: 'bar'
  })
  const callback = () => {}
  mq.on('fooAlias', callback)
  mq.on('barAlias', callback)
  mq.on('barAlias', callback)

  mq.off('barAlias')

  expect(mq.aliases.barAlias).toBeUndefined()
})

test('removal of a single handler with a specific context for a query', () => {
  const mq = new MQFacade()
  const callback = () => {}
  const callbackTwo = () => {}
  const context = {}
  mq.on('foo', callback)
  mq.on('bar', callbackTwo)
  mq.on('bar', callback, context)

  mq.off('bar', callback, context)

  expect(mq.queries.bar.handlers).toEqual([
    { callback: callbackTwo, context: mq }
  ])
})

test('removal of a query object if its last handler is removed', () => {
  const mq = new MQFacade()
  const callback = () => {}
  mq.on('foo', callback)

  mq.off('foo', callback)

  expect(mq.queries.foo).toBeUndefined()
})

test(`attempting to remove a query that doesn't exist should throw an error`, () => {
  const mq = new MQFacade()

  expect(() => {
    mq.off('bar')
  }).toThrowError('"bar" is not registered')
})

test('only triggering event handlers when a media query is entered', () => {
  const mq = new MQFacade()
  let callCount = 0
  const callback = () => { callCount++ }
  mq.on('foo', callback)

  mq.queries.foo.listener()
  mq.queries.foo.listener()

  expect(callCount).toBe(1)
})
