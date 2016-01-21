import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAILURE,
    AUTH_SIGN_OUT,
} from './actions';

const initialAuthState = {
    isAuthenticating: false,
    isAuthenticated: false,
    lastError: null,
};

export function auth(state = initialAuthState, action) {
    switch (action.type) {
        case AUTH_REQUEST:
            return {
                ...state,
                isAuthenticating: true,
            };

        case AUTH_SUCCESS:
            return {
                ...state,
                isAuthenticating: false,
                isAuthenticated: true,
                lastError: null,
            };

        case AUTH_FAILURE:
            return {
                ...state,
                isAuthenticating: false,
                isAuthenticated: false,
                lastError: action.message,
            };

        case AUTH_SIGN_OUT:
            return {
                ...state,
                ...initialAuthState
            };
    }

    return state;
}
