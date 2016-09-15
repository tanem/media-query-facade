const test = require('tape');
const MQFacade = require('../lib/media-query-facade');

test('registration of aliases upon creation', (assert) => {
  const mq = new MQFacade({ foo: '(max-width: 400px)' });

  assert.equal(mq.aliases.foo, '(max-width: 400px)');
  assert.end();
});

test('registration of a single alias', (assert) => {
  const mq = new MQFacade();

  mq.registerAlias('foo', '(max-width: 400px)');

  assert.equal(mq.aliases.foo, '(max-width: 400px)');
  assert.end();
});

test('registration of multiple aliases', (assert) => {
  const mq = new MQFacade();

  mq.registerAlias({ foo: '(max-width: 400px)' });
  mq.registerAlias({ bar: '(min-width: 800px)' });

  assert.deepEqual(mq.aliases, {
    foo: '(max-width: 400px)',
    bar: '(min-width: 800px)',
  });
  assert.end();
});

test('registration of event handlers', (assert) => {
  const mq = new MQFacade();
  const callbackOne = () => {};
  const callbackTwo = () => {};

  mq.on('foo', callbackOne);
  mq.on('foo', callbackTwo);

  assert.deepEqual(mq.queries.foo.handlers, [
    { callback: callbackOne, context: mq },
    { callback: callbackTwo, context: mq },
  ]);
  assert.end();
});

test('setting of the event handler callback context', (assert) => {
  const mq = new MQFacade();
  const callbackOne = () => {};
  const callbackTwo = () => {};
  const contextOne = {};
  const contextTwo = {};

  mq.on('foo', callbackOne, contextOne);
  mq.on('foo', callbackTwo, contextTwo);

  assert.deepEqual(mq.queries.foo.handlers, [
    { callback: callbackOne, context: contextOne },
    { callback: callbackTwo, context: contextTwo },
  ]);
  assert.end();
});

test('removal of all event handlers', (assert) => {
  const mq = new MQFacade();
  const callback = () => {};
  mq.on('foo', callback);
  mq.on('bar', callback);
  mq.on('bar', callback);

  mq.off();

  assert.looseEquals(mq.queries, {});
  assert.end();
});

test('removal of all event handlers for a query', (assert) => {
  const mq = new MQFacade();
  const callback = () => {};
  mq.on('foo', callback);
  mq.on('bar', callback);
  mq.on('bar', callback);

  mq.off('bar');

  assert.equals(mq.queries.bar, undefined);
  assert.end();
});

test('removal of a single handler for a query', (assert) => {
  const mq = new MQFacade();
  const callback = () => {};
  const callbackTwo = () => {};
  mq.on('foo', callback);
  mq.on('bar', callback);
  mq.on('bar', callbackTwo);

  mq.off('bar', callback);

  assert.deepEqual(mq.queries.bar.handlers, [
    { callback: callbackTwo, context: mq },
  ]);
  assert.end();
});

test('removal of aliases if queries are removed', (assert) => {
  const mq = new MQFacade({
    fooAlias: 'foo',
    barAlias: 'bar',
  });
  const callback = () => {};
  mq.on('fooAlias', callback);
  mq.on('barAlias', callback);
  mq.on('barAlias', callback);

  mq.off('barAlias');

  assert.equals(mq.aliases.barAlias, undefined);
  assert.end();
});

test('removal of a single handler with a specific context for a query', (assert) => {
  const mq = new MQFacade();
  const callback = () => {};
  const callbackTwo = () => {};
  const context = {};
  mq.on('foo', callback);
  mq.on('bar', callbackTwo);
  mq.on('bar', callback, context);

  mq.off('bar', callback, context);

  assert.deepEqual(mq.queries.bar.handlers, [
    { callback: callbackTwo, context: mq },
  ]);
  assert.end();
});

test('removal of a query object if its last handler is removed', (assert) => {
  const mq = new MQFacade();
  const callback = () => {};
  mq.on('foo', callback);

  mq.off('foo', callback);

  assert.equals(mq.queries.foo, undefined);
  assert.end();
});

test('attempting to remove a query that doesn\'t exist should throw an error', (assert) => {
  const mq = new MQFacade();
  assert.throws(() => {
    mq.off('bar');
  }, '"bar" is not registered');
  assert.end();
});

test('only triggering event handlers when a media query is entered', (assert) => {
  let callCount = 0;
  const mq = new MQFacade();
  const callback = () => { callCount += 1; };
  mq.on('foo', callback);

  mq.queries.foo.listener();
  mq.queries.foo.listener();

  assert.equals(callCount, 1);
  assert.end();
});

test('triggering a newly registered event handler if the query matches', (assert) => {
  let callCount = 0;
  const mq = new MQFacade();
  const callback = () => { callCount += 1; };

  mq.on('all', callback);

  assert.equals(callCount, 1);
  assert.end();
});
