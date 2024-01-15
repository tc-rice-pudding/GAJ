<template>
	<!-- 使用系统能耗 -->
	<div class="system-view">
		<!-- 折线图 -->
		<Chart-Line :h="300" :options="lineOptions" />

		<!-- 表格 -->
		<section
			ref="tableContainerRef"
			style="height: calc(100% - 300px); overflow: hidden"
			v-loading="loading"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.8)"
		>
			<el-table
				header-row-class-name="table-header"
				:data="resInfo.tableData"
				stripe
				style="height: 100%; width: 100%"
				border
			>
				<el-table-column prop="userName" label="系统名称" show-overflow-tooltip min-width="90" align="center" />
				<el-table-column
					prop="systemName"
					label="使用单位"
					show-overflow-tooltip
					min-width="90"
					align="center"
				/>
				<el-table-column prop="location" label="1月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="2月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="3月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="4月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="5月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="6月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="7月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="8月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="9月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="10月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="11月" show-overflow-tooltip align="center" />
				<el-table-column prop="location" label="12月" show-overflow-tooltip align="center" />
			</el-table>
		</section>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import ChartLine from '@/components/Chart-Line.vue';
import { lineOpsDefault } from './lineOptions';
import { deepClone } from '@/utils';

export default defineComponent({
	name: 'system',
	components: { ChartLine },
	setup() {
		const resInfo = reactive({
			tableData: [],
			systemNum: 0,
			rackNum: 0,
			deviceNum: 0,
		});
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

		let tableContainerRef = ref(null);

		let lineOptions = computed(() => {
			// todo
			let tmpOps = deepClone(lineOpsDefault);
			
			return tmpOps;
		});

		return {
			...toRefs(loadingInfo),
			resInfo,
			tableContainerRef,
			lineOptions,
		};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.system-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;

	> section {
		overflow: hidden;
	}
}
</style>
