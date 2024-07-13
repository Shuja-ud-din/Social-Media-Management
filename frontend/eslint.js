const path = require('node:path')

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    '@antfu/eslint-config-react',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['~', './src']],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
      webpack: {
        config: {
          resolve: {
            alias: {
              '~': path.resolve(__dirname, 'src'),
            },
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
          },
        },
      },
    },
  },
  rules: {
    'unicorn/no-negated-condition': ['error'],
    'unicorn/prefer-spread': ['error'],
    'clsx/prefer-merged-neighboring-elements': ['off'],
    'clsx/forbid-true-inside-object-expressions': ['error', 'always'],
    'react/jsx-curly-brace-presence': ['error'],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'antfu/prefer-inline-type-import': ['error'],
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        'pathGroups': [
          {
            pattern: '~/**',
            group: 'parent',
          },
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'groups': ['builtin', 'external', 'parent', 'sibling', 'index'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    '@typescript-eslint/indent': 'off',
    'arrow-parens': ['error', 'always'],
    'antfu/if-newline': 'off',
    'quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-boolean-value': ['error'],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['\\.(scss|less|css)$', '\\.(png|svg|jpe?g)$', '^virtual:.*$', '\\?url$'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '.',
            message:
              'Do not import from barrel files (index.{ts,js}) from within the same directory to avoid circular dependencies.',
          },
        ],
        patterns: [
          {
            group: ['../../../*'],
            message: 'Please use ~/ instead of deep relative imports.',
          },
        ],
      },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          'useConditionalEffect|useCustomCompareEffect|useDebouncedEffect|useDeepCompareEffect|useIsomorphicLayoutEffect|useLifecycleLogger|useRafEffect|useThrottledEffect|useUpdateEffect|useEffectOnce|useRegisterAnimationEffect',
      },
    ],
  },
}
