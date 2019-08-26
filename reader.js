const Reader = require('mbr-buffer').Reader;

function getType (type) {
  if (Types[type]) {
    return Types[type];
  } else {
    throw new Error('Unknown type: ' + type);
  }
}

function getListOfType (reader, type) {
  const size = reader.readUIntBE(4);
  const result = [];

  for (let index = 0 ; index < size ; ++index) {
    result.push(getType(type)(reader));
  }

  return result;
}

const Type = {
  Null: function () {
    this.value = null;
  },
  Byte: function (reader, name) {
    this.value = reader.readUIntBE(1);
    this.name = name;
  },
  Short: function (reader, name) {
    this.value = reader.readUIntBE(2);
    this.name = name;
  },
  Int: function (reader, name) {
    this.value = reader.readUIntBE(4);
    this.name = name;
  },
  Long: function (reader, name) {
    this.value = reader.readUIntBE(4) * 0x100000000 + reader.readUIntBE(4);
    this.name = name;
  },
  Float: function (reader, name) {
    this.value = reader.readFloat();
    this.name = name;
  },
  Double: function (reader, name) {
    this.value = reader.readDouble();
    this.name = name;
  },
  ByteArray: function (reader, name) {
    this.value = getListOfType(reader, 1);
    this.name = name;
  },
  String: function (reader, name) {
    this.value = reader.read(reader.readUIntBE(2));
    this.name = name;
  },
  List: function (reader, name) {
    const type = reader.readUIntBE(1);
    this.value = getListOfType(reader, type);
    this.name = name;
  },
  Compound: function (reader, fieldName) {
    this.value = {};
    this.name = fieldName;
    let type = reader.readUIntBE(1);
    let name;

    while (type !== 0) {
      this.value[reader.read(reader.readUIntBE(2))] = getType(type)(reader);
      type = reader.readUIntBE(1);
    }
  },
  IntArray: function (reader, name) {
    this.value = getListOfType(reader, 3);
    this.name = name;
  },
  LongArray: function (reader, name) {
    this.value = getListOfType(reader, 4);
    this.name = name;
  }
};

Type.Null.prototype.toString = function () {
  return '';
};
Type.Byte.prototype.toString = function () {
  return this.value.toString() + 'b';
};
Type.Short.prototype.toString = function () {
  return this.value.toString() + 's';
};
Type.Int.prototype.toString = function () {
  return this.value.toString();
};
Type.Long.prototype.toString = function () {
  return this.value.toString() + 'L';
};
Type.Float.prototype.toString = function () {
  return this.value.toString() + 'f';
};
Type.Double.prototype.toString = function () {
  return this.value.toString() + 'd';
};
Type.ByteArray.prototype.toString = function () {
  return '[B;' + this.value.join(',') + ']';
};
Type.String.prototype.toString = function () {
  return '"' + this.value + '"';
};
Type.List.prototype.toString = function () {
  return '[' + this.value.join(',') + ']';
};
Type.Compound.prototype.toString = function () {
  let result = '';

  for (const key in this.value) {
    result += (result ? ',' : '') + key + ':' + this.value[key].toString();
  }

  return '{' + result + '}';
};
Type.IntArray.prototype.toString = function () {
  return '[I;' + this.value.join(',') + ']';
};
Type.LongArray.prototype.toString = function () {
  return '[L;' + this.value.join(',') + ']';
};

Type.Null.prototype.toJSON = function () {
  return '';
};
Type.Byte.prototype.toJSON = function () {
  return this.value.toString() + 'b';
};
Type.Short.prototype.toJSON = function () {
  return this.value.toString() + 's';
};
Type.Int.prototype.toJSON = function () {
  return this.value;
};
Type.Long.prototype.toJSON = function () {
  return this.value.toString() + 'L';
};
Type.Float.prototype.toJSON = function () {
  return this.value.toString() + 'f';
};
Type.Double.prototype.toJSON = function () {
  return this.value.toString() + 'd';
};
Type.ByteArray.prototype.toJSON = function () {
  return this.value;
};
Type.String.prototype.toJSON = function () {
  return this.value;
};
Type.List.prototype.toJSON = function () {
  return this.value;
};
Type.Compound.prototype.toJSON = function () {
  return this.value;
};
Type.IntArray.prototype.toJSON = function () {
  return this.value;
};
Type.LongArray.prototype.toJSON = function () {
  return this.value;
};

const Types = {
  '0': function () {return new Type.Null();},
  '1': function (reader, name) {return new Type.Byte(reader, name);},
  '2': function (reader, name) {return new Type.Short(reader, name);},
  '3': function (reader, name) {return new Type.Int(reader, name);},
  '4': function (reader, name) {return new Type.Long(reader, name);},
  '5': function (reader, name) {return new Type.Float(reader, name);},
  '6': function (reader, name) {return new Type.Double(reader, name);},
  '7': function (reader, name) {return new Type.ByteArray(reader, name);},
  '8': function (reader, name) {return new Type.String(reader, name);},
  '9': function (reader, name) {return new Type.List(reader, name);},
  '10': function (reader, name) {return new Type.Compound(reader, name);},
  '11': function (reader, name) {return new Type.IntArray(reader, name);},
  '12': function (reader, name) {return new Type.LongArray(reader, name);}
};

module.exports.read = function read (buffer) {
  const reader = new Reader(buffer);
  const type = reader.readUIntBE(1);
  const name = reader.read(reader.readUIntBE(2));

  return getType(type)(reader, name);
}
