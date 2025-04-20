/* eslint-disable no-undef */
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const nextPlugin = require('@next/eslint-plugin-next');
const unusedImports = require('eslint-plugin-unused-imports');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tailwindcss = require('eslint-plugin-tailwindcss');

module.exports = [
 eslint.configs.recommended,
 ...tseslint.configs.recommended,
 {
  files: ['**/*.{js,jsx,ts,tsx}'],
  ignores: ['**/prisma/generated/**/*'],
  languageOptions: {
   ecmaVersion: 'latest',
   sourceType: 'module',
   parser: tseslint.parser,
   parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
   },
   globals: {
    // nodeの環境変数
    process: 'readonly',
    __dirname: 'readonly',
    // ブラウザの環境変数
    window: 'readonly',
    document: 'readonly',
    navigator: 'readonly',
    // ES6の環境変数
    Promise: 'readonly',
    Map: 'readonly',
    Set: 'readonly',
   }
  },

  plugins: {
   '@typescript-eslint': tseslint.plugin,
   '@next/next': nextPlugin,
   'unused-imports': unusedImports,
   'react': reactPlugin,
   'react-hooks': reactHooksPlugin,
   'simple-import-sort': simpleImportSort,
   'tailwindcss': tailwindcss,
  },
  // 選択範囲の開始
  rules: {
   // 未使用のインポートを警告します
   'unused-imports/no-unused-imports': 'warn',
   // any型の明示的な使用を許可します
   '@typescript-eslint/no-explicit-any': 'off',
   // 未使用の変数を許可します
   'no-unused-vars': 'off',
   // TypeScriptで未使用の変数を許可します
   '@typescript-eslint/no-unused-vars': 'off',
   // オプショナルチェイニングの安全でない使用を許可します
   'no-unsafe-optional-chaining': 'off',
   // TypeScriptで未使用の式を許可します
   '@typescript-eslint/no-unused-expressions': 'off',
   // 空のオブジェクト型を許可します
   '@typescript-eslint/no-empty-object-type': 'off',
   // ラッパーオブジェクト型の使用を許可します
   '@typescript-eslint/no-wrapper-object-types': 'off',
   // requireインポートの使用を許可します
   '@typescript-eslint/no-require-imports': 'off',
   // 定数バイナリ式の使用を許可します
   'no-constant-binary-expression': 'off',
   // 空のインターフェースを許可します
   '@typescript-eslint/no-empty-interface': 'off',
   // 特定の型（any、Function、Object、{}）の使用を許可します
  },
  // 選択範囲の終了
  settings: {
   react: {
    version: 'detect',
   },
  },
 },
];
