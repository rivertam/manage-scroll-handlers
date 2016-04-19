/**
 * @author Ben Berman<ben.m.berman@gmail.com>
 *
 * This module is optimized for space
 * webpack applies uglifier, but uglifier isn't perfect,
 * so some extra optimizations must be made :)
 */

// for if we have addEventListener
const good = (name) =>
  ((element, handler) => element[name + 'EventListener']('scroll', handler, false));

// for if we don't
const bad = (name) =>
  ((element, handler) => element[name + 'Event']('onscroll', handler));

let add;
let remove;

if (typeof addEventListener === 'undefined') {
  add = bad('attach');
  remove = bad('detach');
} else {
  add = good('add');
  remove = good('remove');
}

const raf = typeof requestAnimationFrame === 'undefined' ?
  (fn => setTimeout(fn, 30)) : requestAnimationFrame;

// map from DOMElement => Array<Function>
// but it's implemented as an associative array
const map = [];

function get(element) {
  for (const i in map) {
    if (map[i][0] === element) {
      return [map[i][1], i];
    }
  }

  return null;
}

function createScrollHandler(element) {
  return e => {
    get(element)[0].forEach(fn => {
      raf(() => fn(e));
    });
  };
}

// This function just validates that the handler is a function
// it's separated into a different function to optimize for space
function checkHandler(handler, functionName) {
  if (typeof handler !== 'function') throw new TypeError(functionName, 'requires a handler that is a function!');
}

/**
 * addScrollHandler adds a handler for scroll events on an element
 * it aggregates all of the handlers so there's only one real handler on the element
 *
 * @param {Function} handler the scroll handler (receives event, like a normal scroll handler)
 * @param {DOMElement} element optional element to which to attach the scroll handler. Defaults to window.
 */
function addScrollHandler(handler, element = window) {
  checkHandler(handler, 'addScrollHandler');

  const getResponse = get(element);
  if (!getResponse) {
    const internalHandler = createScrollHandler(element);
    map.push([element, [handler], internalHandler]);
    add(element, internalHandler);
  } else {
    getResponse[0].push(handler);
  }
}

/**
 * removeScrollHandler removes a handler from an element
 * If this was the last handler on the element managed by this module,
 * it removes the scroll handler that's actually attached to the DOM element.
 *
 * @param {Function} handler the handler that was originally added to the same DOM element
 * @param {DOMElement} element element to which the scroll handler was attached. Defaults to window.
 */
function removeScrollHandler(handler, element = window) {
  checkHandler(handler, 'removeScrollHandler');

  const getResponse = get(element);
  if (!getResponse) return false;

  const listeners = getResponse[0];
  const i = getResponse[1];

  // look for the scroll handler
  let success = false;
  for (const li in listeners) {
    if (listeners[li] === handler) {
      // remove the scroll handler from our internal records
      listeners.splice(li, 1);
      success = true;
      break;
    }
  }

  // there are no more listeners on this DOM Node
  if (listeners.length === 0) {
    // remove node from the map and remove listener from the DOM Node
    map.splice(i, 1);
    remove(element, getResponse[2]);
  }

  return success;
}

export default {
  addScrollHandler,
  removeScrollHandler,
};
