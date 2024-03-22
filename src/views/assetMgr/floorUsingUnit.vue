<template>
	<!-- 使用单位查询 -->
	<container-warp>
		<template #title> 按楼层查询单位设备 </template>
		<template #body>
			<div class="using-unit-query">
				<header>
					<div class="query-item">
						<span>使用单位</span>
						<el-select
							v-model="queryInfo.userName"
							style="width: 140px"
							placeholder="请选择"
							clearable
							
							multiple
							collapse-tags
							collapse-tags-tooltip
						>
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
						<el-select
							v-model="queryInfo.systemName"
							style="width: 140px"
							placeholder="请选择"
							clearable
							
							multiple
							collapse-tags
							collapse-tags-tooltip
						>
							<el-option
								v-for="item in optionMap.systemNameOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</div>
					<div class="query-item">
						<span>楼层</span>
						<el-select
							v-model="queryInfo.floor"
							style="width: 140px"
							placeholder="请选择"
							clearable
							
							multiple
							collapse-tags
							collapse-tags-tooltip
						>
							<el-option
								v-for="item in optionMap.floorOptions"
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
						<span class="subsystem-font font">{{ systemCount }}</span>
					</div>
					<div class="item">
						<span class="rack-icon icon"></span>
						<span>机柜</span>
						<span class="rack-font font">{{ cabinetCount }}</span>
					</div>
					<div class="item">
						<span class="device-icon icon"></span>
						<span>设备</span>
						<span class="device-font font">{{ deviceCount }}</span>
					</div>
				</div>
				<section
					ref="tableContainerRef"
					style="height: calc(100% - 180px); overflow: hidden"
					v-loading="loading"
					element-loading-text="Loading..."
					:element-loading-spinner="svg"
					element-loading-svg-view-box="-10, -10, 50, 50"
					element-loading-background="rgba(122, 122, 122, 0.2)"
				>
					<el-table
						header-row-class-name="table-header"
						:span-method="objectSpanMethod"
						:height="tableHeight"
						:data="resInfo.tableData"
						@row-click="rowClick"
						stripe
						border
						style="width: 100%"
					>
						<el-table-column prop="location" label="部署楼层" show-overflow-tooltip align="center" />
						<el-table-column prop="room" label="部署机房" show-overflow-tooltip align="center" />
						<el-table-column
							prop="userName"
							label="使用单位"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="systemName"
							label="业务系统上报名称"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
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
						:page-sizes="[10, 15, 30, 50, 100]"
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
import { useOptions } from './UsingUnit.vue';

// 获取使用单位的合计数据
export const useTotal = (queryInfo) => {
	const totalInfo = reactive({
		userCount: 0, //单位数量
		systemCount: 0, //系统数量
		cabinetCount: 0, //机柜数量
		deviceCount: 0, //设备数量
	});

	const getTotal = async () => {
		try {
			const { data: res } = await axios.post('/dcim/custom/system/total', {
				userName: queryInfo.userName || [], //使用单位可多选
				systemName: queryInfo.systemName || [], //业务系统可多选
				floorIds: queryInfo.floor || [],
				isFloor: true,
			});

			Object.assign(totalInfo, res);
		} catch (error) {
			console.log(error);
		}
	};
	getTotal();

	return { totalInfo, getTotal };
};

