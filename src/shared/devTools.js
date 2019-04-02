const storeEnhancers = [];
if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined' &&
        typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
        storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }
}

export default storeEnhancers;
