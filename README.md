# media-query-facade

[![build status](https://img.shields.io/travis/tanem/media-query-facade/master.svg?style=flat-square)](https://travis-ci.org/tanem/media-query-facade)
[![npm version](https://img.shields.io/npm/v/media-query-facade.svg?style=flat-square)](https://www.npmjs.com/package/media-query-facade)
[![npm downloads](https://img.shields.io/npm/dm/media-query-facade.svg?style=flat-square)](https://www.npmjs.com/package/media-query-facade)

> Do stuff via JavaScript when the media queries on a document change. For efficiency it uses [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia) under the hood.

## Usage

```js
import MQFacade from '../src/media-query-facade'

const mq = new MQFacade({
  small: 'only screen and (max-width: 480px)',
  medium: 'only screen and (min-width: 480px) and (max-width: 720px)'
})

const changeColour = colour => () => {
  document.body.style.backgroundColor = colour
}

mq.on('small', changeColour('blue'))
mq.on('medium', changeColour('green'))
mq.on('only screen and (min-width: 720px)', changeColour('red'))
```

There is a working version of the above in the `example` dir. First run `npm start`, then point a browser at `localhost:8080`.

## API

### const mq = new MQFacade(aliases)

Initialise a new `MQFacade`. Media query `aliases` may also be provided up front.

### mq.registerAlias(alias, query)

Register an `alias` for a `query`, or register a number of aliases at once via an object.

```js
mq.registerAlias('small', '(max-width: 100px)')
mq.registerAlias({
  small: '(max-width: 100px)',
  medium: '(max-width: 200px)'
})
```

### mq.on(query, callback, context)

Register a `callback` which will be executed with the given `context` on entry of the given `query` or alias. If `context` is not specified, it will default to the `mq` instance.

```js
mq.on('(max-width: 400px)', () => {})
mq.on('smartphones', () => {}, {})
```

### mq.off(query, callback, context)

Remove all callbacks for all queries:

```js
mq.off()
```

Remove all callbacks for a `query` or alias:

```js
mq.off('(max-width: 400px)')
```

Remove a `callback` for a `query` or alias:

```js
mq.off('(max-width: 400px)', () => {})
```

Remove a `callback` with a `context` for a `query` or alias:

```js
mq.off('(max-width: 400px)', () => {}, {})
```

## Install

```
$ npm install media-query-facade --save
```

There are also UMD builds available via unpkg:

- https://unpkg.com/media-query-facade/dist/media-query-facade.js
- https://unpkg.com/media-query-facade/dist/media-query-facade.min.js

If you use these, make sure you have already included [Lodash](https://lodash.com/) as a dependency.

## License

MIT
