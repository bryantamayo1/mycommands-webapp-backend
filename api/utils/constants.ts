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