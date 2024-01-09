import { onMounted, onUnmounted } from 'vue';

export const resizeWindow = (cb) => {
    onMounted(() => {
        window.onresize = () => {
            typeof cb === 'function' && cb();
        };
    });

    onUnmounted(() => {
        window.onresize = null;
    });
};