import { routeActions } from 'redux-simple-router';
import Error from 'base-error';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_SIGN_OUT_REQUEST = 'AUTH_SIGN_OUT_REQUEST';
export const AUTH_SIGN_OUT_SUCCESS = 'AUTH_SIGN_OUT_SUCCESS';
export const AUTH_SIGN_OUT_FAILURE = 'AUTH_SIGN_OUT_FAILURE';

class AuthenticationError extends Error {}

function assertSuccessfulResponse(response) {
    return response.json()
    .then(payload => {
        if (!payload.ok) {
            throw new AuthenticationError(payload.message);
        }
    });
}


function authenticationRequest(email, password) {
    return {
        type: AUTH_REQUEST,
        email,
        password
    };
}

export function authenticationSuccess() {
    return {
        type: AUTH_SUCCESS
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
        return fetch('/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ email, password }),
        })
            .then(assertSuccessfulResponse)
            .then(() => {
                dispatch(authenticationSuccess());
                dispatch(redirectToTarget());
            })
            .catch(error => {
                dispatch(authenticationFailure(error));
            });
    }
}


function deauthenticationRequest() {
    return { type: AUTH_SIGN_OUT_REQUEST };
}

function deauthenticationSuccess() {
    return { type: AUTH_SIGN_OUT_SUCCESS };
}

function deauthenticationFailure(error) {
    let message;
    if (error instanceof AuthenticationError) {
        message = error.message;
    }
    return { type: AUTH_SIGN_OUT_FAILURE, message };
}

export function signOut() {
    return (dispatch, getState) => {
        dispatch(deauthenticationRequest());
        return fetch('/logout', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin'
        })
            .then(assertSuccessfulResponse)
            .then(() => {
                dispatch(deauthenticationSuccess());
            })
            .catch(error => {
                dispatch(deauthenticationFailure(error));
            });
    }
}
