export const storeEnhancers = [];

if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined' &&
        typeof window.devToolsExtension !== 'undefined') {
        storeEnhancers.push(window.devToolsExtension());
    }
}


