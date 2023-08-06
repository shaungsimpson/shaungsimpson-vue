import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Articles from '@/views/Articles.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/articles', name: 'Articles', component: Articles },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
