<template>
	<container-warp>
		<template #title> {{ name }} </template>
		<template #body>
			<div class="cabinet-info-view">
				<!-- todo -->
				<section class="left"></section>
				<section class="right"></section>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'CabinetDetail',
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

.cabinet-info-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	display: flex;
	.left {
		width: 150px;
	}
	.right {
		flex: 1;
	}
}
</style>
