/**
 * @author 成雨
 * @date 2022/3/5
 * @Description: https://router.vuejs.org/zh/guide/#javascript
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import Index from '../pages/index/index.vue';

const routes = [
    { path: '/', component: Index },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;
