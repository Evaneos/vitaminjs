import { routeActions } from 'redux-simple-router';
import Error from 'base-error';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_SIGN_OUT = 'AUTH_SIGN_OUT';

class AuthenticationError extends Error {}

function authenticationRequest(email, password) {
    return {
        type: AUTH_REQUEST,
        email,
        password
    };
}

function authenticationSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    };
}

function authenticationFailure(error) {
    let message;
    if (error instanceof AuthenticationError) {
        message = error.message;
    }
    return {
        type: AUTH_FAILURE,
        message,
    }
}

function redirectToTarget() {
    return (dispatch, getState) => {
        const location = getState().routing.location;
        const to = (
            location.state
            && location.state.nextPathname
        ) || '/';
        dispatch(routeActions.replace(to))
    };
}


export function signIn(email, password) {
    return (dispatch, getState) => {
        if (getState().isAuthenticating) {
            return;
        }
        dispatch(authenticationRequest(email, password));
        return fetch('/authenticate', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(payload => {
                if (!payload.ok) {
                    throw new AuthenticationError(payload.message);
                }
                dispatch(authenticationSuccess());
                dispatch(redirectToTarget());
            })
            .catch(error => {
                dispatch(authenticationFailure(error));
            });
    }
}

export function signOut() {
    return { type: AUTH_SIGN_OUT }
}
