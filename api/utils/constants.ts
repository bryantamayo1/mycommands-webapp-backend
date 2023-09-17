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

/**
 * Library prism.js with mode tomorrow night
 * Selected:
 *  Minified version
 *  Tomorrow Night
 *  Markup + HTML + XML + SVG + MathML + SSML + Atom + RSS
 *  CSS
 *  C-like
 *  Javascript
 *  Bash + Shell + Shell
 *  C
 *  CSS Extras
 *  Git
 *  ignore + .gitignore + .hgignore + .npmignore
 *  Javadoc
 *  JS Extras
 *  Markup templating
 *  PHP
 *  React JSX
 *  React TSX
 *  SQL
 *  TypeScript
 */
export const languages = Object.freeze([
    'bash',
    'c',
    'css',
    'git',
    'js',
    'jsx',
    'php',
    'sql',
    'tsx',
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