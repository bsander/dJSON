# dJSON
Dynamic JSON modification tookit

Deep get and deep set properties on an object.

## get(object, path)
Get value at `path` of `object`. `path` must be a string of the default Javascript syntax for retrieving
values in an object. If the value at `path` does not exist, `undefined` is returned.

### Arguments
* `object` - object to get values from
* `path` - path to values within object

### Example
```Javascript
var djson = require('djson');
var demo = {
  foo: {
    bar: [{
      lorem: {
        ipsum: 'dolor sit amet'
      }
    }]
  }
};

djson.get(demo, 'foo.bar[0].lorem.ipsum');  // ==> 'dolor sit amet'
djson.get(demo, 'foo.bar[1].lorem');  // ==> undefined
```

## set(object, path, value)
Sets value at `path` of `object`. `path` must be a string of the default Javascript syntax for retrieving
values in an object. If `path` does not exist it's created.

### Arguments
* `object` - object to set values on
* `path` - path of property to set
* `value` - value to set

### Example
```Javascript
var djson = require('djson');
var demo = {};

djson.set(demo, 'foo.bar.lorem.ipsum', 'dolor sit amet');
console.log(demo.foo.bar.lorem.ipsum); // ==> 'dolor sit amet'
```

## Pitfalls
There are some pitfalls to using this module:

### Requesting direct properties with a dash on object
Because the implementation uses a sandboxed `eval` to retrieve properties on an object, requesting a property with
a dash directly will resolve in a dot notation of that property. The way to solve this is to use square bracket notation
of the retrieved property instead.

#### Example:
```Javascript
var djson = require('djson');
var demo = {
  'with-dash': 'foo'
};

djson.get(demo, 'with-dash'); // is the same as demo.with-dash and will resolve to `undefined`
djson.get(demo, '["with-dash"]'); // ==> 'foo'
```

### Dynamic creation of arrays is not supported
Dynamic creation of arrays is not supported at the moment.

#### Example:
```Javascript
var djson = require('djson');
var demo = {};

djson.set(demo, 'foo.bar[0].lorem', 'ipsum'); // is the same as demo.with-dash and will resolve to `undefined`
console.log(demo);  // ==> { foo: { bar: { 0: { lorem: 'ipsum' } } } }
```

## Todo
- Cleanup
