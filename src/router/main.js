import {
    createRouter,
    createWebHashHistory
} from 'vue-router';
import NProgress from 'nprogress';

export const routes = [{
        path: '/',
        redirect: '/homeView',
    },
    {
        path: '/menu',
        component: () => import( /* webpackChunkName: 'Menu' */ '/src/views/Menu.vue'),
    },
    {
        path: '/homeView',
        label: '资产管理(旧)',
        type: 1,
        component: () => import( /* webpackChunkName: 'HomeView' */ '/src/views/homeView/HomeView.vue'),
    },
    {
        path: '/systemMgr',
        label: '资产管理(新)',
        type: 1,
        component: () => import( /* webpackChunkName: 'SystemMgr' */ '/src/views/systemMgr/SystemMgr.vue'),
    },
    {
        path: '/usingUnit',
        label: '资产管理：使用单位查询',
        type: 2,
        component: () => import( /* webpackChunkName: 'UsingUnit' */ '/src/views/assetMgr/UsingUnit.vue'),
    },
    {
        path: '/floorUsingUnit',
        label: '资产管理：使用单位查询（楼层）',
        type: 2,
        component: () => import( /* webpackChunkName: 'UsingUnit' */ '/src/views/assetMgr/floorUsingUnit.vue'),
    },
    {
        path: '/roomUsingUnit',
        label: '资产管理：机房使用单位',
        type: 2,
        component: () => import( /* webpackChunkName: 'UsingUnit' */ '/src/views/assetMgr/RoomUsingUnit.vue'),
    },
    {
        path: '/cabinetInfo',
        label: '资产管理：机柜信息',
        type: 2,
        component: () => import( /* webpackChunkName: 'CabinetInfo' */ '/src/views/assetMgr/cabinetInfo.vue'),
    },
    {
        path: '/vmStatistics',
        label: '资产管理：虚拟机统计',
        type: 2,
        component: () => import( /* webpackChunkName: 'UsingUnit' */ '/src/views/assetMgr/vmStatistics.vue'),
    },
    {
        path: '/capacityMgr/cabinetUsage',
        label: '容量：各层机柜使用量',
        type: 3,
        component: () => import( /* webpackChunkName: 'CabinetUsage' */ '/src/views/capacityMgr/CabinetUsage.vue'),
    },
    {
        path: '/capacityMgr/RoomCapacityView/:id',
        label: '容量：机房容量视图',
        type: 3,
        component: () => import( /* webpackChunkName: 'RoomCapacityView' */ '/src/views/capacityMgr/RoomCapacityView.vue'),
    },
    {
        path: '/energyMgr/floorEnergy',
        label: '各楼层能耗',
        type: 4,
        component: () => import( /* webpackChunkName: 'FloorEnergy' */ '/src/views/energyMgr/floor/index.vue'),
    },
    {
        path: '/energyMgr/overview/unit',
        label: '能耗总览：使用单位能耗',
        type: 4,
        component: () => import( /* webpackChunkName: 'unitEnergy' */ '/src/views/energyMgr/overview/unit.vue'),
    },
    {
        path: '/energyMgr/overview/system',
        label: '能耗总览：使用系统能耗',
        type: 4,
        component: () => import( /* webpackChunkName: 'systemEnergy' */ '/src/views/energyMgr/overview/system.vue'),
    },
    {
        path: '/energyMgr/overview/cabinet',
        label: '能耗总览：异常能耗机柜',
        type: 4,
        component: () => import( /* webpackChunkName: 'cabinetEnergy' */ '/src/views/energyMgr/overview/cabinet.vue'),
    },
    {
        path: '/abnormalEnergyCabinet',
        label: '能耗管理：异常能耗机柜',
        type: 4,
        component: () => import( /* webpackChunkName: 'abnormalEnergyCabinet' */ '/src/views/energyMgr/abnormalEnergyCabinet/index.vue'),
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