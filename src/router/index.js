import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Articles from '@/views/Articles.vue'
import Post from '@/views/Post.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/articles', name: 'Articles', component: Articles },
    { path: '/articles/:slug', name: 'Post Layout', component: Post, props: true },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
