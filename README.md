<big><h1 align="center">vitamin</h1></big>
<p><big>
 Build toolchain as a dependancy for react/redux application, with a strong emphasis put on DX (Developer eXperience)
</big></p>

## Why ?
Actual state of development for react apps leads to a tremendous amount of boilerplate code for initializing the tooling. Usually, we proceed by finding (or creating) a boilerplate project with approximatly the stack we need, fork it, and start working on it.

However, boilerplate have a major drawback. They can't be updated easily. So instead of a boilerplate, we choose to externalize all the toolchain and building config of a project as an npm dependancy.


Inspiration : https://github.com/bdefore/universal-redux & https://github.com/kriasoft/react-starter-kit

## Behind the hood
What's included in the menu
- [**React**](https://github.com/facebook/react). What else ?
- [**Redux**](https://github.com/rackt/redux). The community consensus for managing application state
- [**CSS modules**](https://github.com/css-modules/css-modules) Namespace your css
- **Server Side Rendering**. SEO and mobile friendly, zero config needed.
- **Hot Module Reload Everywhere**. On server. On reducers. On CSS. On react app. No need to do a `Ctrl+R` ever again. (But without using [react-HMR](https://github.com/reactjs/redux/pull/1455))
- **Error message on the browser**. No need to switch to console anymore. Using [redbox-react](https://www.npmjs.com/package/redbox-react) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware)
- **ES-next**. ES2015, stage-1 proposals and react. Look at our babelrc presets ([browser](https://github.com/Evaneos/vitamin/blob/master/.babelrc.browser) and [node](https://github.com/Evaneos/vitamin/blob/master/.babelrc.node))
- [**Webpack**](https://webpack.github.io) with a bunch of useful loaders preconfigured

## How to get started ?
For now, while the package is still not released :
```shell
$ git clone https://github.com/Evaneos/vitamin
```
Then, use [npm-link](https://docs.npmjs.com/cli/link) to symlink the package inside your node_modules directory (you may need to run it with sudo)
```shell
$ npm link <path/to/vitamin/repo>
```
You can then install the peerDependancies
```
$ npm i -S async-props react react-router react-router-redux redux react-helmet isomorphic-style-loader
```
One last thing, create the `.vitaminrc` file at the root of your project.
Then
```
$ ./node_modules/bin/vitamin start --hot
```
## `.vitaminrc`
All the configuration of your app is reduced to a single JSON file (with comments supported)
### routes
A path to the module containing the root [Route](https://github.com/reactjs/react-router/blob/master/docs/API.md#route) of your react application. This is basically all you need to provide to have your app working, if you are not using redux.
### redux
All the configuration specific to redux
#### redux.reducers
The path to the module that exports an **object** of you app reducers.

vitamin will extend the object with the `react-router-redux` reducer under the key `routing`.That's why it can't be a function created with `combineReducer`.
#### redux.middlewares
A path to a module that exports an array of redux middlewares.

## TODO
* [ ] Prevent CSRF
* [ ] add webpack-hot-middleware instead of webpack-dev-server
* [ ] How to handle partial rendering vs the complete page ?
* [ ] Support global install & use local vitamin binary when launched globally (like grunt-cli)
* [ ] plugin authentication (?)
* [ ] Add a HtmlRootComponent
* [ ] Add a Error 500 component
* [ ] Add a Error 404 component
* [ ] Add default app explaning how to get started
* [ ] tests
* [ ] Add more doc
* [ ] add eslint & flow static typecheck in webpack loaders (?)
## TODO for PRODUCTION :
* [ ] add logs handling
* [ ] Set package.json node version to 5.1.0
