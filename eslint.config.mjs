import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
      "ignores": [
        "**/dist",
        "**/out-tsc",
        "**/vite.config.*.timestamp*",
        "**/vitest.config.*.timestamp*"
      ]
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:shell',
              onlyDependOnLibsWithTags: [
                'scope:finance',
                'scope:sales',
                'scope:medical',
                'scope:shared-ui',
                'scope:inventory',
                'scope:hr',
                'scope:supply-chain',
                'scope:settings',
              ],
            },
            {
              sourceTag: 'scope:showcase',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:finance',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:sales',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:inventory',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:hr',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:supply-chain',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:settings',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
            {
              sourceTag: 'scope:shared-ui',
              onlyDependOnLibsWithTags: ['scope:shared-ui'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
