import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Pineapple from './Pineapple';
import s from './style.css';

const Error500 = () => (
    <div>
        <div className={s.pineapple}>
            <span>5</span>
            <Pineapple />
            <Pineapple />
        </div>
        <h1> Woops... </h1>
        <h2> Looks like something went wrong! </h2>
        <p>
            Those error are usually tracked, but if the problem persists feel free
            to contact us. In the meantime, try refreshing.
        </p>
    </div>
);

export default withStyles(s)(Error500);
