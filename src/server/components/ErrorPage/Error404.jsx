/* eslint no-script-url: "off" */
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Pineapple from './Pineapple';
import s from './style.css';

const Error404 = () => (
    <div>
        <div className={s.pineapple}>
            <span>4</span>
            <Pineapple />
            <span>4</span>
        </div>
        <h1>Not Found</h1>
        <h2>We can't seem to find the page you asked</h2>
        <p>
            Maybe the resource you were looking for have been moved, or deleted.
            Maybe it has never existed. Anyway, you can
            always <a href="javascript:history.back()">go back</a> where you came
            from.
        </p>
    </div>
);

export default withStyles(s)(Error404);
