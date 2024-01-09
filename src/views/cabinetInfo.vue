<template>
	<container-warp>
		<template #title> 虚拟机统计 </template>
		<template #body>
			<div class="cabinet-info-view">
				<!-- todo -->
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'cabinetInfo',
	components: {},
	setup() {
		return {};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.cabinet-info-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
}
</style>
