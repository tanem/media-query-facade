# media-query-facade

[![NPM version](https://badge.fury.io/js/media-query-facade.svg)](http://badge.fury.io/js/media-query-facade)  
[![browser support](https://ci.testling.com/tanem/media-query-facade.png)](https://ci.testling.com/tanem/media-query-facade)

Do stuff via JavaScript when the media queries on a document change. For efficiency it uses [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia) under the hood.

## Installation

```sh
$ npm install media-query-facade --save
```

## Example

```js
var MQFacade = require('media-query-facade');

var mq = new MQFacade({
  small: 'only screen and (max-width: 480px)',
  medium: 'only screen and (min-width: 480px) and (max-width: 720px)'
});

mq.on('small', changeColour('blue'));
mq.on('medium', changeColour('green'));
mq.on('only screen and (min-width: 720px)', changeColour('red'));

function changeColour(colour){
  return function(){
    document.body.style.backgroundColor = colour;
  };
}
```

There is also an example which uses [browserify](http://browserify.org) to make this work for the browser:

```sh
$ npm run example
```

## API

### var mq = new MQFacade(aliases)

Initialise a new `MQFacade`. Media query `aliases` may also be provided up front.

### mq.registerAlias(alias, query)

Register an `alias` for a `query`, or register a number of aliases at once via an object.

```js
mq.registerAlias('small', '(max-width: 100px)');
mq.registerAlias({
  small: '(max-width: 100px)',
  medium: '(max-width: 200px)'
});
```

### mq.on(query, callback, context)

Register a `callback` which will be executed with the given `context` on entry of the given `query` or alias. If `context` is not specified, it will default to the `mq` instance.

```js
mq.on('(max-width: 400px)', function(){});
mq.on('smartphones', function(){}, {});
```

### mq.off(query, callback, context)

Remove all callbacks for all queries:

```js
mq.off();
```

Remove all callbacks for a `query` or alias:

```js
mq.off('(max-width: 400px)');
```

Remove a `callback` for a `query` or alias:

```js
mq.off('(max-width: 400px)', function(){});
```

Remove a `callback` with a `context` for a `query` or alias:

```js
mq.off('(max-width: 400px)', function(){}, {});
```

## Testing

```sh
$ npm run test-spec
```

To generate a coverage report:

```sh
$ npm run test-cov
```

## Credits

A conversation with [Jacob Buck](https://github.com/jacobbuck) which sparked the idea for this module.