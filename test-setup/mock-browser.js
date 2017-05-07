/* global global */
import { JSDOM } from 'jsdom';

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (fn) => setTimeout(fn, 1);
}

const fake = new JSDOM('');
global.window = fake.window;
global.document = window.document;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
