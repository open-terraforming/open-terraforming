module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: [],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        indent: 'off',
        curly: ['warn', 'all'],
        'padding-line-between-statements': [
            'warn',
            { blankLine: "always", prev: "*", next: ["block-like", "multiline-expression", "multiline-const", "return"] },
            { blankLine: "always", prev: ["block-like", "multiline-expression", "multiline-const"], next: "*" }
        ],
        'react/prop-types': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/member-delimiter-style': ['warn', { multiline: { delimiter: 'none' } }],
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        '@typescript-eslint/prefer-interface': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'prettier/prettier': 'warn'
    }
}