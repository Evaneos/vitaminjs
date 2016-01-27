## NOT PRODUCTION READY

## TODO
* [ ] Support development env without HMR. We need to trigger react-transform-hmr only with dev server.
* [ ] Prevent CSRF
* [ ] Add templating engine with template imported from app_descriptor
* [ ] Render full Html page with renderer from app_descriptor
* [ ] Peer dependencies
* [ ] Support global install & use local fondation binary when launched globally (like grunt-cli)
* [ ] Split client/server/shared (clean fondation directory layout)
* [ ] organize app descriptor like universal-redux
* [x] plugin system
* [ ] plugin fondation-less
* [ ] tests
* [ ] i18n -> intl -> format.js + intl.js (plugin polyfill koa)
* [x] use webpack for server side too
* [x] CSS Modules with SSR (need webpack server side)
* [ ] body + head + root
* [ ] doc
* [ ] put hash in bundle filename
* [ ] remove redux dev-tools https://github.com/gaearon/redux-devtools, configure hot reload
* [x] create a .fondationrc that contains build infos
* [x]
	have only one web server
	1 - process server
		utilise l'api node du webpack-dev-server et qui utilise app.callback de notre serveur koa. Configure le dev-server via la options.setup (callback)
	2 - hot reload sur node
		https://webpack.github.io/docs/hot-module-replacement.html
		re-crée le app-callback et le remplace dans le dev-server via un wrapper (cf react-starter-kit/tools/start.js)
* [ ] configure prod env server

---

Ask to @mdarse :
- What about fondation node-modules ?

