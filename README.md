<p align="center">
	<img width="125" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Emojione_1F34D.svg" />
</p>

<big><h1 align="center">VitaminJS</h1></big>
<p><big>Build framework to start a server-rendered React/Redux application with a strong focus on developer experience
</big></p>

[![npm version](https://badge.fury.io/js/vitaminjs.png)](https://badge.fury.io/js/vitaminjs)

VitaminJS helps you start your React / Redux application right away.  
It takes care of all the tremendous amount of boilerplate code used to initialize a project and help you focus and what matters : your application.  

VitaminJS comes as a dependency in your application allowing you to always be up to date with the latest practices in the React community.

## Behind the hood
What's included in the menu
- [**React**](https://github.com/facebook/react) What else ?
- [**Redux**](https://github.com/rackt/redux) The community consensus for managing application state
- [**React-Router v3**](https://github.com/ReactTraining/react-router) Routing comes easily
- [**CSS modules**](https://github.com/css-modules/css-modules) Namespace your css
- [**CSSNext**](https://github.com/MoOx/postcss-cssnext) Use tomorrow CSS syntax right now
- [**React-Resolver**](https://github.com/ericclemmons/react-resolver) Async rendering. Render your components when data has been fetched
- [**Webpack**](https://webpack.github.io) with a bunch of useful loaders preconfigured
- **Server Side Rendering**. SEO and mobile friendly, zero config needed.
- **Hot Module Reload Everywhere**. On server. On reducers. On CSS. On react app. On configuration. No more `Ctrl+R`.
- **Error message on the browser**. No need to switch to console anymore. 
- **ES-next**. ES2017, [preset-latest](https://github.com/babel/babel/tree/7.0/packages/babel-preset-latest) on browser and [present-env](https://github.com/babel/babel-preset-env) on node. 

## Get started
### Installation
To start a vitamin powered application, simply install globally our command-line interface.

```bash
yarn global add vitaminjs-cli
```
Or if you are not using [yarn](https://yarnpkg.com/)

```bash
npm install -g vitaminjs-cli
```
Then create your project directory and start a new project with our CLI.
```bash
mkdir my-directory
cd my-directory
vitaminjs new
```
### Set up the dev environment

To start the dev environment, simply run :

```bash
yarn start
```
or if you are not using [yarn](https://yarnpkg.com/)
```bash
npm start
```
By default, your app will be running on [http://localhost:3000](http://localhost:3000)  
Build errors will be displayed in your terminal. Everything will be hot reloaded.  
You can start working on your app immediately !

### Configuration
VitaminJS contains all of its configuration in a *`.vitaminrc`* file.  
When you create a new project, it has the minimal configuration to make it work.

If you want to go further in your development, you can customize your configuration. You can learn more about it in [API Guide](https://github.com/Evaneos/vitaminjs/blob/master/API.md)

### Build for production

To build your application in production mode, run :
```bash
yarn build
```
or if you are not using [yarn](https://yarnpkg.com/)
```bash
npm run build
```

It bundles your application and optimizes its performances. The bundle is also minified.

## Frequently Asked Questions
We have started to answer some frequently asked questions. You can find all of them here: [FAQ](https://github.com/Evaneos/vitaminjs/blob/master/FAQ.md)  
If you have any questions you think are worth be displayed, please raise an issue in the project.  
We will try to update these questions as often as possible. 

## Contributing

Are you interested in contributing to the project ? Great ! To do so, follow this simple steps:
 1. Fork the repository
 2. Do the changes you think are necessary. We are following [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).
 3. Submit a pull request in the project

## Release History

You can find all the changes in the [Changelog](https://github.com/Evaneos/vitaminjs/blob/master/CHANGELOG.md)

## Inspiration

[Universal Redux](https://github.com/bdefore/universal-redux)  
[React-Starter-Kit](https://github.com/kriasoft/react-starter-kit)  
[Create-React-App](https://github.com/facebookincubator/create-react-app)

## License
MIT © [Evaneos](https://www.evaneos.com)
