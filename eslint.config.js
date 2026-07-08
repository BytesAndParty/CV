import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'node_modules/', '.fallow/', 'public/'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ...reactHooks.configs.flat['recommended-latest'],
    files: ['**/*.{ts,tsx}'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Astro islands are SSR-rendered; syncing localStorage/matchMedia into
      // state after mount is the intended hydration-safe pattern here.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ...jsxA11y.flatConfigs.recommended,
    files: ['**/*.tsx'],
  },
  {
    files: ['**/*.tsx'],
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
);
