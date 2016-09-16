
# API
All the configuration needed to customize vitamin is done through a `.vitaminrc`
file at the root of your project.

##Table of content

- [routes](#routes)
- [redux](#redux)
 - [reducers](#reducers)
 - [middlewares](#reduxMiddlewares)
 - [enhancers](#enhancers)
 - [state](#state)
   - [serializer](#serializer)
- [server](#server)
 - [host](#host)
 - [port](#port)
 - [basepath](#basepath)
 - [externalURL](externalUrl)
 - [middlewares](#serverMiddlewares)
 - [actionDispatcher](#actionDispatcher)
 - [layout](#layout)
 - [Error404Page](#Error404)
 - [Error500Page](#Error500)
- [build](#build)
 - [path](#path)
 - [server](#buildServer)
   - [filename](#serverFilename)
 - [client](#client)
   - [publicPath](#publicPath)
   - [filename](#clientFilename)
   - [secondaryEntries](#secondaryEntries)
- [rootElementId](#rootElementId)

## <a id='routes'></a>[`routes`](#routes)
**`Path (`[`<Route>`](https://github.com/reactjs/react-router/blob/master/docs/API.md#route)` | `[`store`](http://redux.js.org/docs/api/Store.html#store)` => `[`<Route>`](https://github.com/reactjs/react-router/blob/master/docs/API.md#route)`)`**


Root route of your application. This is the only mandatory element for running vitaminjs.`
You can export a function. If you do so, the function will be call with the redux store. Useful
for registering listener before the application starts. You might want to do that only on client side[TODO link to IS_CLIENT].

## <a id='redux'></a>[`redux`](#redux)
Config option for redux, specified in the `redux` key of the config object.
### <a id='reducers'></a>[`reducers`](#reducers)
**`Path Object`**


A path to a file exporting an object of reducers. **TODO** Print a nice warning when user export
a simple reducer with combineReducer

### <a id='reduxMiddlewares'></a>[`middlewares`](#reduxMiddlewares)
**`Path Array`**


A path to a file exporting an array of [redux middleware](http://redux.js.org/docs/advanced/Middleware.html). By default, vitamin adds the [router](https://github.com/reactjs/react-router-redux#what-if-i-want-to-issue-navigation-events-via-redux-actions) and
[redux-thunk](https://github.com/gaearon/redux-thunk) middleware.

## Server
Config option for server side rendering, specified in the `server` key of the config object.
### <a id='host'></a>[`host`](#host)
**`String`**


The host of the node server. Default to `process.env.HOST`or `localhost`
if not set

### <a id='port'></a>[`port`](#port)
**`String | Integer`**


The port on which the node server is listening. Default to `process.env.PORT`or `3000`

### <a id='basepath'></a>[`basepath`](#basepath)
**`String`**


You can specify a basepath for your vitaminjs application. It will be prepended to all the internal
link inside your app. Useful for mounting your whole app on a subpath.

### <a id='externalUrl'></a>[`externalUrl`](#externalUrl)
**`String`**


If you don't want to serve the static files with vitaminjs, but use a custom server instead, you can
specify its URL here (usually it means you want to use a CDN, or that you don't not using server side rendering). [TODO : change name to staticAssetsPath]

### <a id='serverMiddlewares'></a>[`middlewares`](#serverMiddlewares)
**`Path [ koaMiddleware ]`**


Path to a file exporting an array of koa middlewares. Useful for additional logging, proxy request,
authentication or other things on server.

### <a id='actionDispatcher'></a>[`actionDispatcher`](#actionDispatcher)
**`Path (`[`HTTPRequest`](https://nodejs.org/api/http.html#http_class_http_clientrequest)`, `[`dispatch`](https://redux.js.org/docs/api/Store.html#getState)`, `[`getState`](http://redux.js.org/docs/api/Store.html#getState)`) -> yieldable`**


Path to a file exporting an actionDispatcher. Useful for populating the store on the server before rendering.
It is passed the node http request object, the dispatch function, and getState. It's expected to return something that can be yield (Promise, Generator, etc..) or nothing. If it returns a yieldable, then the server will wait for its completion before continuing.

### <a id='layout'></a>[`layout`](#layout)
**`Path <ReactComponent>`**


You can customize the html layout rendered by the server (if you really need to).
####Props
- `appHTML`: The HTML of the page as a string
- `initialState`: The redux initial state as a serializable object
- `head`: The head from [`react-helmet`](https://github.com/nfl/react-helmet#server-usage)
- `appHTML`: The CSS of the page as a string (to be rendered inside a style tag)

### <a id='Error404'></a>[`Error404Page`](#Error404)
**`Path <ReactComponent>`**


The page that display when a route is not found.

### <a id='Error500'></a>[`Error500Page`](#Error500)
**`Path <ReactComponent>`**


The page that display when a error occurs during the server side rendering.
#### Props
- `error` (optional): the error throwed. Useful for printing stack. Only passed when in dev mode.

## <a id='build'></a>[`build`](#build)
**`Path Object`**


Config options for the build files for both server and client

### <a id='path'></a>[`path`](#path)
**`String`**


The path relative to the application root where both server and client bundle are going to be generated

### <a id='server'></a>[`server`](#buildServer)
**`Path Object`**


Config options for the server build

### <a id='filename'></a>[`filename`](#serverFilename)
**`String `**


Define the filename of the server build. It is relative to [`build.path`](#path). By default, it's `server_bundle.js`

### <a id='client'></a>[`client`](#client)
**`Path Object`**


Config options for the client build

### <a id='publicPath'></a>[`publicPath`](#publicPath)
**`String`**


The URL from which all the public files should be made available. It is similar to [webpack output.publicPath](https://webpack.github.io/docs/configuration.html#output-publicpath) option. By default, it's `build`.

### <a id='clientFilename'></a>[`filename`](#clientFilename)
**`String`**


Define the filename of the client build. It is relative to [`build.path`](#path). You can include a hash with the placeholder `[hash]`. By default, it's `client_bundle.[hash].js`

### <a id='secondaryEntries'></a>[`secondaryEntries`](#secondaryEntries)
**`Path Object`**

TODO 

### <a id='rootElementId'></a>[`rootElementId`](#rootElementId)
**`String`**

If you want to run your application without headers, you can define here the element ID where the app will append itself. By default, it's `vitamin-app`
