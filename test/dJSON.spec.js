describe('dJSON', function () {
  'use strict';
  var chai = require('chai');
  var expect = chai.expect;

  var dJSON = require('../lib/dJSON');

  var path = 'x.y["q.{r}"].z';
  var obj;
  beforeEach(function () {
    obj = {
      x: {
        y: {
          'q.{r}': {
            z: 635
          },
          q: {
            r: {
              z: 1
            }
          }
        }
      }
    };
  });
  it('gets a value from an object with a path containing properties which contain a period', function () {
    expect(dJSON.get(obj, path)).to.equal(635);
    expect(dJSON.get(obj, 'x.y.q.r.z')).to.equal(1);
  });

  it('sets a value from an object with a path containing properties which contain a period', function () {
    dJSON.set(obj, path, 17771);
    expect(dJSON.get(obj, path)).to.equal(17771);
    expect(dJSON.get(obj, 'x.y.q.r.z')).to.equal(1);
  });

  it('does not create an object when a path exists as empty string', function () {
    var newObj = {
      nestedObject: {
        anArray: [
          'i have a value',
          ''
        ]
      }
    };
    var newPath = 'nestedObject.anArray[1]';

    dJSON.set(newObj, newPath, 17771);
    expect(newObj).to.deep.equal({
      nestedObject: {
        anArray: [
          'i have a value',
          17771
        ]
      }
    });
  });

  it('creates an object from a path with a left curly brace', function () {
    var newObj = {};

    dJSON.set(newObj, path.replace('}', ''), 'foo');
    expect(newObj).to.be.deep.equal({
      x: {
        y: {
          'q.{r': {
            z: 'foo'
          }
        }
      }
    });
  });
  it('creates an object from a path with a right curly brace', function () {
    var newObj = {};

    dJSON.set(newObj, path.replace('{', ''), 'foo');
    expect(newObj).to.be.deep.equal({
      x: {
        y: {
          'q.r}': {
            z: 'foo'
          }
        }
      }
    });
  });
  it('creates an object from a path with curly braces', function () {
    var newObj = {};

    dJSON.set(newObj, path, 'foo');
    expect(newObj).to.be.deep.equal({
      x: {
        y: {
          'q.{r}': {
            z: 'foo'
          }
        }
      }
    });
  });
  it('creates an object from a path without curly braces', function () {
    var newObj = {};

    dJSON.set(newObj, path.replace('{', '').replace('}', ''), 'foo');
    expect(newObj).to.be.deep.equal({
      x: {
        y: {
          'q.r': {
            z: 'foo'
          }
        }
      }
    });
  });
});
