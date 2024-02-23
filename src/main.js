import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import './css/common.css';
import router from '@/router/main';
// import "./mockjs/index";
import 'echarts/lib/component/dataZoom';

import ContainerWarp from '@/components/containerWarp.vue';
const app = createApp(App);

app.component('ContainerWarp', ContainerWarp);

app.use(ElementPlus, { locale: zhCn }).use(router).mount('#app');