import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  name: 'project/ignores',
  ignores: ['src/**', 'dist/**'],
})