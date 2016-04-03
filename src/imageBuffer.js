var Daemon = require('./daemon').getInstance();
/**
 * Constructor for image buffer from html image
 * @param {string || Imag} src.
 * @param {number} width optional
 * @param {number} height optional
 */
function ImageBuffer(src, width, height) {
  this.buffer = null;;
  if (typeof src === 'string' || src instanceof Image) {
    Daemon.loadImage(src)
      .then(function(img) {
        this.buffer = Daemon.createViewFromImage(img);
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
      }.bind(this));
  }
  else if (src && src.length && src.length == width * height * 4) {
    this.buffer = src;
    this.width = width;
    this.height = height;
  }
}

/**
 * Is buffer loaded
 * @return {bool} true if buffer loaded
 */
ImageBuffer.prototype.isReady = function() {
  return !!this.buffer;
}

/**
 * On buffer loaded
 * @return {Promise}
 */
ImageBuffer.prototype.onReady = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    var sid = setInterval(function() {
      if (that.isReady()) {
        clearInterval(sid);
        resolve();
      }
    }, 50);
  });
}

/**
 * Get color vector at certain coordinate
 * @param  {number} x horizontal coordinate
 * @param  {number} y vertical coordinate
 * @return {array}  4-length color vector
 */
ImageBuffer.prototype.get = function(x, y) {
  if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
    throw "Image Get Error: index out of range."
  }
  var idx = (x + y * this.width) * 4;
  var data = this.buffer;
  return [data[idx++], data[idx++], data[idx++], data[idx++]];
}

/**
 * Change color at certain coordinate
 * @param  {number} x horizontal coordinate
 * @param  {number} y vertical coordinate
 * @param  {array} v color that will be changed to
 */
ImageBuffer.prototype.put = function(x, y, v) {
  if (v.length != 4) {
    throw 'Image Get Error: input value has to be an array of length 4.';
  }
  if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
    throw "Image Get Error: index out of range."
  }
  var idx = (x + y * this.width) * 4;
  var data = this.buffer;
  data[idx+3] = v[3];
  data[idx+2] = v[2];
  data[idx+1] = v[1];
  data[idx] = v[0];
}

module.exports = ImageBuffer;
