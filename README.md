# image.browser.js

A initiative for this developing this repo is for having better interface with html canvas and webgl texture. Whoever developing with those techs must know how verbose and inefficient to code and the performance is.

Thus, here come a pixel level image manipulation and processing library working for browser side. This is a OOP image library and the core class is different types of `ImageClass`, which provide read and write access to every pixel.

## Install & Run

A study code. No formal way to install. Support webpack(see `webpack.config.js`). TODO: publish to NPM.

Run bundle:

```
npm run build-dev
```

Run test: open `SpecRunner.html` in browser

## Notes

1. Learning Jasmine. Standalone version download: [Jasmine Standalone](https://github.com/jasmine/jasmine#installation) TODO: integrate Karma or other runner
2. `app.js` could be a simplistic file server for testing
3. testing is partially covered. `daemon` class has bugs very likely. TODO: integrate xhr 2 file object to do fast conversion between data types.

## License

MIT
