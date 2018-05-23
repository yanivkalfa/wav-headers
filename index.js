const bufferAlloc = require('buffer-alloc');
const bufferFrom = require('buffer-from');

function getFileHeaders (opts = {}) {
  const RIFF = bufferFrom('RIFF'), WAVE = bufferFrom('WAVE'),
    fmt = bufferFrom('fmt '), data = bufferFrom('data');
  const format = 1;
  const channels = opts.channels || 2;
  const sampleRate = opts.sampleRate || 44100;
  const bitDepth = opts.bitDepth || 16;
  const dataLength = opts.dataLength || 4294967295;

  // format will have a variable size...
  var headerLength = 44;
  var fileSize = dataLength + headerLength;
  var header = bufferAlloc(headerLength);
  var offset = 0;

  // write the "RIFF" identifier
  RIFF.copy(header, offset);
  offset += RIFF.length;

  // write the file size minus the identifier and this 32-bit int
  header.writeUInt32LE(fileSize - 8, offset);
  offset += 4;

  // write the "WAVE" identifier
  WAVE.copy(header, offset);
  offset += WAVE.length;

  // write the "fmt " sub-chunk identifier
  fmt.copy(header, offset);
  offset += fmt.length;

  // write the size of the "fmt " chunk
  // XXX: value of 16 is hard-coded for raw PCM format. other formats have
  // different size.
  header.writeUInt32LE(16, offset);
  offset += 4;

  // write the audio format code
  header.writeUInt16LE(format, offset);
  offset += 2;

  // write the number of channels
  header.writeUInt16LE(channels, offset);
  offset += 2;

  // write the sample rate
  header.writeUInt32LE(sampleRate, offset);
  offset += 4;

  // write the byte rate
  header.writeUInt32LE((sampleRate * channels * bitDepth / 8), offset);
  offset += 4;

  // write the block align
  header.writeUInt16LE((channels * bitDepth / 8), offset);
  offset += 2;

  // write the bits per sample
  header.writeUInt16LE(bitDepth, offset);
  offset += 2;

  // write the "data" sub-chunk ID
  data.copy(header, offset);
  offset += data.length;

  // write the remaining length of the rest of the data
  header.writeUInt32LE(dataLength, offset);
  return header;
}

module.exports = getFileHeaders;
