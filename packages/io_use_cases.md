# Ad-hoc message logging (runtime + vitamin cli)
- Warn when an invalid commamd line option is passed
- Notify successful hot reloading or a weird condition in HMR
- Notify of SIGKILL of spawn children
- Successful (or not) start of http server
# Notify of task progress (vitamin cli)
- Server bundle build in hot mode
- Server bundle build in regular mode (not hot)
- Client bundles build
- Client bundles build in hot mode (from http server in dev mode)
- Building of test bundle
# Report compilation errors or success (vitamin cli)
- Client bundle built successfully

# Print stack traces on panic
- Of the builder
- Of the http process
- When require() of new module version fails during HMR
# Vitamin CLI help
At runtime:
```javascript
{
    log(message: string): void;
}
```
At build time:
```javascript
{
    log(message: string): void;
    beginServerBuild(): {
        progress(progress: number) => void,
        succeed() => void
        failed() => void
    }
    beginClientBuild(): {
        progress(progress: number) => void,
        succeed() => void
        failed() => void
    }
}
```
