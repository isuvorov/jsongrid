
var CSV = require('csv-string');
var _ = require('lodash');



function deepKeyValueCollect(keyPrefix, object) {
  var j, key, len, result, value, valueKey, valueResult;
  result = [];
  if (_.isArray(object)) {
    for (key = j = 0, len = object.length; j < len; key = ++j) {
      value = object[key];
      valueKey = keyPrefix + "[" + key + "]";
      valueResult = deepKeyValueCollect(valueKey, value);
      result = result.concat(valueResult);
    }
  } else if (_.isObject(object)) {
    for (key in object) {
      value = object[key];
      if (keyPrefix) {
        valueKey = keyPrefix + "." + key;
      } else {
        valueKey = key;
      }
      valueResult = deepKeyValueCollect(valueKey, value);
      result = result.concat(valueResult);
    }
  } else {
    result[0] = {
      key: keyPrefix,
      value: object
    };
  }
  return result;
}

function deepAssign(object, key, value) {
  var index, prefix;
  key = key.replace(/]/g, '');
  while (true) {
    index = key.search(/\.|\[/g);
    if (index === -1) {
      break;
    }
    prefix = key.substr(0, index);
    if (object[prefix] == null) {
      if (key[index] === '.') {
        object[prefix] = {};
      } else {
        object[prefix] = [];
      }
    }
    key = key.substr(index + 1);
    object = object[prefix];
  }
  return object[key] = value;
}

module.exports = {
  deepKeyValueCollect: deepKeyValueCollect,
  deepAssign: deepAssign,
  grid2csv: function(grid) {
    return CSV.stringify(grid, "\t");
  },
  csv2grid: function(csv) {
    var result;
    result = [];
    CSV.forEach(csv, '\t', function(row, index) {
      result.push(row);
    });
    result.splice(result.length - 1, 1);
    return result;
  },
  grid2objects: function(grid) {
    var cols, headers, index, j, k, key, len, len1, object, objects, rows, value;
    headers = grid[0];
    rows = grid.slice(1);
    objects = [];
    for (j = 0, len = rows.length; j < len; j++) {
      cols = rows[j];
      object = {};
      for (index = k = 0, len1 = cols.length; k < len1; index = ++k) {
        value = cols[index];
        key = headers[index];
        deepAssign(object, key, value);
      }
      objects.push(object);
    }
    return objects;
  },
  objects2grid: function() {
    return [[3.14]];
  },
  object2grid: function(objects) {
    var keyValues;
    keyValues = deepKeyValueCollect(null, objects);
    return keyValues.map(function(keyValue) {
      return [keyValue.key, keyValue.value];
    });
  },
  transposition: function(grid) {
    return grid[0].map(function(col, i) {
      return grid.map(function(row) {
        return row[i];
      });
    });
  }
};
