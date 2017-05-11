import { Route } from 'react-router';

const getComponent = getModule => (nextState, cb) => getModule()
    .then(module => cb(null, module.default));

export default (
    <Route>
        <Route path="/" getComponent={getComponent(() => import('./modules/home'))} />
        <Route path="/module1" getComponent={getComponent(() => import('./modules/module1'))} />
        <Route path="/module2" getComponent={getComponent(() => import('./modules/module2'))} />
    </Route>
);
