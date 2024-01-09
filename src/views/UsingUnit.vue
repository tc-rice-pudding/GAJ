<template>
	<!-- 使用单位查询 -->
	<container-warp>
		<template #title> 使用单位查询 </template>
		<template #body>
			<div class="using-unit-query">
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
						<span>业务系统</span>
						<el-select v-model="queryInfo.systemName" placeholder="请选择" clearable filterable>
							<el-option
								v-for="item in optionMap.systemNameOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</div>
					<el-button class="btn" type="primary" size="small" @click="onSearch">查询</el-button>
				</header>
				<div class="device-count">
					<div class="item">
						<span class="subsystem-icon icon"></span>
						<span>系统</span>
						<span class="subsystem-font font">{{ resInfo.systemNum }}</span>
					</div>
					<div class="item">
						<span class="rack-icon icon"></span>
						<span>机柜</span>
						<span class="rack-font font">{{ resInfo.rackNum }}</span>
					</div>
					<div class="item">
						<span class="device-icon icon"></span>
						<span>设备</span>
						<span class="device-font font">{{ resInfo.deviceNum }}</span>
					</div>
				</div>
				<section
					ref="tableContainerRef"
					style="height: calc(100% - 180px); overflow: hidden"
					v-loading="loading"
					element-loading-text="Loading..."
					:element-loading-spinner="svg"
					element-loading-svg-view-box="-10, -10, 50, 50"
					element-loading-background="rgba(122, 122, 122, 0.8)"
				>
					<el-table
						header-row-class-name="table-header"
						:span-method="objectSpanMethod"
						:height="tableHeight"
						:data="resInfo.tableData"
						@row-click="rowClick"
						stripe
						style="width: 100%"
						border
					>
						<el-table-column
							prop="userName"
							label="使用单位"
							show-overflow-tooltip
							min-width="90"
							align="left"
						/>
						<el-table-column
							prop="systemName"
							label="业务系统上报名称"
							show-overflow-tooltip
							min-width="90"
							align="left"
						/>
						<el-table-column prop="location" label="部署楼层" show-overflow-tooltip align="left" />
						<el-table-column
							prop="cabinetCount"
							label="机柜数量"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="deviceCount"
							label="设备数量"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
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
import { toRefs, reactive, onMounted, watch, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
	name: 'UsingUnit',
	setup() {
		// 获取当前路由对象
		const router = useRouter();

		const queryInfo = reactive({
			userName: '',
			systemName: '',
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

		// 行单击事件，跳转到机房视图
		const rowClick = (row, column, event) => {
			router.push({
				path: '/roomView',
				query: {
					userName: row.userName,
					systemName: row.systemName,
				},
			});
		};

		let tableContainerRef = ref(null);
		let tableHeight = ref(500);

		const objectSpanMethod = () => {
			// todo：合并单元格
		};

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
			onSearch,
			handleSizeChange,
			handleCurrentChange,
			tableContainerRef,
			tableHeight,
			objectSpanMethod,
			rowClick,
		};
	},
};
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.using-unit-query {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 16px;
	color: #c5dff9;

	.device-count {
		height: 100px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		vertical-align: middle;
		justify-content: center;
		.item {
			font-size: 15px;
			width: 368px;
			height: 68px;
			text-align: center;
			vertical-align: middle;
			justify-content: center;
			display: flex;
			align-items: center;
			background-size: 100% 100%;
			background-image: url('@/assets/images/asset/back-icon.png');
			.icon{
				height: 17px;
				width: 16px;
				margin-right: 5px;
				background-position: center;
			}
			.subsystem-icon {
				background-image: url('@/assets/images/asset/subsystem-icon.png');
			}
			.font {
				font-weight: bold;
				font-size: 20px;
				padding-left: 20px;
			}
			.font::after{
				content: '个';
				font-size: 15px;
				margin-left: 10px;
			}
			.subsystem-font {
				color: #2bbdf7;
			}
			.rack-icon {
				background-image: url('@/assets/images/asset/rack-icon.png');
			}
			.rack-font {
				color: #f9c471;
			}
			.device-icon {
				background-image: url('@/assets/images/asset/device-icon.png');
			}
			.device-font {
				color: #2bbdf7;
			}
		}
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
		padding: 10px 0;
		overflow: hidden;
		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}
	}
}
</style>
