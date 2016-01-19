export let storeEnhancer = x => x;

if (process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    typeof window.devToolsExtension !== 'undefined') {
    storeEnhancer = window.devToolsExtension()
}
