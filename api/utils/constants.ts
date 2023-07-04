/**
 * Http codes ares used in the application
 */
export const httpCodes = Object.freeze({
    ok: 200,
    created: 201,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    internal_server_error: 500
})

export const languages = Object.freeze([
    'js',
    'git',
    'sql',
    'jsx',
    'tsx',
    'css',
    'bash',
]);

export enum userRoles{
    ADMIN = "ADMIN",
    USER = "USER",
    GUEST = "GUEST",
}

/**
 * It’s used in schema SubCategories
 */
export const colorsEnum = [
    "blue",
    "green",
    "orange",
    "pink",
];

export const errorMessages = Object.freeze({
    500: "more 500 characters aren’t allowed",
    100: "more 100 characters aren’t allowed",
});