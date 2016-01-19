import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { routeActions } from 'redux-simple-router';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function mapStateToProps(state) {
    return {
        location: state.location,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        replace: compose(dispatch, routeActions.replace)
    }
}

export default function requireAuthentication(WrappedComponent) {
    class Authenticated extends Component {
        componentWillMount() {
            this.checkAuth(this.props);
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth(nextProps);
        }

        checkAuth({ isAuthenticated, location, replace }) {
            // TODO Handle server-side (no location)
            if (!isAuthenticated) {
                replace({
                    pathname: '/login',
                    state: { nextPathname: location.pathname }
                });
            }
        }

        render() {
            const {
                isAuthenticated,
                ...others
            } = this.props;
            return isAuthenticated
                ? <Component {...others} />
                : null;
        }
    }

    Authenticated.displayName = `Authenticated(${getDisplayName(WrappedComponent)})`
    Authenticated.WrappedComponent = WrappedComponent

    return connect(mapStateToProps, mapDispatchToProps)(Authenticated);
}
