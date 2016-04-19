# manage-scroll-handlers [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Add and remove scroll handlers to any DOM nodes. Doesn&#39;t block the event loop, and creates as few *actual* handlers as possible.

## Installation

```sh
$ npm install --save manage-scroll-handlers
```

## Usage

With import statement:

```js
import { addScrollHandler, removeScrollHandler } from 'manage-scroll-handlers';

// Add scroll handler to window
addScrollHandler(() => console.log('1'));
addScrollHandler(() => console.log('2'));

// Add scroll handler to another element
addScrollHandler(() => console.log('3'), document.getElementById('scrollable-wrapper'));

// Add and remove scroll handlers
const callback = () => console.log('4');
addScrollHandler(callback);
removeScrollHandler(callback);
```

If you don't have `import` statements available, you can also do:

```js
const { addScrollHandler, removeScrollHandler } = require('manage-scroll-handlers').default;
```

If you're stuck without babel at all, I don't envy you, but you can do this:

```js
var manageScrollHandlers = require('manage-scroll-handlers').default;
var addScrollHandler = manageScrollHandlers.addScrollHandler;
var removeScrollHandler = manageScrollHandlers.removeScrollHandler;
```

## License

MIT © [Ben Berman](jygabyte.com)

[npm-image]: https://badge.fury.io/js/manage-scroll-handlers.svg
[npm-url]: https://npmjs.org/package/manage-scroll-handlers
[daviddm-image]: https://david-dm.org/rivertam/manage-scroll-handlers.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/rivertam/manage-scroll-handlers