export default defineComponent({
	name: 'UsingUnit',
	setup() {
		// 获取当前路由对象
		const router = useRouter();

		const queryInfo = reactive({ userName: '', systemName: '', floor: '' });

		const { totalInfo, getTotal } = useTotal(queryInfo);

		const resInfo = reactive({
			tableData: [],
			spanObject: {
				// 'xx': {
				// 	firstInx: 0,
				// 	spanCount: 3,
				// }
			}, // 第一列合并信息
			spanObject2: {}, // 第二列合并信息
			spanObject3: {}, // 第三列合并信息
		});
		const pageInfo = reactive({
			currentPage: 1,
			pageSize: 15,
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
				path: '/roomUsingUnit',
				query: {
					userName: row.userName,
					systemName: row.systemName,
				},
			});
		};

		let tableContainerRef = ref(null);
		let tableHeight = ref(500);

		const getParams = () => {
			const params = {
				userName: queryInfo.userName || [], //使用单位可多选
				systemName: queryInfo.systemName || [], //业务系统可多选
				floorIds: queryInfo.floor || [],
				isFloor: true,
				page: {
					number: pageInfo.currentPage,
					size: pageInfo.pageSize,
				},
			};
			return params;
		};

		// 第三列合并单元格
		const build3column = (list) => {
			let userNameList = list.map((it) => `${it.location}_${it.room}_${it.userName}`);
			resInfo.spanObject3 = Array.from(new Set(userNameList)).reduce((map, curr) => {
				const firstInx = userNameList.findIndex((it) => it === curr);
				const nameList = userNameList.filter((it) => it === curr);
				map[curr] = { firstInx: firstInx, spanCount: nameList.length };
				return map;
			}, {});
		};

		// 第二列合并单元格
		const build2column = (list) => {
			let roomList = list.map((it) => `${it.location}_${it.room}`);
			resInfo.spanObject2 = Array.from(new Set(roomList)).reduce((map, curr) => {
				const firstInx = roomList.findIndex((it) => it === curr);
				const nameList = roomList.filter((it) => it === curr);
				map[curr] = { firstInx: firstInx, spanCount: nameList.length };
				return map;
			}, {});
		};

		// 第一列合并单元格
		const buildSpan = (list) => {
			let locationList = list.map((it) => it.location);
			resInfo.spanObject = Array.from(new Set(locationList)).reduce((map, curr, inx) => {
				const firstInx = locationList.findIndex((it) => it === curr);
				const nameList = locationList.filter((it) => it === curr);
				map[curr] = { firstInx, spanCount: nameList.length };
				return map;
			}, {});
		};
		const tableHandler = async () => {
			try {
				loadingInfo.loading = true;
				const {
					data: { total, rows },
				} = await axios.post('/dcim/custom/system/list', getParams());
				pageInfo.total = total;
				resInfo.tableData = rows;
				buildSpan(rows);
				build2column(rows);
				build3column(rows);
			} catch (error) {
				console.log(error);
				resInfo.tableData = [
					// fix
					{
						userName: 'gx', //单位名称
						room: 'dxc1101',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx', //单位名称
						room: 'dxc1101',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx', //单位名称
						room: 'dxc1102',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx', //单位名称
						room: 'dxc1102',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx2', //单位名称
						room: 'dxc1102',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx', //单位名称
						room: 'dxc1103',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx', //单位名称
						room: 'dxc1103',
						systemName: 'niemp', //业务系统
						location: '1f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx2', //单位名称
						room: 'dxc1101',
						systemName: 'niemp', //业务系统
						location: '2f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
					{
						userName: 'gx3', //单位名称
						room: 'dxc1101',
						systemName: 'niemp', //业务系统
						location: '3f', //部署位置
						cabinetCount: '', //机柜数量
						deviceCount: '', //设备数量
					},
				];
				pageInfo.total = 100;
				buildSpan(resInfo.tableData);
				build2column(resInfo.tableData);
				build3column(resInfo.tableData);
				console.log(resInfo.data);
			} finally {
				loadingInfo.loading = false;
			}
		};
		tableHandler();

		const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
			const { firstInx, spanCount } = resInfo.spanObject[row.location];
			const { firstInx: firstInx2, spanCount: spanCount2 } =
				resInfo.spanObject2[`${row.location}_${row.room}`] || {};
			const { firstInx: firstInx3, spanCount: spanCount3 } =
				resInfo.spanObject3[`${row.location}_${row.room}_${row.userName}`] || {};

			if (columnIndex === 0 && spanCount > 1) {
				return rowIndex === firstInx ? { rowspan: spanCount, colspan: 1 } : { rowspan: 0, colspan: 0 };
			} else if (columnIndex === 1 && spanCount2 > 1) {
				return rowIndex === firstInx2 ? { rowspan: spanCount2, colspan: 1 } : { rowspan: 0, colspan: 0 };
			} else if (columnIndex === 2 && spanCount3 > 1) {
				return rowIndex === firstInx3 ? { rowspan: spanCount3, colspan: 1 } : { rowspan: 0, colspan: 0 };
			}
		};

		const handleSizeChange = (size) => {
			pageInfo.pageSize = size;
			tableHandler();
		};
		const handleCurrentChange = (inx) => {
			pageInfo.currentPage = inx;
			tableHandler();
		};

		const onSearch = () => {
			getTotal();
			tableHandler();
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
			...toRefs(useOptions(queryInfo)),
			...toRefs(totalInfo),
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
});
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
			.icon {
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
			.font::after {
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
