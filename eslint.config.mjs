// @ts-check
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  plugins: {
    'unused-imports': eslintPluginUnusedImports,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'vue/no-multiple-template-root': ['off'],
    'vue/html-self-closing': 'off',
  },
})
