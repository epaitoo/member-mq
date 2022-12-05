import {isNumber} from "./isNumber";

describe('isNumber Utils', () => {
  it('its a Number', () => {
    [0, 1, 2, -1, 1.345e17, '1'].map((n) => {
      expect(isNumber(n)).toEqual(true);
    })
  });
  it('Its not a number', () => {
    [false, true, NaN, [], {}, '1a'].map((n) => {
        expect(isNumber(n)).toEqual(false);
    });
  });
});