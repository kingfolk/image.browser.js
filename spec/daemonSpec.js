var DaemonSingleton = require('../src/daemon.js'),
  Daemon = require('../src/daemon.js').Daemon;

describe('Daemon', function() {
  var daemon = DaemonSingleton.getInstance();

  describe('object functions', function() {
    it('should get context of a canvas', function() {
      var canvas = document.createElement('canvas');
      var gl = Daemon.getContext(canvas);
      expect(gl).toBeDefined();
    });
  });

  describe('class functions', function() {
    describe('create buffer', function() {
      // var rcPath = 'spec/rc/cute_cat.png';
      var rcPath = "https://dl.dropboxusercontent.com/u/139992952/stackoverflow/colorhouse.png"
      it('should create buffer from url', function(done) {
        daemon.createBufferFromUrl(rcPath)
          .then(function(resp) {
            expect(resp).toBeDefined();
            expect(resp.byteLength).toBeGreaterThan(1);
            done();
          })
          .catch(function(msg) {done(msg)});
      });

      it('should be faster from direct request', function(done) {
        var start, start_, t1, t2;
        start = new Date();
        var count = 2;
        function compare(t1, t2) {
          count --;
          if (count == 0) {
            expect(t1).not.toBeLessThan(t2);
            done();
          }
        }
        function secondElapse(start, end) {
          var timeDiff = end - start;
          console.log('Seconds Elapsed: ' + timeDiff + ' ms');
          return timeDiff;
        }

        daemon.createBufferFromUrl(rcPath)
          .then(function(buffer) {
            var b = new Uint8Array(buffer);
            var t1 = secondElapse(start, new Date());
            compare(t1, t2);
          })
          .catch(function(msg) {done(msg)});

        start_ = new Date();
        daemon.loadImage(rcPath)
          .then(function(img) {
            console.log(img)
            // img.crossOrigin = "anonymous";
            // var buffer = daemon.createViewFromImage(img);
            var t2 = secondElapse(start_, new Date());
            compare(t1, t2);
        });
      });
    });

  });

});
