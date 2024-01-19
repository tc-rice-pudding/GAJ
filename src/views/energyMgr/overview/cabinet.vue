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
			<el-table
				header-row-class-name="table-header"
				:height="tableHeight"
				:data="abnormalData"
				stripe
				style="width: 100%"
			>
				<el-table-column prop="deviceNum" label="机柜编号" show-overflow-tooltip min-width="90" align="left" />
				<el-table-column prop="name" label="机柜名称" show-overflow-tooltip min-width="90" align="left" />
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
						<span style="color: #d80000" v-if="(row.volatility || '').includes('-')">{{
							row.volatility
						}}</span>
						<span style="color: #2aca6e" v-else>{{ row.volatility }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="userName" label="波动原因" show-overflow-tooltip min-width="90" align="left" />
				<el-table-column prop="userName" label="产生日期" show-overflow-tooltip min-width="90" align="left" />
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

export default defineComponent({
	name: 'cabinet',
	components: {},
	setup() {
		const yesterday = ref(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
		const route = useRoute();
		const floorInfo = computed(() => ({
			floorId: route.query.floorId,
			floorName: route.query.floorName,
		}));

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
				const { data: { total, rows } } = await axios.post('/dcim/custom/energy/abnormal/list', {
					page: {
						number: pageInfo.currentPage,
						size: pageInfo.pageSize,
					},
				});
				pageInfo.total = total;
				abnormalData.value = rows || [];
			} catch (error) {
				console.log(error);
			}
		};
		getAbnormalInfo();

		let tableContainerRef = ref(null);
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
					const containerH = tableContainerRef.value.clientHeight - 54; // 减去分页的高度
					tableHeight.value = `${containerH}`;
				}
			}, 100);
		});

		return {
			yesterday,
			...toRefs(pageInfo),
			...toRefs(loadingInfo),
			tableContainerRef,
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
	padding: 10px;

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
	}
}
</style>
