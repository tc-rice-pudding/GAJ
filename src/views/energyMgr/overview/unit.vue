<template>
	<!-- 使用单位能耗 -->
	<div
		class="unit-view"
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
			v-model="unitCheckd"
			multiple
			:multiple-limit="10"
			collapse-tags
			collapse-tags-tooltip
			
			clearable
			size="small"
			style="width: 240px; position: absolute; right: 42px; z-index: 1000"
		>
			<el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
		</el-select>

		<!-- 折线图 -->
		<Chart-Line :h="300" :options="lineOptions" />

		<!-- 表格 -->
		<section ref="tableContainerRef" style="height: calc(100% - 300px); overflow: hidden">
			<el-table header-row-class-name="table-header" :data="tableData" stripe style="height: 100%; width: 100%">
				<el-table-column prop="userName" label="使用单位" show-overflow-tooltip min-width="90" align="center" />
				<el-table-column
					v-for="col in tableColumn"
					:key="col"
					:prop="col"
					:label="col"
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

export const useTableAndLine = (unitList) => {
	const tableColumn = computed(() => {
		return ((unitList.value[0] || {})?.monthPowerValueList || []).map((it) => it.month);
	});

	const tableData = computed(() => {
		return unitList.value.map((it) => {
			const tmpObj = {};
			tmpObj.userName = it.userName;
			it.monthPowerValueList.reduce((map, curr) => {
				map[curr.month] = curr.value;
				return map;
			}, tmpObj);
			return tmpObj;
		});
	});

	let lineOptions = computed(() => {
		let defaultOps = deepClone(lineOpsDefault);
		defaultOps.title.text = '各单位月度能耗';
		defaultOps.xAxis.data = tableColumn.value;
		defaultOps.legend.data = unitList.value.map((it) => it.userName) || [];
		defaultOps.grid.bottom = '18%';
		defaultOps.dataZoom = [
			{
				type: 'slider',
				xAxisIndex: 0,
				filterMode: 'none',
			},
		];
		defaultOps.series = unitList.value.map((it) => {
			return {
				name: it.userName,
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
	name: 'unit',
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

		const unitOptions = ref([
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
		const unitCheckd = ref([]);
		const unitList = ref([
			// fix
			{
				userName: '单位1',
				monthPowerValueList: [
					{
						userName: '单位1',
						month: '2023-01',
						value: '140',
					},
					{
						userName: '单位1',
						month: '2023-02',
						value: '10',
					},
					{
						userName: '单位1',
						month: '2023-03',
						value: '200',
					},
					{
						userName: '单位1',
						month: '2023-04',
						value: '110',
					},
				],
			},
			{
				userName: '单位2',
				monthPowerValueList: [
					{
						userName: '单位2',
						month: '2023-01',
						value: '10',
					},
					{
						userName: '单位2',
						month: '2023-02',
						value: '100',
					},
					{
						userName: '单位2',
						month: '2023-03',
						value: '400',
					},
					{
						userName: '单位2',
						month: '2023-04',
						value: '120',
					},
				],
			},
		]);

		// 获取使用单位（机柜维度）
		const getUnitOptions = async () => {
			try {
				const res = await axios.get('/dcim/custom/cabinet/userName?resourceId=');
				unitCheckd.value = (res.data || []).slice(0, 11); // 默认选中前 10 个
				unitOptions.value = (res.data || []).map((it) => ({ label: it, value: it }));
			} catch (error) {
				console.log(error);
			}
		};
		getUnitOptions();

		const getUnitInfo = async () => {
			try {
				loadingInfo.loading = true;
				const { data: res } = await axios.post(`/dcim/custom/energy/userName/list`, {
					userNameList: unitCheckd.value || [],
					type: cycle.value || '',
				});
				unitList.value = res;
				loadingInfo.loading = false;
			} catch (error) {
				console.log(error);
				loadingInfo.loading = false;
			}
		};

		watch([cycle, unitCheckd], (query) => {
			const [cycleVal, unitCheckdVal] = query;
			if (cycleVal && unitCheckdVal.length) {
				getUnitInfo();
			}
		});

		return {
			unitOptions,
			cycle,
			unitCheckd,
			...toRefs(loadingInfo),
			...toRefs(useTableAndLine(unitList)),
		};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.unit-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	position: relative;
	padding: 10px;

	> section {
		overflow: hidden;
	}
}
</style>
