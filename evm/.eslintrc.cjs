module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'airbnb-base',
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'max-len': 'off',
        'no-console': 'off',
        indent: [
            'warn',
            4,
        ],
        camelcase: 'off',
        'no-await-in-loop': 'off',
        'import/extensions': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'no-constant-condition': 'off',
    // 'import/no-extraneous-dependencies': false,
    // 'import/no-dynamic-require': false,
    // 'global-require': 'off',
    // 'no-param-reassign': 'warn',
    // 'linebreak-style': [
    //   0,
    //   'error',
    //   'windows',
    // ],
    // 'arrow-parens': [2, 'as-needed'],
    },
};
