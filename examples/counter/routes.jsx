import { Route, Switch, HTTPStatus } from 'vitaminjs';
import Counter from './Counter/index.jsx';

export default (
    <Switch>
        <Route component={Counter} exact path="/" />
        <Route component={() => <HTTPStatus status={404} />} />
    </Switch>
);
