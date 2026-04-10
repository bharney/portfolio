const tseslint = require('typescript-eslint');
const eslintPluginImport = require('eslint-plugin-import');
const eslintPluginJest = require('eslint-plugin-jest');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = tseslint.config(
	// Global ignores
	{
		ignores: ['dist/**', 'node_modules/**', '*.d.ts', 'azuremediaplayer.d.ts']
	},

	// Base config for all TS files
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,

	// Prettier must come after other configs to override formatting rules
	eslintConfigPrettier,

	// Main config for source files
	{
		files: ['src/**/*.ts', 'src/**/*.tsx'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				__PRODUCTION__: 'readonly',
				__SERVER__: 'readonly'
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname
			}
		},
		plugins: {
			import: eslintPluginImport,
			jest: eslintPluginJest,
			'react-hooks': eslintPluginReactHooks
		},
		settings: {
			'import/resolver': {
				node: {
					extensions: ['.js', '.ts', '.tsx']
				}
			}
		},
		rules: {
			// Jest
			...eslintPluginJest.configs.recommended.rules,
			...eslintPluginJest.configs.style.rules,
			'jest/no-disabled-tests': 'off',

			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// General
			'no-alert': 'error',
			'no-process-env': 'off',
			'arrow-parens': ['error', 'as-needed'],
			camelcase: 'off',
			'comma-dangle': 'error',
			complexity: 'off',
			'constructor-super': 'error',
			'dot-notation': 'error',
			eqeqeq: 'off',
			'guard-for-in': 'off',
			'id-blacklist': 'off',
			'id-match': 'off',
			'max-classes-per-file': 'off',
			'max-len': 'off',
			'new-parens': 'error',
			'no-bitwise': 'off',
			'no-caller': 'error',
			'no-console': 'off',
			'no-debugger': 'error',
			'no-eval': 'error',
			'no-new-wrappers': 'error',
			'no-throw-literal': 'off',
			'no-trailing-spaces': 'error',
			'no-undef-init': 'error',
			'no-unsafe-finally': 'error',
			'no-unused-expressions': 'off',
			'no-unused-labels': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'one-var': ['error', 'never'],
			'prefer-const': ['error', { destructuring: 'all' }],
			'quote-props': ['error', 'as-needed'],
			quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
			radix: 'off',
			semi: ['error', 'always'],
			'space-before-function-paren': [
				'error',
				{ anonymous: 'always', named: 'never', asyncArrow: 'always' }
			],
			'spaced-comment': 'off',
			'use-isnan': 'error',
			'valid-typeof': 'off',

			// Import
			'import/order': 'off',
			'import/no-unresolved': [2, { ignore: ['bundle-text'] }],
			'import/no-cycle': [2, { maxDepth: 10 }],

			// TypeScript
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/adjacent-overload-signatures': 'error',
			'@typescript-eslint/array-type': 'error',
			'@typescript-eslint/consistent-type-assertions': 'off',
			'@typescript-eslint/member-ordering': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-empty-interface': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/no-var-requires': 'error',
			'@typescript-eslint/prefer-for-of': 'off',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
			'@typescript-eslint/prefer-includes': 'off',
			'@typescript-eslint/triple-slash-reference': 'error',
			'@typescript-eslint/unified-signatures': 'error',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/prefer-string-starts-ends-with': 'off',
			'@typescript-eslint/prefer-regexp-exec': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/restrict-template-expressions': 'error',
			'@typescript-eslint/restrict-plus-operands': 'error',
			'@typescript-eslint/no-restricted-types': 'error',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-wrapper-object-types': 'off',
			'@typescript-eslint/prefer-function-type': 'off',
			'@typescript-eslint/naming-convention': [
				'error',
				{ selector: 'default', format: ['camelCase'] },
				{
					selector: 'variable',
					filter: {
						regex: '^__.*__$',
						match: true
					},
					format: null
				},
				{
					selector: 'variable',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
					filter: {
						regex: '^__.*__$',
						match: false
					}
				},
				{ selector: 'function', format: ['camelCase', 'PascalCase'] },
				{ selector: 'method', format: ['camelCase', 'PascalCase'] },
				{
					selector: 'parameter',
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow'
				},
				{ selector: 'import', format: ['camelCase', 'PascalCase'] },
				{
					selector: 'memberLike',
					modifiers: ['private'],
					format: ['camelCase'],
					leadingUnderscore: 'allow'
				},
				{ selector: 'typeLike', format: ['PascalCase'] },
				{ selector: 'property', format: null }
			]
		}
	},

	// Config files (JS, not type-checked)
	{
		files: ['*.js', '*.config.js', '*.config.ts'],
		...tseslint.configs.disableTypeChecked
	}
);
