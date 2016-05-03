import Helmet from 'react-helmet';
import { PropTypes } from 'react';
import s from './style.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const propTypes = {
    children: PropTypes.node.isRequired,
};
const ErrorPage = ({ children }) =>
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
                // TODO put in vitamin
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ]}
        />
        <div className={s.container}>
            {children}
        </div>
        <footer> Powered by <a href="https://github.com/Evaneos/vitaminjs"> VitaminJS</a> </footer>
    </div>
);

ErrorPage.propTypes = propTypes;

export default withStyles(ErrorPage, s);
