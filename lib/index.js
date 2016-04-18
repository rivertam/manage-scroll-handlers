/**
 * @author Ben Berman<ben.m.berman@gmail.com>
 *
 * This module is optimized for space
 * webpack applies uglifier, but uglifier isn't perfect,
 * so some extra optimizations must be made :)
 */

// for if we have addEventListener
const good = (name) =>
  ((element, handler) => element[name]('scroll', handler, false));

// for if we don't
const bad = (name) =>
  ((element, handler) => element[name]('onscroll', handler));

let add;
let remove;

if (typeof addEventListener === 'undefined') {
  add = bad('attachEvent');
  remove = bad('detachEvent');
} else {
  add = good('addEventListener');
  remove = good('removeEventListener');
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

function checkHandler(handler, functionName) {
  if (typeof handler !== 'function') throw new TypeError(functionName, 'requires a handler that is a function!');
}

function addScrollHandler(handler, element = window) {
  checkHandler(handler, 'addScrollHandler');

  const listeners = get(element)[0];
  if (!listeners) {
    const internalHandler = createScrollHandler(element);
    map.push([element, [handler]]);
    add(element, 'scroll', internalHandler);
  } else {
    listeners.push(handler);
  }
}

function removeScrollHandler(handler, element = window) {
  checkHandler(handler, 'removeScrollHandler');

  const getResponse = get(element);
  if (!getResponse) return false;

  const listeners = getResponse[0];
  const i = getResponse[1];
  let success = false;
  for (const li in listeners) {
    if (listeners[li] === handler) {
      listeners.splice(li, 1);
      success = true;
      break;
    }
  }

  if (listeners.length === 0) {
    map.splice(i, 1);
  }

  return false;
}

export default {
  addScrollHandler,
  removeScrollHandler,
};
