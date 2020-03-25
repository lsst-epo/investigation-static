/* eslint-disable */
import '@testing-library/jest-dom/extend-expect';

global.console = {
  log: jest.fn(), // console.log are ignored in tests

  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  error: console.error,
  warn: jest.fn(),
  info: console.info,
  debug: console.debug,
};
