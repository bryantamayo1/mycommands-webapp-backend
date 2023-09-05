"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = exports.colorsEnum = exports.userRoles = exports.languages = exports.httpCodes = void 0;
/**
 * Http codes ares used in the application
 */
exports.httpCodes = Object.freeze({
    ok: 200,
    created: 201,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    internal_server_error: 500
});
exports.languages = Object.freeze([
    'bash',
    'css',
    'git',
    'js',
    'jsx',
    'php',
    'sql',
    'tsx',
]);
var userRoles;
(function (userRoles) {
    userRoles["ADMIN"] = "ADMIN";
    userRoles["USER"] = "USER";
    userRoles["GUEST"] = "GUEST";
})(userRoles || (exports.userRoles = userRoles = {}));
/**
 * It’s used in schema SubCategories
 */
exports.colorsEnum = [
    "blue",
    "green",
    "orange",
    "pink",
];
exports.errorMessages = Object.freeze({
    500: "more 500 characters aren’t allowed",
    100: "more 100 characters aren’t allowed",
});
//# sourceMappingURL=constants.js.map