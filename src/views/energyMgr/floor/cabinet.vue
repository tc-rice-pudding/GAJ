<template>
	<!-- 异常能耗机柜 -->
	<div class="abnormal-cabinet-view">
		<section
			ref="tableContainerRef"
			style="height: 100%; overflow: hidden"
			v-loading="loading"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.2)"
		>
			<header ref="headerRef">
				<div class="query-item">
					<span>机房</span>
					<el-select
						v-model="queryInfo.floors"
						style="width: 140px"
						placeholder="请选择"
						clearable
						
						multiple
						collapse-tags
						collapse-tags-tooltip
					>
						<el-option
							v-for="item in optionMap.roomsOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</div>
				<div class="query-item">
					<span>机柜编号</span>
					<el-input type="text" style="width: 140px" v-model="queryInfo.deviceNum" />
				</div>
				<div class="query-item">
					<span>产生原因</span>
					<el-select
						v-model="queryInfo.reasons"
						style="width: 140px"
						placeholder="请选择"
						clearable
						
						multiple
						collapse-tags
						collapse-tags-tooltip
					>
						<el-option
							v-for="item in optionMap.reasonsOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</div>
				<div class="query-item">
					<span>上升/下降</span>
					<el-select v-model="queryInfo.sort" style="width: 140px" placeholder="请选择" clearable>
						<el-option key="上升" label="上升" value="asc" />
						<el-option key="下降" label="下降" value="desc" />
					</el-select>
				</div>
				<div class="query-item">
					<span>产生日期</span>
					<el-date-picker
						v-model="queryInfo.timeRange"
						type="daterange"
						style="width: 200px"
						range-separator="-"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						popper-class="custom-date-picker"
						value-format="YYYY-MM-DD"
					/>
				</div>

				<el-button type="primary" size="small" @click="onSearch">查询</el-button>
			</header>
			<el-table
				header-row-class-name="table-header"
				:height="tableHeight"
				:data="abnormalData"
				stripe
				style="width: 100%"
			>
				<el-table-column prop="deviceNum" label="机柜编号" show-overflow-tooltip min-width="90" align="left" />
				<el-table-column prop="name" label="机柜名称" show-overflow-tooltip min-width="90" align="left" />
				<el-table-column prop="room" label="机房位置" show-overflow-tooltip min-width="90" align="left" />
				<el-table-column prop="avgValue" label="平均功率 W" show-overflow-tooltip min-width="90" align="center">
					<template v-slot="{ row }">
						<span style="color: #2bbdf7">{{ row.avgValue }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="value" label="当前功率 W" show-overflow-tooltip min-width="90" align="center">
					<template v-slot="{ row }">
						<span style="color: #2bbdf7">{{ row.value }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="volatility" label="波动率 %" show-overflow-tooltip min-width="90" align="center">
					<template v-slot="{ row }">
						<span style="color: #d80000" v-if="(row.volatility || '').includes('上升')">{{
							row.volatility
						}}</span>
						<span style="color: #2aca6e" v-else>{{ row.volatility }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="reason" label="波动原因" show-overflow-tooltip min-width="90" align="left" />
				<el-table-column prop="time" label="产生日期" show-overflow-tooltip min-width="90" align="left" />
			</el-table>
			<el-pagination
				class="pagenation"
				:current-page="currentPage"
				:page-size="pageSize"
				:page-sizes="[10, 30, 50, 100]"
				small="small"
				layout="sizes, prev, pager, next"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</section>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

export const useOptions = () => {
	const route = useRoute();
	const optionMap = reactive({
		roomsOptions: [],
		reasonsOptions: [],
	});

	const getOption1 = async () => {
		try {
			const res = await axios.get(`/dcim/custom/energy/get/room?resourceId=${route.query.floorId || ''}`);
			if (res.status === 200) {
				optionMap.roomsOptions = res.data || [];
			}
		} catch (error) {
			console.log(error);
			optionMap.roomsOptions = [
				{ label: '1', value: '1' },
				{ label: '2', value: '2' },
				{ label: '3', value: '3' },
			];
		}
	};
	const getOption2 = async () => {
		try {
			const res = await axios.get(`/dcim/custom/energy/get/reason?resourceId=${route.query.floorId || ''}`);
			if (res.status === 200) {
				optionMap.reasonsOptions = res.data || [];
			}
		} catch (error) {
			console.log(error);
			optionMap.reasonsOptions = [
				{ label: '1', value: '1' },
				{ label: '2', value: '2' },
				{ label: '3', value: '3' },
			];
		}
	};
	getOption1();
	getOption2();

	return { optionMap };
};

export default defineComponent({
	name: 'cabinet',
	components: {},
	setup() {
		const route = useRoute();
		const floorInfo = computed(() => ({
			floorId: route.query.floorId,
			floorName: route.query.floorName,
		}));
		const queryInfo = reactive({
			deviceNum: '',
			floors: [],
			sort: '',
			timeRange: [],
			reasons: [],
		});

		const abnormalData = ref([
			// FIX
			{ volatility: '-10%' },
			{ volatility: '10%' },
			{ volatility: '50%' },
			{ volatility: '-50%' },
			{ volatility: '-20%' },
		]);
		const pageInfo = reactive({
			currentPage: 1,
			pageSize: 10,
			total: 0,
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

		const getAbnormalInfo = async () => {
			try {
				const [start, end] = queryInfo.timeRange || [];
				const {
					data: { total, rows },
				} = await axios.post('/dcim/custom/energy/abnormal/list', {
					resoureId: floorInfo.floorId || '',
					page: {
						number: pageInfo.currentPage,
						size: pageInfo.pageSize,
					},
					deviceNum: queryInfo.deviceNum,
					floors: queryInfo.floors,
					sort: queryInfo.sort,
					reasons: queryInfo.reasons,
					startTime: start || '',
					endTime: end || '',
				});
				pageInfo.total = total;
				abnormalData.value = rows || [];
			} catch (error) {
				console.log(error);
			}
		};
		getAbnormalInfo();

		let tableContainerRef = ref(null);
		let headerRef = ref(null);
		let tableHeight = ref(500);

		const onSearch = () => {
			getAbnormalInfo();
		};
		const handleSizeChange = (size) => {
			pageInfo.pageSize = size;
			onSearch();
		};
		const handleCurrentChange = (inx) => {
			pageInfo.currentPage = inx;
			onSearch();
		};

		onMounted(() => {
			setTimeout(() => {
				if (tableContainerRef.value) {
					const containerH = tableContainerRef.value.clientHeight - 54 - headerRef.value.clientHeight; // 减去分页的高度
					tableHeight.value = `${containerH}`;
				}
			}, 100);
		});

		return {
			queryInfo,
			...toRefs(pageInfo),
			...toRefs(loadingInfo),
			...toRefs(useOptions()),
			tableContainerRef,
			headerRef,
			tableHeight,
			handleSizeChange,
			handleCurrentChange,
			onSearch,
			abnormalData,
		};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.abnormal-cabinet-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	padding: 5px 14px 0;

	> header {
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #c5dff9;
		padding: 10px;
		.query-item {
			margin-right: 20px;
			> span {
				font-size: 16px;
				vertical-align: middle;
				display: inline-block;
				margin-right: 5px;
			}
		}
		.btn {
			width: 80px;
			background: #0576bf;
			border-radius: 4px;
			color: #c5dff9;
			line-height: 30px;
		}
	}

	> section {
		overflow: hidden;
		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}

		> header {
			height: 40px;
			display: flex;
			flex-direction: row;
			align-items: center;
			color: #c5dff9;
			padding: 10px;
			.query-item {
				margin-right: 20px;
				display: flex;
				align-items: center;
				> span {
					font-size: 16px;
					margin-right: 5px;
					width: 75px;
				}
			}
			.btn {
				width: 80px;
				background: #0576bf;
				border-radius: 4px;
				color: #c5dff9;
				line-height: 30px;
			}
		}
	}
}
</style>
