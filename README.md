## NOT PRODUCTION READY

## Why ?
Actual state of development for react apps leads to a tremendous amount of boilerplate code for initializing the tooling. Usually, we proceed by finding (or creating) a boilerplate project with approximatly the stack we need, fork it, and start working commiting on it.

However, boilerplate have a major drawback. They can't be updated easily. So instead of a boilerplate, we tried to externalize all the toolchain and building config of a project in a npm package.

Inspiration : https://github.com/bdefore/universal-redux & https://github.com/kriasoft/react-starter-kit

## What are our opinions ?
This toolchain is opinionated with the following libraries / tools:
- [**React**](https://github.com/facebook/react) with server-side rendering
- [**Redux**](https://github.com/rackt/redux) (with redux-thunk, and redux-simple-router)
- [**CSS modules**](https://github.com/css-modules/css-modules) with server-side rendering
- [**koa**](https://github.com/koajs/koa) for rendering & serving the app
- **Babel** transpiling. Look at our babelrc presets ([browser](https://github.com/Evaneos/fondation/blob/master/.babelrc.browser) and [node](https://github.com/Evaneos/fondation/blob/master/.babelrc.node))
- We provide an auth mecanism (more on that later)
- Hot module reload everywhere it is possible in development.

## How to get started ?
For now, while the package is still not released :
```shell
$ git clone https://github.com/Evaneos/fondation
```
Then, use [npm-link](https://docs.npmjs.com/cli/link) to symlink the package inside your node_modules directory (you may need to run it with sudo)
```shell
$ npm link <path/to/fondation/repo>
```
Then, alias the command
```
$ alias fondation=<path/to/fondation/repo>/bin
```
Finally
```
$ fondation init
```

## How to configure my project ?
A redux project consists in
- A reducer
- A root container
So that's the only things you need to supply. You can specify them in the `app_descriptor/app.js` file. By the way, all the API between fondation and your project is confined to the `app_descriptor` directory.

####Redux
- Middlewares, to customize your actions
- State serializer for serializing the state between the front & the back
####Server
- Middlewares (`app_descriptor/server.js` )
####Build
- plugins for the build (see later)

## TODO
* [x] Support development env without HMR. We need to trigger react-transform-hmr only with dev server.
* [ ] Prevent CSRF
* [ ] Add templating engine with template imported from app_descriptor
* [ ] Render full Html page with renderer from app_descriptor
* [ ] Support global install & use local fondation binary when launched globally (like grunt-cli)
* [ ] Split client/server/shared (clean fondation directory layout)
* [ ] organize app descriptor like universal-redux
* [x] plugin system
* [ ] plugin fondation-less ?
* [ ] tests
* [ ] i18n -> intl -> format.js + intl.js (plugin polyfill koa)
* [x] use webpack for server side too
* [x] CSS Modules with SSR (need webpack server side)
* [ ] body + head + root
* [ ] doc
* [ ] put hash in bundle filename
* [x] remove redux dev-tools https://github.com/gaearon/redux-devtools, configure hot reload
* [x] create a .fondationrc that contains build infos
* [x] 1 - process server
		utilise l'api node du webpack-dev-server et qui utilise app.callback de notre serveur koa. Configure le dev-server via la options.setup (callback)
* [x] 2 - hot reload sur node via eval

* [x] 3 - Hot reload sur node via hmr api
        https://webpack.github.io/docs/hot-module-replacement.html
        re-crée le app-callback et le remplace dans le dev-server via un wrapper (cf react-starter-kit/tools/start.js)
* [x] Launch the server build & hot reload after the client (?)
* [ ] fix hot reload for reducers (the appConfig is hotreloaded as well :( )
* [ ] do something for the withStyle import (decorator ? transform with babel ?)
* [ ] better management of config, args, env, and options
* [x] add flow transform
* [ ] add eslint & flow static typecheck in webpack loaders (?)
* [ ] replace console.log with something better
* [ ] the state of the app is in the app object, althought it's not specifically written...
## TODO for PRODUCTION :
* [x] Peer dependencies and package dependancy cleaning
* [ ] configure build for prod
* [ ] add args to server exec (like host, port etc)
* [ ] add logs handling
* [ ] Set package.json node version to 5.1.0

---

Ask to @mdarse :
- What about fondation node-modules ?

