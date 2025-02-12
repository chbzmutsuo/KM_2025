module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScriptでチェックされる項目をLintから除外する設定
    'plugin:@next/next/recommended',
    'prettier', // prettierのextendsは他のextendsより後に記述する
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'eslint-plugin-unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json', // TypeScriptのLint時に参照するconfigファイルを指定
  },
  root: true, // 上位ディレクトリにある他のeslintrcを参照しないようにする
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    "no-unsafe-optional-chaining": 'off'
  },
}
