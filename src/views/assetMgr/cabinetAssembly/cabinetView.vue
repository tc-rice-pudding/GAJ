<template>
	<container-warp>
		<template #title> {{ name }} </template>
		<template #body>
			<div class="cabinet-view">
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
	name: 'CabinetView',
	props: {
		name: String,
	},
	components: {},
	setup() {
		return {};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.cabinet-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
}
</style>
