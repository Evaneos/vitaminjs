import Helmet from 'react-helmet';
import Pineapple from './Pineapple';
import ErrorPage from './ErrorPage';
import { PropTypes } from 'react';
import s from './style.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        stack: PropTypes.string.isRequired,
    }).isRequired,
};

const Error500 = ({ error: { message, name, stack } }) =>
(
    <div>
        <Helmet title="500 - VitaminJS" />
        {process.env.NODE_ENV !== 'production' && stack ?
            <div className={s['stack-container']}>
                <h3 className={s['error-details']}>
                    {name}: {message}
                </h3>
                <pre> <code> {stack} </code> </pre>
                <small> Note: the stack trace is not available in production mode.
                    You can customize this page in the config.</small>
            </div>
            : null
        }
        <ErrorPage>
            <div className={s.pineapple}>
                5
                <Pineapple />
                <Pineapple />
            </div>
            <h1> Woops... </h1>
            <h2> Looks like something went wrong! </h2>
            <p>
                Those error are usually tracked, but if the problem persists feel free
                to contact us. In the meantime, try refreshing.
            </p>
        </ErrorPage>
    </div>
);

Error500.propTypes = propTypes;

export default withStyles(Error500, s);
