import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends('eslint:recommended'),
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.commonjs,
                ...globals.jest,
            },

            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            'linebreak-style': 0,

            'quotes': [
                'warn',
                'single',
                {
                    avoidEscape: true,
                },
            ],

            'semi': ['error', 'always'],

            'camelcase': [
                'warn',
                {
                    properties: 'never',
                },
            ],

            'prefer-template': 'warn',
            'curly': ['warn', 'multi-line', 'consistent'],

            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^(CommandInteraction|Client)$',
                },
            ],

            'prefer-const': [
                'warn',
                {
                    destructuring: 'all',
                    ignoreReadBeforeAssign: true,
                },
            ],

            'no-var': 'error',

            'no-constant-condition': [
                'error',
                {
                    checkLoops: false,
                },
            ],

            'no-throw-literal': 'error',

            'array-callback-return': [
                'error',
                {
                    allowImplicit: true,
                },
            ],

            'default-param-last': 'error',
            'prefer-arrow-callback': 'error',
            'no-duplicate-imports': 'error',
            'eqeqeq': ['error', 'always'],
            'no-unneeded-ternary': 'error',

            'no-empty': [
                'error',
                {
                    allowEmptyCatch: true,
                },
            ],
        },
    },
];
