<template>
	<div
		class="cabinet-info-view"
		v-loading="loading"
		element-loading-text="Loading..."
		:element-loading-spinner="svg"
		element-loading-svg-view-box="-10, -10, 50, 50"
		element-loading-background="rgba(122, 122, 122, 0.2)"
	>
		<section class="left">
			<resStatis :info="resInfo"></resStatis>
		</section>
		<section class="center">
			<cabinetDetail :name="cabinetName" :cabinetInfo="resInfo" :deviceMap="deviceMap"></cabinetDetail>
		</section>
		<section class="right">
			<DeviceDetail :tableData="deviceList"></DeviceDetail>
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
		const resInfo = reactive({});
		const deviceList = ref([
			// {
			// 	startU: 2,
			// 	uheight: 2,
			// },
			// {
			// 	startU: 6,
			// 	uheight: 3,
			// },
			// {
			// 	startU: 12,
			// 	uheight: 3,
			// },
		]);

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

		const getResInfo = async () => {
			try {
				const res = await axios.get(`/dcim/custom/cabinet/info?resourceId=${route.query.cabinetRid}`);
				res && Object.assign(resInfo, res);
			} catch (error) {
				console.log(error);
			}
		};

		const tableHandler = async () => {
			try {
				const list = await axios.get(`/dcim/custom/cabinet/list?resourceId=${route.query.cabinetRid}`);
				deviceList.value = list || [];
			} catch (error) {
				console.log(error);
			}
		};

		loadingInfo.loading = true;
		Promise.all([getResInfo(), tableHandler()])
			.then()
			.finally(() => {
				loadingInfo.loading = false;
			});

		const deviceMap = computed(() => {
			return (deviceList.value || []).reduce((map, curr) => {
				const key = curr.startU + curr.uheight - 1;
				map[key] = { uHeight: curr.uheight, ...curr };
				return map;
			}, {});
		});

		return { cabinetName, ...toRefs(loadingInfo), resInfo, deviceList, deviceMap };
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
