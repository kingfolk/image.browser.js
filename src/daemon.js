/**
 * Daemon for helping easy converting between types
 */
function Daemon() {
  this.canvas = document.createElement('canvas');
  var gl = this.gl = Daemon.getContext(this.canvas);
  this.framebuffer = gl.createFramebuffer();
  /*
    //uncomment bellow to see browser's support to webgl extenstions
    console.log(document.createElement("canvas").getContext("webgl").getSupportedExtensions().join("\n"));
  */
  var ext = this.extFloat = gl.getExtension("OES_texture_float");
  if (!ext) {
    alert('Could not initialize WebGL Ext OES_texture_float!');
    throw new Error('No WEBGL_draw_buffers');
  }
}

/**
 * check webgl support
 * @param  {Canvas} canvas
 * @param  {Object} options
 * @return {Context}
 */
Daemon.getContext = function(canvas, options) {
    var gl;
    try {
        gl = canvas.getContext('webgl', options || {}) ||
            canvas.getContext('experimental-webgl', options || {});
    } catch (e) {
        gl = null;
    }
    if (gl == null) {
        throw new Error('Could not create WebGL context.');
    } else {
        return gl;
    }
}

/**
 * @param  {texture} webgl texture
 * @param  {number} width  width of texture
 * @param  {number} height  height of texture
 * @param  {gl.DatType} type  gl.UNSIGNED_BYTE or gl.FLOAT
 * @return {ArrayBufferView} 1-D array. either Float32Array or Uint8Array
 */
Daemon.prototype.createViewFromTexture = function(texture, width, height, type) {
  var gl = this.gl;
  // Create a framebuffer backed by the texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  // Read the contents of the framebuffer
  var dataType = type ? type : gl.UNSIGNED_BYTE;
  var data;
  if (dataType === gl.FLOAT) {
    data = new Float32Array(width * height * 4);
  }
  else {
    data = new Uint8Array(width * height * 4);
  }
  gl.readPixels(0, 0, width, height, gl.RGBA, dataType, data);

  return data;
}

/**
 * @param  {Image} image JS image object
 * @return {Promise} Promsie allow configure the result image
 */
Daemon.prototype.loadImage = function(image) {
  return new Promise(function(resolve, reject) {
    var img = image;
    if (typeof img === 'string') {
      img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image;
    }
    img.onload = function() {
      resolve(img);
    }
  });
}

/**
 * @param  {Image} image JS image object
 * @return {Uint8Array}  unsigned int array
 */
Daemon.prototype.createViewFromImage = function(image) {
  var width = image.naturalWidth;
  var height = image.naturalHeight;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  var buffer = ctx.getImageData(0, 0, width, height).data;
  return buffer;
}

Daemon.prototype.creatCanvasFromView = function(buffer) {
  var canvas = document.createElement('canvas');
  // Create a 2D canvas to store the result
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');

  // Copy the pixels to a 2D canvas
  var imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);
  return canvas;
}

Daemon.prototype.createImageFromCanvas = function(canvas, width, height) {
  var image = new Image(width, height);
	image.src = canvas.toDataURL("image/png");
	return image;
}

/**
 * @param  {texture} webgl texture
 * @param  {number} width  width of texture
 * @param  {number} height  height of texture
 * @return {Image} image JS image object
 */
Daemon.prototype.createImageFromTexture = function(texture, width, height) {
  var buffer = this.createViewFromTexture(texture, width, height);
  var canvas = this.creatCanvasFromView(buffer);
  return this.createImageFromCanvas(canvas, width, height);
}
/**
 * create buffer directly from url
 * @param  {string} src the requesting url
 * @return {ArrayBuffer} bytes buffer
 * TODO: explore more possiblities of this compressed buffer
 */
Daemon.prototype.createBufferFromUrl = function(src) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", src, true);
  xhr.responseType = "arraybuffer";
  return new Promise(function(resolve, reject) {
    xhr.addEventListener("load", function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
      else {
        reject(xhr.response);
      }
    }, false);
    xhr.send();
  });
}


/**
 * singleton object for Daemon class
 */
var DaemonSingleton = (function () {
  var instance;
  function createInstance() {
    var object = new Daemon();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

module.exports = DaemonSingleton;
module.exports.Daemon = Daemon;
