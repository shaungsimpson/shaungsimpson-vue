import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/devtools',
  ],

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['js', 'jsx', 'json', 'ts', 'tsx', 'vue', 'css', 'html', 'bash', 'md', 'mdc', 'yaml', 'php'],
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  devtools: {
    enabled: true,
  },

  site: {
    name: 'Shaun Simpson',
    url: 'https://shaungsimpson.com',
    description: 'Portfolio and articles from Shaun Simpson, a software engineer based in Sydney, Australia.',
    defaultLocale: 'en-AU',
  },

  sitemap: {
    zeroRuntime: true,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  typescript: {
    strict: true,
  },
})