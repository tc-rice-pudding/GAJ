<template>
	<!-- 整体能耗 -->
	<div>整体能耗</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'whole',
	components: {},
	setup() {
		return {};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

// .energy-overview-view {
// 	width: 100%;
// 	height: 100%;
// 	box-sizing: border-box;
// 	color: #c5dff9;
// }
</style>
