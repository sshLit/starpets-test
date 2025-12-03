import withNuxt from './.nuxt/eslint.config.mjs';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

export default withNuxt(
  {
    plugins: {
      prettier: prettierPlugin,
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      ...prettierConfig.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',
      'vue/valid-v-for': 'error',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'UNIQUE',
            'GLOBAL',
            'OTHER_ATTR',
            'CONTENT',
            'EVENTS',
          ],
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'off',
      'vue/no-unused-vars': 'warn',
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      semi: ['error', 'always'],
      'operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
      'multiline-ternary': ['error', 'always-multiline'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['return', 'throw', 'continue', 'break'], next: '*' },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      'import/extensions': [
        'off',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
          vue: 'always',
        },
      ],
    },
  },
  prettierConfig,
);
