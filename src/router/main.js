import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';

const routes = [
    {
        path: '/',
        redirect: '/homeView',
    },
    {
        path: '/homeView',
        label: '资产管理(旧)',
        component: () => import(/* webpackChunkName: 'HomeView' */ '/src/views/HomeView.vue'),
    },
    {
        path: '/systemMgr',
        label: '资产管理(新)',
        component: () => import(/* webpackChunkName: 'SystemMgr' */ '/src/views/SystemMgr.vue'),
    },
    {
        path: '/usingUnit',
        label: '使用单位查询',
        component: () => import(/* webpackChunkName: 'UsingUnit' */ '/src/views/UsingUnit.vue'),
    },
    {
        path: '/roomView',
        label: '机房视图',
        component: () => import(/* webpackChunkName: 'RoomView' */ '/src/views/RoomView.vue'),
    },
    {
        path: '/cabinetInfo',
        label: '机柜信息',
        component: () => import(/* webpackChunkName: 'CabinetInfo' */ '/src/views/cabinetInfo.vue'),
    },
    {
        path: '/energyOverview',
        label: '能耗总览',
        component: () => import(/* webpackChunkName: 'EnergyOverview' */ '/src/views/energyOverview.vue'),
    },
    {
    path: '/cabinetUsage',
        label: '各层机柜使用量',
        component: () => import(/* webpackChunkName: 'CabinetUsage' */ '/src/views/CabinetUsage.vue'),
    },
    {
        path: '/vmStatistics',
        label: '虚拟机统计',
        component: () => import(/* webpackChunkName: 'UsingUnit' */ '/src/views/vmStatistics.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
});

router.afterEach((to, from) => {
    NProgress.done();
});

export default router;