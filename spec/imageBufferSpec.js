var ImageBuffer = require('../src/imageBuffer');

describe("ImageBuffer", function() {
  var rcPath = "https://dl.dropboxusercontent.com/u/139992952/stackoverflow/colorhouse.png"

  describe("Constructor", function() {
    it("should create a ImageBuffer object from image url", function(done) {
      var imagebuffer = new ImageBuffer(rcPath);
      imagebuffer.onReady()
        .then(function() {
          expect(imagebuffer.width).toBeGreaterThan(0);
          done();
        })
    });
  })

  describe("Access functions", function() {
    var imagebuffer;
    beforeEach(function(done) {
      imagebuffer = new ImageBuffer(rcPath);
      imagebuffer.onReady()
        .then(function() {
          done();
        })
    });

    it("should be able to read pixel at certain coordinate", function() {
      var vec = imagebuffer.get(0, 0);
      expect(vec).toBeDefined();
      expect(vec.length).toBe(4);
      expect(vec[0]).toBeDefined();
    });

    it("should be able to write pixel at certain coordinate", function() {
      imagebuffer.put(0, 0, [123, 124, 125, 126]);
      var vec = imagebuffer.get(0, 0);
      expect(vec[3]).toBe(126);
    });
  })
});
