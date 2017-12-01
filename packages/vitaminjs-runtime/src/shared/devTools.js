const storeEnhancers = [];

if (typeof window !== 'undefined' &&
    typeof window.devToolsExtension === 'function') {
    storeEnhancers.push(window.devToolsExtension());
}

export default storeEnhancers;
