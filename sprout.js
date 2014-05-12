!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sprout=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy;

function assoc(obj, k, value) {
  if (obj[k] === value) return obj;
  var o = copy(obj);
  o[k] = value;
  return o;
}

module.exports = assoc;
},{"./util":13}],2:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    getIn = _dereq_('./getIn');

function assocIn(obj, keys, value) {
  if (getIn(obj, keys) === value) return obj;
  var k = keys[0],
      ks = keys.slice(1),
      o = copy(obj);
  if (ks.length) {
    o[k] = (k in o) ? assocIn(o[k], ks, value) : assocIn({}, ks, value);
  } else {
    o[k] = value;
  }
  return o;
}

module.exports = assocIn;
},{"./getIn":8,"./util":13}],3:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    objectKeys = _dereq_('./util').objectKeys,
    isObject = _dereq_('./util').isObject,
    isArray = _dereq_('./util').isArray,
    getIn = _dereq_('./getIn');

function assocObj(obj, obj2) {
  var keys = objectKeys(obj2),
      n = keys.length,
      i = -1,
      o, o2, k;
  if (!n) return obj;
  o = copy(obj);
  while (++i < n) {
    k = keys[i];
    o2 = obj2[k];
    if (isObject(o2)) {
      o[k] = (k in o) ? assocObj(o[k], o2) : assocObj(isArray(o2) ? [] : {}, o2); // Just assigning o2 to o[k] when k is not in o would be faster but less safe because we'd keep a reference to o2
    } else {
      o[k] = o2;
    }
  }
  return o;
}

module.exports = assocObj;
},{"./getIn":8,"./util":13}],4:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy;

function dissoc(obj, k) {
  if(!(k in obj)) return obj;
  var o = copy(obj);
  delete o[k];
  return o;
}

module.exports = dissoc;
},{"./util":13}],5:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    objectKeys = _dereq_('./util').objectKeys;

function dissocIn(obj, keys) {
  var k = keys[0],
      ks = keys.slice(1),
      o = copy(obj);
  if (ks.length) {
    o[k] = dissocIn(obj[k], ks);
    if (!objectKeys(o[k]).length) delete o[k];
  } else {
    delete o[k];
  }
  return o;
}

module.exports = dissocIn;
},{"./util":13}],6:[function(_dereq_,module,exports){
var dissoc = _dereq_('./dissoc'),
    objectKeys = _dereq_('./util').objectKeys,
    isObject = _dereq_('./util').isObject,
    copy = _dereq_('./util').copy;

function dissocObj(obj, obj2) {
  var keys = objectKeys(obj2),
      n = keys.length,
      i = -1,
      o, o2, k;
  if (!n) return obj;
  o = copy(obj);
  while(++i < n) {
    k = keys[i];
    o2 = obj2[k];
    if (isObject(o2)) {
      o[k] = dissocObj(obj[k], o2);
      if (!objectKeys(o[k]).length) delete o[k];
    } else {
      delete o[k];
    }
  }
  return o;
}

module.exports = dissocObj;
},{"./dissoc":4,"./util":13}],7:[function(_dereq_,module,exports){
var isUndefined = _dereq_('./util').isUndefined;

function get(obj, k, orValue) {
  if (!(k in obj)) return isUndefined(orValue) ? void 0 : orValue;
  return obj[k];
}

module.exports = get;
},{"./util":13}],8:[function(_dereq_,module,exports){
var isUndefined = _dereq_('./util').isUndefined;

// Get value from a nested structure or null.
function getIn(obj, keys, orValue) {
  var k = keys[0],
      ks = keys.slice(1);
  if (!obj.hasOwnProperty(k)) return isUndefined(orValue) ? void 0 : orValue;
  return ks.length ? getIn(obj[k], ks) : obj[k];
}

module.exports = getIn;
},{"./util":13}],9:[function(_dereq_,module,exports){
var get = _dereq_('./get'),
    getIn = _dereq_('./getIn'),
    assoc = _dereq_('./assoc'),
    dissoc = _dereq_('./dissoc'),
    assocIn = _dereq_('./assocIn'),
    dissocIn = _dereq_('./dissocIn'),
    assocObj = _dereq_('./assocObj'),
    dissocObj = _dereq_('./dissocObj'),
    update = _dereq_('./update'),
    updateIn = _dereq_('./updateIn'),
    merge = _dereq_('./merge'),
    util = _dereq_('./util');

function multiGet(obj, path, orValue) {
  if (typeof path === 'string' || typeof path === 'number') return get(obj, path, orValue);
  return getIn(obj, path, orValue);
}

function multiAssoc(obj, path, value) {
  if (typeof path === 'string' || typeof path === 'number') return assoc(obj, path, value);
  if (!util.isUndefined(value) && util.isArray(path)) return assocIn(obj, path, value);
  return assocObj(obj, path);
}

function multiDissoc(obj, path) {
  if (typeof path === 'string' || typeof path === 'number') return dissoc(obj, path);
  if (util.isArray(path)) return dissocIn(obj, path);
  return dissocObj(obj, path);
}

function multiUpdate(obj, path, fn) {
  if (typeof path === 'string' || typeof path === 'number') return update(obj, path, fn);
  return updateIn(obj, path, fn);
}

module.exports = {
  get: multiGet,
  assoc: multiAssoc,
  dissoc: multiDissoc,
  update: multiUpdate,
  merge: merge
};
},{"./assoc":1,"./assocIn":2,"./assocObj":3,"./dissoc":4,"./dissocIn":5,"./dissocObj":6,"./get":7,"./getIn":8,"./merge":10,"./update":11,"./updateIn":12,"./util":13}],10:[function(_dereq_,module,exports){
function merge() {
  var n = arguments.length,
      i = -1,
      o = {},
      k, obj;

  while (++i < n) {
    obj = arguments[i];
    for (k in obj) {
      o[k] = obj[k];
    }
  }

  return o;
}

module.exports = merge;
},{}],11:[function(_dereq_,module,exports){
var get = _dereq_('./get'),
    assoc = _dereq_('./assoc');

function update(obj, k, fn) {
  var args = Array.prototype.slice.call(arguments, 3),
      value = get(obj, k);
  return assoc(obj, k, fn.apply(value, [value].concat(args)));
}

module.exports = update;
},{"./assoc":1,"./get":7}],12:[function(_dereq_,module,exports){
var getIn = _dereq_('./getIn')
    assocIn = _dereq_('./assocIn');

function updateIn(obj, keys, fn) {
  var args = Array.prototype.slice.call(arguments, 3),
      value = getIn(obj, keys);
  return assocIn(obj, keys, fn.apply(value, [value].concat(args)));
}

module.exports = updateIn;
},{"./assocIn":2,"./getIn":8}],13:[function(_dereq_,module,exports){
var _toString = {}.toString;

var isArray = Array.isArray || function(arr) { return _toString.call(arr) === '[object Array]'; };

function isObject(obj) {
  return typeof obj === 'object';
}

function isUndefined(v) {
  return v === void 0;
}

// Shallow copy
function copy(obj) {
  if (isArray(obj)) return obj.slice();
  var k,
      newObj = {};
  for (k in obj) {
    newObj[k] = obj[k];
  }
  return newObj;
}

function objectKeys(obj) {
  var keys = [], k;
  for (k in obj) {
    keys.push(k);
  }
  return keys;
}

module.exports = {
  copy: copy,
  objectKeys: objectKeys,
  isObject: isObject,
  isArray: isArray,
  isUndefined: isUndefined
};
},{}]},{},[9])
(9)
});