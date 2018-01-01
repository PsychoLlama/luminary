/* eslint-env node */
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import enzyme from 'enzyme';

enzyme.configure({
  adapter: new Adapter(),
});

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
