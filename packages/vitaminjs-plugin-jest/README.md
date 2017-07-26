<big>
    <h1 align="center">vitaminjs-plugin-jest</h1>
</big>

<p>
    <big>Allows to use jest as a test runner with vitamin project without any configuration</big>
</p>

## How to use ?
In your project, install the plugin as a dev dependency:
```
npm install --dev vitaminjs-dev-plugin
```
or
```
yarn add --dev vitaminjs-dev-plugin
```

Then, add the plugin in your `.vitaminrc`
```json
{
    ...
    "plugins": ["jest"]
}
```

You can launch jest with
```
vitaminjs jest
```