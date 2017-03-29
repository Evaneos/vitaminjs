### Can I deploy vitamin to heroku?

Absolutely! From your application directory, you can set the buildpack like this:
```
$ heroku buildpacks set:https://github.com/victormours/heroku-buildpack-vitaminjs
```

And then just `git push heroku master`

And you're done!

### How to use generators / async-await ?
VitaminJS comes with babel transforms that make generators and async-await works outside the box on the server-side. However, if you want to use them on the client side, you'll need to add a runtime executable to your app. 
```shell
$ yarn add regenerator-runtime
```
And then, import it at the top of your `routes.jsx` file. 
```js
import 'regenerator-runtime/runtime';
...
export default myRoutes
```

### Can I customize webpack config ?
No. For now, you don't have the possibility to extends vitaminJS build config. You can refer to #205 on the why we didn't ship with a plugin system. However, we are currently slowly evolving on this mentality and that's something we might consider for next major. Any suggestion is welcome!
