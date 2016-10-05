
# API
All the configuration needed to customize vitamin is done through a `.vitaminrc`
file at the root of your project.

##Table of content

- [routes](#routes)
- [redux](#redux)
 - [reducers](#reducers)
 - [middlewares](#reduxMiddlewares)
 - [enhancers](#enhancers)
 - [stateSerializer](#stateSerializer)
- [server](#server)
 - [host](#host)
 - [port](#port)
 - [basepath](#basepath)
 - [externalURL](externalUrl)
 - [middlewares](#serverMiddlewares)
 - [actionDispatcher](#actionDispatcher)
 - [layout](#layout)
 - [ErrorPage](#ErrorPage)
 - [onError](#onError)
- [build](#build)
 - [path](#buildPath)
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

### <a id='enhancers'></a>[`enhancers`](#enhancers)
**`Path [ StoreEnhancers ]`**


A path to a file exporting an array of [store enhancers](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer).

### <a id='stateSerializer'></a>[`stateSerializer`](#stateSerializer)
**`Path`**


Path to a file exporting two functions.
 - **`stringify`**: `State-> String`
 - **`parse`**: `String -> State`

Used for transmetting the state computed by the server to the client. By default, it serialize the state with JSON. It should be good if you're doing Vanilla redux. If, however, you use some fancy structure in your state (for instance [Immutable.js](https://facebook.github.io/immutable-js/), you can specify a different parser and stringifier.

## <a id='server'></a>[`server`](#server)
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
**`Path (`[`KoaRequest`](http://koajs.com/#request)`, `[`dispatch`](https://redux.js.org/docs/api/Store.html#getState)`, `[`getState`](http://redux.js.org/docs/api/Store.html#getState)`) -> yieldable`**


Path to a file exporting an actionDispatcher. Useful for populating the store on the server before rendering.
The actionDispatcher is passed the node http request object, the dispatch function, and getState
as parameters. It's expected to return something that can be yield (Promise, Generator, etc..) or nothing. If it returns a yieldable, then the server will wait for its completion before continuing.

### <a id='layout'></a>[`layout`](#layout)
**`Path <ReactComponent>`**


You can customize the HTML layout rendered by the server (if you really need to).
####Props
- `head`: The head from [`react-helmet`](https://github.com/nfl/react-helmet#server-usage)
- `style`: The CSS of the page as a string
- `children`: The app itself (or the error pages)

### <a id='ErrorPage'></a>[`ErrorPage`](#ErrorPage)
**`Path <ReactComponent>`**

The page displayed when an error occurs.
#### Props
- `HTTPStatus`: the error throwed. Useful for printing stack. Only passed when in dev mode.
- `request`: The koa request object
- `error` (optional): If the page is displayed because of an error thrown during rendering (500)
    you'll find here the javascript Error object (with the usual `name`, `message` and `stack` props)
- `state` (optional): The redux state object, if it's present


### <a id='onError'></a>[`onError`](#onError)
**`Path (context: { HTTPStatus: Number, request: [`[`KoaRequest`](http://koajs.com/#request)]`, error: `[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)`, state: ReduxState })`**

This function will be called server side when an error occurs during the application rendering.
Useful for advanced logging.

#### Parameters
- `context`: An object containing specifics about the error
    - `HTTPStatus`: the error throwed. Useful for printing stack. Only passed when in dev mode.
    - `request`: The koa request object
    - `error` (optional): If the page is displayed because of an error thrown during rendering (500)
        you'll find here the javascript Error object (with the usual `name`, `message` and `stack`
        properties)
    - `state` (optional): The redux state object, if it's present


## <a id='build'></a>[`build`](#build)
Config options for the build files for both server and client

### <a id='buildPath'></a>[`path`](#buildPath)
**`String`**


The path relative to the application root where both server and client bundle are going to be generated

### <a id='buildServer'></a>[`server`](#buildServer)
**`Path Object`**


Config options for the server build

### <a id='serverFilename'></a>[`filename`](#serverFilename)
**`String `**


Define the filename of the server build. It is relative to [`build.path`](#buildPath). By default, it's `server_bundle.js`

### <a id='client'></a>[`client`](#client)
**`Path Object`**


Config options for the client build

### <a id='publicPath'></a>[`publicPath`](#publicPath)
**`String`**


The URL from which all the public files should be made available. It is similar to [webpack output.publicPath](https://webpack.github.io/docs/configuration.html#output-publicpath) option. By default, it's `build`.

### <a id='clientFilename'></a>[`filename`](#clientFilename)
**`String`**


Define the filename of the client build. It is relative to [`build.path`](#buildPath). You can include a hash with the placeholder `[hash]`. By default, it's `client_bundle.[hash].js`

### <a id='secondaryEntries'></a>[`secondaryEntries`](#secondaryEntries)
**`Path Object`**

TODO

## <a id='rootElementId'></a>[`rootElementId`](#rootElementId)
**`String`**

If you want to run your application without headers, you can define here the element ID where the app will append itself. By default, it's `vitamin-app`
