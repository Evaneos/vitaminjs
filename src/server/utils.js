
export const toKoaMiddleware = (expressMiddleware) => {
    function middleware(doIt, req, res) {
        const originalEnd = res.end;
        const newRes = res;
        return (done) => {
            newRes.end = (...args) => {
                originalEnd.apply(this, ...args);
                done(null, 0);
            };
            doIt(req, newRes, () => {
                done(null, 1);
            });
        };
    }
    return function* koaMiddleware(next) {
        const ctx = this;
        const req = this.req;
        const runNext = yield middleware(expressMiddleware, req, {
            end(content) {
                ctx.body = content;
            },
            setHeader(...args) {
                ctx.set.apply(ctx, args);
            },
        });
        if (runNext) {
            yield* next;
        }
    };
};
