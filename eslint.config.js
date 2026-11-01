import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules', 'dist', '.slidev'] },
  ...tseslint.configs.recommended,
  // Prettier owns formatting; this only forces braces on every if/else/loop
  { rules: { curly: ['error', 'all'] } },
)
