### Can I deploy vitamin to heroku?

Absolutely! Here's how:

First, in your `.vitaminrc` set the value for `server.host` to `"0.0.0.0"`

```
{
  "server": {
    "host": "0.0.0.0"
  }
}
```

Then, set the buildpack
```
$ heroku buildpacks set:https://github.com/victormours/heroku-buildpack-vitaminjs
```

And finally
```
$ git push heroku master
```

And you're done!

### How to do change the HTML layout of a page ?
### How to display something while AsyncProps loads data
