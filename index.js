const zlib = require('zlib');
const nbt = require('./reader.js');

module.exports.read = function NBTRead (buffer, callback) {
  zlib.unzip(buffer, function (error, data) {
    const dataToParse = error ? buffer : data;

    try {
      callback(null, nbt.read(dataToParse));
    } catch (error) {
      callback(error);
    }
  });
}
