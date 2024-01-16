<template>
	<container-warp>
		<template #title> 虚拟机统计 </template>
		<template #body>
			<div class="vm-statistic-view">
				<header>
					<div class="query-item">
						<span>使用单位</span>
						<el-select v-model="queryInfo.userName" placeholder="请选择" clearable filterable>
							<el-option
								v-for="item in optionMap.userNameOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</div>
					<div class="query-item">
						<span>机房</span>
						<el-select v-model="queryInfo.systemName" placeholder="请选择" clearable filterable>
							<el-option
								v-for="item in optionMap.systemNameOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</div>
					<div class="query-item">
						<span>虚拟名称</span>
						<el-input v-model="queryInfo.vmName" style="width: 190px" clearable />
					</div>
					<div class="query-item">
						<span>序列号</span>
						<el-input v-model="queryInfo.vmNumber" style="width: 190px" clearable />
					</div>
					<el-button class="btn" type="primary" @click="onSearch">查询</el-button>
					<el-button class="btn" type="primary" @click="onExport">导出</el-button>
				</header>
				<section
					ref="tableContainerRef"
					style="height: calc(100% - 60px); overflow: hidden"
					v-loading="loading"
					element-loading-text="Loading..."
					:element-loading-spinner="svg"
					element-loading-svg-view-box="-10, -10, 50, 50"
					element-loading-background="rgba(122, 122, 122, 0.2)"
				>
					<el-table
						header-row-class-name="table-header"
						:height="tableHeight"
						:data="resInfo.tableData"
						stripe
						style="width: 100%"
						border
					>
						<el-table-column type="index" width="80" label="序号" align="center" />
						<el-table-column
							prop="userName"
							label="序列号"
							show-overflow-tooltip
							min-width="90"
							align="left"
						/>
						<el-table-column
							prop="systemName"
							label="机房编号"
							show-overflow-tooltip
							min-width="90"
							align="left"
						/>
						<el-table-column prop="location" label="机柜编号" show-overflow-tooltip align="left" />
						<el-table-column
							prop="cabinetCount"
							label="使用单位"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="deviceCount"
							label="部署系统"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="deviceCount"
							label="平均功率 W"
							show-overflow-tooltip
							min-width="90"
							align="center"
						>
							<template v-slot="{ row }">
								<span style="color: #2BBDF7">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="deviceCount"
							label="当前功率 W"
							show-overflow-tooltip
							min-width="90"
							align="center"
						>
							<template v-slot="{ row }">
								<span style="color: #FFCD75">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="deviceCount"
							label="波动率 %"
							show-overflow-tooltip
							min-width="90"
							align="center"
						>
							<template v-slot="{ row }">
								<span style="color: #2ACA6E">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
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
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'vmStatistics',
	components: {},
	setup() {
		const queryInfo = reactive({
			userName: '',
			systemName: '',
			vmName: '',
			vmNumber: '',
		});
		const optionMap = reactive({
			userNameOptions: [],
			systemNameOptions: [],
		});

		const resInfo = reactive({
			tableData: [],
			systemNum: 0,
			rackNum: 0,
			deviceNum: 0,
		});
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

		let tableContainerRef = ref(null);
		let tableHeight = ref(500);

		const handleSizeChange = (size) => {
			pageInfo.pageSize = size;
			// todo：分页
		};
		const handleCurrentChange = (inx) => {
			pageInfo.currentPage = inx;
			// todo：分页
		};

		const onSearch = () => {
			// todo：查询
		};

		const onExport = () => {
			// todo：查询
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
			queryInfo,
			...toRefs(pageInfo),
			...toRefs(loadingInfo),
			optionMap,
			resInfo,
			tableContainerRef,
			tableHeight,
			handleSizeChange,
			handleCurrentChange,
			onSearch,
			onExport,
		};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.vm-statistic-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;

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
