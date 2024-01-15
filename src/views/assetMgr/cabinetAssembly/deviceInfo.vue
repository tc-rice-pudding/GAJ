<template>
	<container-warp>
		<template #title> 设备主要信息 </template>
		<template #body>
			<div
				class="device-info-view"
				v-loading="loading"
				element-loading-text="Loading..."
				:element-loading-spinner="svg"
				element-loading-svg-view-box="-10, -10, 50, 50"
				element-loading-background="rgba(122, 122, 122, 0.8)"
			>
				<el-table
					header-row-class-name="table-header"
					:data="deviceList"
					stripe
					style="width: 100%; height: 100%"
				>
					<el-table-column type="index" width="60" label="序号" />
					<el-table-column
						prop="deviceType"
						label="设备类型"
						min-width="80"
						show-overflow-tooltip
						align="center"
					/>
					<el-table-column prop="brand" label="品牌" min-width="60" show-overflow-tooltip align="center" />
					<el-table-column
						prop="startU"
						label="起始U位"
						min-width="80"
						show-overflow-tooltip
						align="center"
					/>
					<el-table-column
						prop="power"
						label="额定功率"
						min-width="80"
						show-overflow-tooltip
						align="center"
					/>
					<el-table-column
						prop="electricSocket"
						min-width="100"
						label="电源接口数"
						show-overflow-tooltip
						align="center"
					/>
				</el-table>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'DeviceInfo',
	setup() {
		const route = useRoute();

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

		const deviceList = ref([]);
		const tableHandler = async () => {
			try {
				loadingInfo.loading = true;
				const list = await axios.get(`/dcim/custom/cabinet/list?resourceId=${route.query.cabinetRid}`);
				deviceList.value = list;
			} catch (error) {
				console.log(error);
			} finally {
				loadingInfo.loading = false;
			}
		};
		tableHandler();

		return { ...toRefs(loadingInfo), deviceList };
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.device-info-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	padding: 5px;
}
</style>
