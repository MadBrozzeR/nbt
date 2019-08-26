# nbt-reader

NBT format reader. Format widely used in Minecraft game. Can uncompress GZiped NBT file buffers and uncompressed ones.

## Example

```
const nbt = require('nbt-reader');
const fs = require('fs');

const file = fs.readFileSync('some/file.nbt');

nbt.read(file, function (error, nbt) {
  // error - null in case of successfully read. Error otherwise.
  // nbt.toString() - convert to string format.
  // JSON.stringify(nbt) - convert to JSON format.
});
```
