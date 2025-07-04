import { sxzz } from '@sxzz/eslint-config'

export default sxzz({
  unocss: false,
  vue: true,
  pnpm: true,
})
  .removeRules('unicorn/filename-case')
  .append([
    {
      rules: {
        'no-duplicate-imports': [
          'off',
          {
            includeExports: true,
          },
        ],
      },
    },
  ])
