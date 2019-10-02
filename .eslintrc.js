module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    'no-unused-vars': 'off',
    'nuxt/no-cjs-in-config': 'off',
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/no-unused-components': 'off',
    'vue/html-self-closing': 'off',
  },
  // globals?
  globals: {
    $nuxt: true
  }
}
