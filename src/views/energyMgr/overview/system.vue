<template>
	<!-- 使用系统能耗 -->
	<div
		class="system-view"
		v-loading="loading"
		element-loading-text="Loading..."
		:element-loading-spinner="svg"
		element-loading-svg-view-box="-10, -10, 50, 50"
		element-loading-background="rgba(122, 122, 122, 0.2)"
	>
		<el-select
			v-model="cycle"
			
			size="small"
			style="width: 120px; position: absolute; right: 300px; z-index: 1000"
		>
			<el-option key="month" label="月" value="month" />
			<el-option key="day" label="天" value="day" />
		</el-select>
		<el-select
			v-model="systemCheckd"
			multiple
			:multiple-limit="10"
			collapse-tags
			collapse-tags-tooltip
			
			clearable
			placeholder="请选择系统"
			size="small"
			style="width: 240px; position: absolute; right: 42px; z-index: 1000"
		>
			<el-option v-for="item in systemOptions" :key="item.value" :label="item.label" :value="item.value" />
		</el-select>

		<!-- 折线图 -->
		<Chart-Line :h="300" :options="lineOptions" />

		<!-- 表格 -->
		<section ref="tableContainerRef" style="height: calc(100% - 300px); overflow: hidden">
			<el-table header-row-class-name="table-header" :data="tableData" stripe style="height: 100%; width: 100%">
				<el-table-column
					prop="systemName"
					label="系统名称"
					show-overflow-tooltip
					min-width="90"
					align="center"
				/>
				<el-table-column prop="userName" label="使用单位" show-overflow-tooltip min-width="90" align="center" />
				<el-table-column
					v-for="col in tableColumn"
					:key="col"
					:prop="col"
					:label="`${col} (kW)`"
					show-overflow-tooltip
					align="center"
				>
					<template v-slot="{ row }">
						<span style="color: #2bbdf7">{{ row[col] }}</span>
					</template>
				</el-table-column>
			</el-table>
		</section>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import ChartLine from '@/components/Chart-Line.vue';
import { lineOpsDefault } from '../options';
import { deepClone } from '@/utils';

export const useTableAndLine = (systemList) => {
	const tableColumn = computed(() => {
		return ((systemList.value[0] || {})?.monthPowerValueList || []).map((it) => it.month);
	});

	const tableData = computed(() => {
		return systemList.value.map((it) => {
			const tmpObj = {};
			tmpObj.userName = it.userName;
			tmpObj.systemName = it.systemName;
			it.monthPowerValueList.reduce((map, curr) => {
				map[curr.month] = curr.value;
				return map;
			}, tmpObj);
			return tmpObj;
		});
	});

	let lineOptions = computed(() => {
		let defaultOps = deepClone(lineOpsDefault);
		defaultOps.title.text = '各系统月度能耗（kW）';
		defaultOps.xAxis.data = tableColumn.value;
		defaultOps.legend.data = systemList.value.map((it) => it.systemName) || [];
		defaultOps.grid.bottom = '18%';
		defaultOps.dataZoom = [
			{
				type: 'slider',
				xAxisIndex: 0,
				filterMode: 'none',
			},
		];
		defaultOps.series = systemList.value.map((it) => {
			return {
				name: it.systemName,
				type: 'line',
				areaStyle: {
					opacity: 0.2,
				},
				symbol: 'emptyCircle',
				symbolSize: 6,
				data: it.monthPowerValueList.map((it) => it.value) || [],
			};
		});

		return defaultOps;
	});

	return { tableColumn, tableData, lineOptions };
};

export default defineComponent({
	name: 'system',
	components: { ChartLine },
	setup() {
		const route = useRoute();
		const floorInfo = computed(() => ({
			floorId: route.query.floorId,
			floorName: route.query.floorName,
		}));

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

		const systemOptions = ref([
			// fix:
			{ label: '1', value: '11' },
			{ label: '2', value: '12' },
			{ label: '3', value: '13' },
			{ label: '4', value: '14' },
			{ label: '5', value: '15' },
			{ label: '6', value: '16' },
			{ label: '7', value: '17' },
			{ label: '8', value: '18' },
			{ label: '9', value: '19' },
			{ label: '10', value: '20' },
			{ label: '11', value: '21' },
			{ label: '12', value: '22' },
		]);
		const cycle = ref('month');
		const systemCheckd = ref([]);
		const systemList = ref([
			// fix
			{
				userName: '单位1',
				systemName: '系统1',
				monthPowerValueList: [
					{
						userName: '单位1',
						systemName: '系统1',
						month: '2023-01',
						value: '140',
					},
					{
						userName: '单位1',
						systemName: '系统1',
						month: '2023-02',
						value: '10',
					},
					{
						userName: '单位1',
						systemName: '系统1',
						month: '2023-03',
						value: '200',
					},
					{
						userName: '单位1',
						systemName: '系统1',
						month: '2023-04',
						value: '110',
					},
				],
			},
			{
				userName: '单位2',
				systemName: '系统2',
				monthPowerValueList: [
					{
						userName: '单位2',
						systemName: '系统2',
						month: '2023-01',
						value: '10',
					},
					{
						userName: '单位2',
						systemName: '系统2',
						month: '2023-02',
						value: '100',
					},
					{
						userName: '单位2',
						systemName: '系统2',
						month: '2023-03',
						value: '400',
					},
					{
						userName: '单位2',
						systemName: '系统2',
						month: '2023-04',
						value: '120',
					},
				],
			},
		]);

		// 获取使用系统
		const getSystemOptions = async () => {
			try {
				const res = await axios.get('/dcim/space/getBusinessSystem?key=');
				if (res.data.status === 200) {
					systemCheckd.value = (res.data.result || []).slice(0, 11); // 默认选中前 10 个
					systemOptions.value = (res.data.result || []).map((it) => ({ label: it, value: it }));
				}
			} catch (error) {
				console.log(error);
			}
		};
		getSystemOptions();

		const getSystemInfo = async () => {
			try {
				loadingInfo.loading = true;
				const { data: res } = await axios.post(`/dcim/custom/energy/system/list`, {
					systemNameList: systemCheckd.value || [],
					type: cycle.value || '',
				});
				systemList.value = res;
				loadingInfo.loading = false;
			} catch (error) {
				console.log(error);
				loadingInfo.loading = false;
			}
		};

		watch([cycle, systemCheckd], (query) => {
			const [cycleVal, systemCheckdVal] = query;
			if (cycleVal && systemCheckdVal.length) {
				getSystemInfo();
			}
		});

		return {
			systemOptions,
			cycle,
			systemCheckd,
			...toRefs(loadingInfo),
			...toRefs(useTableAndLine(systemList)),
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
	padding: 10px;

	> section {
		overflow: hidden;
	}
}
</style>
