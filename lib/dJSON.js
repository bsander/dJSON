/**
 * Does a deep selection on a property with support for propertynames which contain a period.
 */

'use strict';
var vm = require('vm');
var _ = require('lodash');
_.mixin(require('underscore.string').exports());

var sandbox = vm.createContext({});

function runCode(code, obj) {
  try {
    if (code[0] !== '.' && code[0] !== '[') {
      code = '.' + code;
    }
    code = 'wrapper' + code;
    sandbox.wrapper = obj;
    return vm.runInContext(code, sandbox);
  } catch (e) {
    return undefined;
  }
}

function get(obj, path) {
  return runCode(path, obj);
}

function setIfExists(obj, path, value) {
  var setCode = path + '=' + JSON.stringify(value);
  return runCode(setCode, obj);
}

function createFromPath(path, value) {
  var objAsString = path.trim();
  // x.y["q.{r"].z
  if (objAsString[0] !== '{') {
    objAsString = '{"' + objAsString;
  }
  // {"x.y["q.{r"].z
  // Replace all occurrences of [ and . with :{ unless the found characters are part of a string
  objAsString = objAsString.replace(/[\[\.](?=([^"']*["'][^"']*["'])*[^"']*$)/g, '":{"');
  // {"x":{"y":{""q.{r"]":{"z
  // Remove any ] and single quotes
  objAsString = objAsString.replace(/[\]\']/g, '');
  // {"x":{"y":{""q.{r"":{"z
  // Let's make sure that the last property will contain a value of {} at the end
  objAsString += '":{';
  // {"x":{"y":{""q.{r"":{"z":{
  // Remove any double " which are caused by the usage of " in the source
  objAsString = objAsString.replace(/"{2,}/g, '"');
  // {"x":{"y":{"q.{r":{"z":{

  // counting the left curly braces which are *not* surrounded by double quotes
  // these will need to be balanced
  var countCurlyBraces = objAsString.match(/[\{](?=([^"]*"[^"]*")*[^"]*$)/g).length;
  // Balance the curly braces
  objAsString += _.repeat('}', countCurlyBraces);
  // {"x":{"y":{"q.{r":{"z":{}}}}}

  // Create JSON object
  var JSONobject = JSON.parse(objAsString);
  if (!_.isUndefined(value)) {
    // set value if supplied
    setIfExists(JSONobject, path, value);
  }

  return JSONobject;
}

function set(obj, path, value) {
  if (!_.isUndefined(get(obj, path))) {
    return setIfExists(obj, path, value);
  }

  var newObj = createFromPath(path, value);
  _.merge(obj, newObj);

  return obj;
}

module.exports = {
  get: get,
  set: set,
  setIfExists: setIfExists
};
