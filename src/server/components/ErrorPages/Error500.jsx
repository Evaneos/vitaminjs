import Helmet from 'react-helmet';
import Pineapple from './Pineapple';
import ErrorPage from './ErrorPage';
import { PropTypes } from 'react';
import s from './style.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const propTypes = {
    /* In production, error is null (prevent leaking internals) */
    error: PropTypes.shape({
        message: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        stack: PropTypes.string.isRequired,
    }),
};

const Error500 = ({ error }) =>
(
    <div>
        <Helmet title="500 - VitaminJS" />
        { error ?
            <div className={s['stack-container']}>
                <h3 className={s['error-details']}>
                    {error.name}: {error.message}
                </h3>
                <pre> <code> {error.stack} </code> </pre>
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
