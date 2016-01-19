export function signIn(email, password) {
    return {
        type: 'SIGN_IN',
        email,
        password
    };
}
