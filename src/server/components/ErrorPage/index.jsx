import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './style.css';
import Error404 from './Error404';
import Error500 from './Error500';

const propTypes = {
    HTTPStatus: PropTypes.number.isRequired,
    // eslint-disable-next-line react/require-default-props
    error: PropTypes.shape({
        name: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        stack: PropTypes.string.isRequired,
    }),
};

const ErrorPage = ({ HTTPStatus, error }) =>
(
    <div className={s.page}>
        <Helmet
            link={[
                {
                    href: 'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    rel: 'stylesheet',
                    type: 'text/css',
                }, {
                    href: 'https://fonts.googleapis.com/css?family=Roboto+Mono',
                    rel: 'stylesheet',
                    type: 'text/css',
                },
            ]}
            meta={[
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ]}
            title={`${HTTPStatus} - VitaminJS`}
        />
        { process.env.NODE_ENV !== 'production' && error ?
            <div className={s['stack-container']}>
                <h3 className={s['error-details']}>
                    {error.name}: {error.message}
                </h3>
                <pre> <code> {error.stack} </code> </pre>
                <small>
                    Note: the stack trace is not available in production.
                    You can customize this page in the config.
                </small>
            </div>
            : null
        }
        <div className={s.container}>
            {HTTPStatus === 404 ?
                <Error404 />
            :
                <Error500 HTTPStatus={HTTPStatus} error={error} />
            }
        </div>
        <footer> Powered by <a href="https://github.com/Evaneos/vitaminjs"> VitaminJS</a> </footer>
    </div>
);

ErrorPage.propTypes = propTypes;

export default withStyles(s)(ErrorPage);
