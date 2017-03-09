import { Route } from 'vitaminjs/react-router';
import HomeComponent from './modules/home';
import Module1Component from './modules/module1';
import Module2Component from './modules/module2';

const getComponent = getModule => (nextState, cb) => cb(null, getModule());

export default (
    <Route>
        <Route path="/" getComponent={getComponent(() => HomeComponent)} />
        <Route path="/module1" getComponent={getComponent(() => Module1Component)} />
        <Route path="/module2" getComponent={getComponent(() => Module2Component)} />
    </Route>
);
