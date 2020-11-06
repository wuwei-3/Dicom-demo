/*
 * @Description:
 * @Version: 2.0
 * @Autor: wuwei3
 * @Date: 2020-03-10 14:50:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-10 10:09:55
 */
module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'rule-empty-line-before': 'never',
    'string-quotes': 'single',
    indentation: 2,
    'selector-pseudo-element-colon-notation': 'single',
    'color-named': 'always-where-possible',
    'function-blacklist': ['/^rgb/', '/^hsl/', 'gray'],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'else',
          'for',
          'each',
          'while',
          'mixin',
          'include',
          'content',
          'return',
          'function',
        ],
      },
    ],
  },
};
