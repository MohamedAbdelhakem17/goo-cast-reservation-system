// This used to define the status text for the application.
const HTTP_STATUS_TEXT = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'error',
    FAIL: 'fail'
});

const USER_ROLE = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
})

const PAYMENT_METHOD = Object.freeze({
    CASH: 'CASH',
    CARD: 'CARD'
})

module.exports = {
    HTTP_STATUS_TEXT,
    USER_ROLE,
    PAYMENT_METHOD
};