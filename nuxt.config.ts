// https://nuxt.com/docs/api/configuration/nuxt-config
const siteTitle = 'Condo Cebu - Diane Residences'

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  compatibilityDate: "2025-02-28",
  devServer: {
    host: process.env.VITE_SYSTEM_DOMAIN, // Replace with your desired IP address
    port: process.env.VITE_PORT,         // Replace with your desired port
  },
   app: {
    baseURL: process.env.VITE_BASE, // remove if local setup
    head: {
      title: siteTitle, // App window nav title
      
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#121212' },
        { name: 'description', content: 'Discover modern living at Diane Residences. We offer beautifully designed spaces that enhance community and comfort in a vibrant environment.' },
        { name: 'keywords', content: 'Diane Residences, luxury condominiums, real estate, property development, apartments, community living, Cebu' },
        { name: 'author', content: 'Diane Properties Corporation' },
        { property: 'og:title', content: 'Diane Residences - Luxury Living in Cebu' },
        { property: 'og:description', content: 'Explore Diane Residences for exquisite condominiums that blend style, comfort, and a sense of community.' },
        { property: 'og:image', content: '/images/diane_logo.jpg' },
        { property: 'og:url', content: 'https://www.dianeresidences.com' },
        // ...
    ],
    
      link: [
        // { rel: 'manifest', href: 'pwa/manifest.json' },
        // { rel: 'apple-touch-icon', href: 'pwa/icons/apple-touch-icon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Helvetica:wght@300;400;500;600;700&display=swap'
        }
      ],
    },
    
    pageTransition: { name: 'page', mode: 'out-in' },

    layoutTransition: { name: 'layout', mode: 'out-in' },

  },
  
})