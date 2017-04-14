<a name="1.2.1"></a>
## [1.2.1](https://github.com/evaneos/vitaminjs/compare/v1.2.0...v1.2.1) (2017-04-14)
### Bug Fixes
* **build** Revert optimize built time, which was causing some bugs [#356](https://github.com/evaneos/vitaminjs/issues/356)
* **build** Remove css nano and use minify option in css-loader. It was causing some
bugs with the z-index rebasing [#358](https://github.com/evaneos/vitaminjs/issues/358)

<a name="1.2.0"></a>
# [1.2.0](https://github.com/evaneos/vitaminjs/compare/v1.1.0...v1.2.0) (2017-04-07)


### Bug Fixes

* **build:** HMR vendors build ([#330](https://github.com/evaneos/vitaminjs/issues/330)) ([fda868d](https://github.com/evaneos/vitaminjs/commit/fda868d))
* **router:** error thrown during onEnter / onChange are now catched by vitaminjs ([d826c7d](https://github.com/evaneos/vitaminjs/commit/d826c7d))
* **server.js:** terminate http server process gracefully ([#313](https://github.com/evaneos/vitaminjs/issues/313)) ([e6defbc](https://github.com/evaneos/vitaminjs/commit/e6defbc))
* **webpack-config:** add support for css-modules value ([5755c2c](https://github.com/evaneos/vitaminjs/commit/5755c2c))


### Features

* add WatchMissingNodeModulesPlugin from react-dev-utils ([#259](https://github.com/evaneos/vitaminjs/issues/259)) ([c1206cf](https://github.com/evaneos/vitaminjs/commit/c1206cf))
* allow build loader to handle ico files ([75a95ea](https://github.com/evaneos/vitaminjs/commit/75a95ea))
* chunks ([#270](https://github.com/evaneos/vitaminjs/issues/270)) ([576f547](https://github.com/evaneos/vitaminjs/commit/576f547))
* use babel-preset-env for browser ([#271](https://github.com/evaneos/vitaminjs/issues/271)) ([73bff30](https://github.com/evaneos/vitaminjs/commit/73bff30))
* vitaminrc option targetBrowsers ([#272](https://github.com/evaneos/vitaminjs/issues/272)) ([9929f50](https://github.com/evaneos/vitaminjs/commit/9929f50))
* **webpack-config:** add style to mainfields ([a68d720](https://github.com/evaneos/vitaminjs/commit/a68d720))


### Performance Improvements

* **webpack-build:** improve HMR client reload & compile time thanks to webpackDLLPlugin ([6a944ca](https://github.com/evaneos/vitaminjs/commit/6a944ca))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/evaneos/vitaminjs/compare/1.0.1...v1.1.0) (2017-03-07)


### Bug Fixes

* propagate errors from router (#267) ([899d693](https://github.com/evaneos/vitaminjs/commit/899d693))

### Features

* allow use of process.env.PORT and process.env.HOST with serve command. Previousl ([e35570d](https://github.com/evaneos/vitaminjs/commit/e35570d))
* use babel-preset-env (#255) ([cfeb71a](https://github.com/evaneos/vitaminjs/commit/cfeb71a))

<a name="1.0.1"></a>
## [1.0.1](https://github.com/evaneos/vitaminjs/compare/v1.0.0...v1.0.1) (2017-02-23)


### Bug Fixes

* sourcemap support for browser ([c5d3c3f](https://github.com/evaneos/vitaminjs/commit/c5d3c3f))
* **error-handler:** error page was not displayed ([f0c900d](https://github.com/evaneos/vitaminjs/commit/f0c900d))



