import Helmet from 'react-helmet';
import Pineapple from './Pineapple';
import s from './style.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const ErrorPage = ({ error: { status, message, name, stack } }) =>
(
    <div className={s.page}>
        <Helmet
            link={[{ href: 'https://fonts.googleapis.com/css?family=Roboto:400,700', rel: 'stylesheet', type: 'text/css' }]}
            link={[{ href: 'https://fonts.googleapis.com/css?family=Roboto+Mono', rel: 'stylesheet', type: 'text/css' }]}
            title={`${status} - VitaminJS`}
        />
        {process.env.NODE_ENV !== 'production' && stack ?
            <div className={s['stack-container']}>
                <p style={{textAlign: 'center'}}><strong style={{color: 'sienna'}}>{name}: {message}</strong></p>
                <pre> <code> {stack} </code> </pre>
                <small> Note: the stack trace is not available in production mode.
                    You can customize this page in the config.</small>
            </div>
            : null
        }
        <div className={s.container}>
            {
                status === 500 ?
                    <div>
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
                    </div> :
                status === 404 ?
                    <div>
                        <div className={s.pineapple}>
                            4
                            <Pineapple />
                            4
                        </div>
                        <h1> Not Found </h1>
                        <h2> We can't seem to find the page you asked </h2>
                        <p>
                            Maybe the resource you were looking for have been moved, or deleted.
                            Maybe it has never existed. Anyway, you can
                            always <a href="javascript:history.back()">go back</a> where you came
                            from.
                        </p>
                    </div>
                : null
            }
        </div>
        <footer> Powered by <a href="https://github.com/Evaneos/vitaminjs"> VitaminJS</a> </footer>
    </div>
);

export default withStyles(ErrorPage, s);
