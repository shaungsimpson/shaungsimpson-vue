import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Articles from '@/views/Articles.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/articles', name: 'Articles', component: Articles },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    // scrollBehavior(to, from, savedPosition) {
    //     if (savedPosition) {
    //         return savedPosition;
    //     }
    //     if (to.hash) {
    //         return { el: to.hash, behavior: 'smooth' };
    //     } else {
    //         window.scrollTo(0, 0);
    //     }
    // }
})

export default router
