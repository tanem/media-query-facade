var test = require('tape');
var MQFacade = require('../lib/media-query-facade');

test('registration of aliases upon creation', function(t){
  t.plan(1);
  var mq = new MQFacade({ foo: '(max-width: 400px)'});
  t.equal(mq.aliases.foo, '(max-width: 400px)');
});

test('registration of a single alias', function(t){
  t.plan(1);
  var mq = new MQFacade();
  
  mq.registerAlias('foo', '(max-width: 400px)');
  
  t.equal(mq.aliases.foo, '(max-width: 400px)');
});

test('registration of multiple aliases', function(t){
  t.plan(1);
  var mq = new MQFacade();
  
  mq.registerAlias({ foo: '(max-width: 400px)' });
  mq.registerAlias({ bar: '(min-width: 800px)' });
  
  t.deepEqual(mq.aliases, {
    foo: '(max-width: 400px)',
    bar: '(min-width: 800px)'
  });
});

test('registration of event handlers', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callbackOne = function(){};
  var callbackTwo = function(){};
    
  mq.on('foo', callbackOne);
  mq.on('foo', callbackTwo);
    
  t.deepEqual(mq.queries.foo.handlers, [
    { callback: callbackOne, context: mq },
    { callback: callbackTwo, context: mq }
  ]);
});

test('setting of the event handler callback context', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callbackOne = function(){};
  var callbackTwo = function(){};
  var contextOne = {};
  var contextTwo = {};
    
  mq.on('foo', callbackOne, contextOne);
  mq.on('foo', callbackTwo, contextTwo);
  
  t.deepEqual(mq.queries.foo.handlers, [
    { callback: callbackOne, context: contextOne },
    { callback: callbackTwo, context: contextTwo }
  ]);
});

test('removal of all event handlers', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callback = function(){};
  mq.on('foo', callback);
  mq.on('bar', callback);
  mq.on('bar', callback);

  mq.off();

  t.looseEquals(mq.queries, {});
});

test('removal of all event handlers for a query', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callback = function(){};
  mq.on('foo', callback);
  mq.on('bar', callback);
  mq.on('bar', callback);

  mq.off('bar');

  t.equals(mq.queries.bar, undefined);
});

test('removal of a single handler for a query', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callback = function(){};
  var callbackTwo = function(){};
  mq.on('foo', callback);
  mq.on('bar', callback);
  mq.on('bar', callbackTwo);

  mq.off('bar', callback);

  t.deepEqual(mq.queries.bar.handlers, [
    { callback: callbackTwo, context: mq }
  ]);
});

test('removal of aliases if queries are removed', function(t){
  t.plan(1);
  var mq = new MQFacade({
    fooAlias: 'foo',
    barAlias: 'bar'
  });
  var callback = function(){};
  mq.on('fooAlias', callback);
  mq.on('barAlias', callback);
  mq.on('barAlias', callback);

  mq.off('barAlias');

  t.equals(mq.aliases.barAlias, undefined);
});

test('removal of a single handler with a specific context for a query', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callback = function(){};
  var callbackTwo = function(){};
  var context = {};
  mq.on('foo', callback);
  mq.on('bar', callbackTwo);
  mq.on('bar', callback, context);

  mq.off('bar', callback, context);

  t.deepEqual(mq.queries.bar.handlers, [
    { callback: callbackTwo, context: mq }
  ]);
});

test('removal of a query object if its last handler is removed', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callback = function(){};
  mq.on('foo', callback);

  mq.off('foo', callback);

  t.equals(mq.queries.foo, undefined);
});

test('attempting to remove a query that doesn\'t exist should throw an error', function(t){
  t.plan(1);
  var mq = new MQFacade();
  t.throws(function(){
    mq.off('bar');
  }, '"bar" is not registered');
});

test('only triggering event handlers when a media query is entered', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callCount = 0;
  var callback = function(){ callCount++; };
  mq.on('foo', callback);

  mq.queries.foo.listener();
  mq.queries.foo.listener();

  t.equals(callCount, 1);
});

test('triggering a newly registered event handler if the query matches', function(t){
  t.plan(1);
  var mq = new MQFacade();
  var callCount = 0;
  var callback = function(){ callCount++; };
  
  mq.on('all', callback);

  t.equals(callCount, 1);
});