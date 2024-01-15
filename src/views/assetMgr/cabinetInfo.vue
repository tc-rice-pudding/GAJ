<template>
	<div class="cabinet-info-view">
		<section
			class="left"
			v-loading="loading"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.8)"
		>
			<resStatis :info="resInfo"></resStatis>
		</section>
		<section class="center">
			<cabinetDetail :name="cabinetName" :cabinetInfo="resInfo"></cabinetDetail>
		</section>
		<section class="right">
			<DeviceDetail></DeviceDetail>
		</section>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import ResStatis from './cabinetAssembly/resStatis.vue';
import CabinetDetail from './cabinetAssembly/cabinetDetail.vue';
import DeviceDetail from './cabinetAssembly/deviceDetail.vue';

export default defineComponent({
	name: 'cabinetInfo',
	components: { ResStatis, CabinetDetail, DeviceDetail },
	setup() {
		const route = useRoute();
		const cabinetName = computed(() => route.query.name);

		const loadingInfo = reactive({
			loading: ref(false),
			svg: `
				<path class="path" d="
				M 30 15
				L 28 17
				M 25.61 25.61
				A 15 15, 0, 0, 1, 15 30
				A 15 15, 0, 1, 1, 27.99 7.5
				L 15 15
				" style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
			`,
		});

		const resInfo = reactive({});
		const getResInfo = async () => {
			try {
				loadingInfo.loading = true;
				const res = await axios.get(`/dcim/custom/cabinet/info?resourceId=${route.query.cabinetRid}`);
				Object.assign(resInfo, res);
			} catch (error) {
				console.log(error);
			} finally {
				loadingInfo.loading = false;
			}
		};
		getResInfo();

		return { cabinetName, loadingInfo, resInfo };
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
	flex-wrap: nowrap;
	.left {
		flex: 1;
		min-width: 400px;
	}
	.center {
		flex: 2;
		min-width: 600px;
	}
	.right {
		flex: 1;
		min-width: 400px;
	}
}
</style>
