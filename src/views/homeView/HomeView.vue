<template>
	<div class="home">
		<header>
			<div class="query-item">
				<span>使用单位</span>
				<el-select v-model="queryInfo.userName" placeholder="请选择" size="small" clearable filterable>
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
				<el-select v-model="queryInfo.systemName" placeholder="请选择" size="small" clearable filterable>
					<el-option
						v-for="item in optionMap.systemNameOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						
					/>
				</el-select>
			</div>
			<!-- <el-button type="primary" size="small" @click="onSearch">查询</el-button> -->
			<el-button style="background: transparent; color: #73e0cd" type="primary" size="small" @click="onSearch"
				>查询</el-button
			>
		</header>

		<section
			v-loading="loading1"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.8)"
		>
			<el-table header-row-class-name="table-header" :data="resInfo.tableData1" stripe style="width: 100%" border>
				<el-table-column prop="userName" label="使用单位" />
				<el-table-column prop="roomNum" label="机房数量" />
				<el-table-column prop="deviceNum" label="设备数量" />
				<el-table-column prop="typeNum" label="设备类型" />
			</el-table>
		</section>

		<section
			ref="tableContainerRef"
			style="height: calc(100% - 180px); overflow: hidden"
			v-loading="loading2"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.8)"
		>
			<el-table header-row-class-name="table-header" :height="tableHeight" :data="resInfo.tableData2" stripe style="width: 100%" border>
				<el-table-column type="index" width="80" label="序号" align="center"/>
				<el-table-column prop="room" label="机房名称" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="cabinet" label="机柜编码" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="deviceNum" label="编码" show-overflow-tooltip align="center"/>
				<el-table-column prop="usage" label="使用状态" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="startU" label="起始U位" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="endU" label="结束U位" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="u" label="高度" show-overflow-tooltip align="center"/>
				<el-table-column prop="deviceTypeCn" label="设备类型" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="brand" label="设备品牌" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="model" label="设备型号" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="power" label="设备额定功率" show-overflow-tooltip min-width="130" align="center"/>
				<el-table-column prop="electricSocket" label="设备电源" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="businessSystem" label="业务系统" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="userName" label="使用单位" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="deptName" label="使用部门" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="ownerName" label="设备管理人" show-overflow-tooltip min-width="100" align="center"/>
				<el-table-column prop="telephone" label="联系电话" show-overflow-tooltip min-width="90" align="center"/>
				<el-table-column prop="createTime" label="录入时间" show-overflow-tooltip min-width="90" align="center"/>
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
import { toRefs, reactive, onMounted, watch, ref } from 'vue';
import axios from 'axios';

export default {
	name: 'HomeView',
	components: {},
	setup() {
		const queryInfo = reactive({
			userName: '',
			systemName: '',
		});
		const optionMap = reactive({
			userNameOptions: [],
			systemNameOptions: [],
		});
		const resInfo = reactive({
			tableData1: [],
			tableData2: [],
		});
		const pageInfo = reactive({
			currentPage: 1,
			pageSize: 10,
			total: 0,
		});
		const loadingInfo = reactive({
			loading1: ref(false),
			loading2: ref(false),
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

		// 获取使用单位
		const getOption1 = async () => {
			try {
				const res = await axios.get(`/dcim/space/getUserName?key=${queryInfo.systemName}`);
				if (res.data.status === 200) {
					optionMap.userNameOptions = (res.data.result || []).map((it) => ({ label: it, value: it }));
				}
			} catch (error) {
				console.log(error);
			}
		};
		// 获取业务系统
		const getOption2 = async () => {
			try {
				const res = await axios.get(`/dcim/space/getBusinessSystem?key=${queryInfo.userName}`);
				if (res.data.status === 200) {
					optionMap.systemNameOptions = (res.data.result || []).map((it) => ({ label: it, value: it }));
				}
			} catch (error) {
				console.log(error);
			}
		};
		watch(
			() => queryInfo.userName,
			(val) => {
				getOption2(val);
			}
		);
		// watch(
		// 	() => queryInfo.systemName,
		// 	(val) => {
		// 		getOption1(val);
		// 	}
		// );

		const getParams = (pageInx, pageSize) => {
			let terms = [];
			if (queryInfo.userName) {
				terms.push({ field: 'properties.User_name', value: queryInfo.userName, operator: 'eq' });
			}
			if (queryInfo.systemName) {
				terms.push({
					field: 'properties.Business_system_Dispname',
					value: queryInfo.systemName,
					operator: 'eq',
				});
			}
			return {
				where: [
					{
						terms: [
							{ field: 'ci_type', value: '2', operator: 'eq' },
							{ field: 'device_type', value: '1.%', operator: 'like' },
							{ field: 'location', value: 'project_root%', operator: 'like' },
							...terms,
						],
					},
				],
				page: { number: pageInx, size: pageSize },
				sorts: [{ field: 'create_date', type: 'DESC' }],
				translate: 1,
			};
		};
		const table1Handler = async () => {
			try {
				loadingInfo.loading1 = true;
				const res = await axios.post(
					`/dcim/space/assetListDetail?userName=${queryInfo.userName}`,
					getParams(pageInfo.currentPage, 100000)
				);
				if (res.data.status === 200) {
					resInfo.tableData1 = res.data.result;
				}
			} catch (error) {
				console.log(error);
			} finally {
				loadingInfo.loading1 = false;
			}
		};
		const table2Handler = async () => {
			try {
				loadingInfo.loading2 = true;
				const res = await axios.post(
					'/dcim/space/assetList',
					getParams(pageInfo.currentPage, pageInfo.pageSize)
				);
				if (res.data.status === 200) {
					resInfo.tableData2 = res.data.result;
					pageInfo.total = res.data.total;
				}
			} catch (error) {
				console.log(error);
			} finally {
				loadingInfo.loading2 = false;
			}
		};

		const onSearch = () => {
			table1Handler();
			table2Handler();
			console.log('查询');
		};

		const handleSizeChange = (size) => {
			pageInfo.pageSize = size;
			table2Handler();
		};
		const handleCurrentChange = (inx) => {
			pageInfo.currentPage = inx;
			table2Handler();
		};

		const tableContainerRef = ref();
		let tableHeight = ref(500);
		onMounted(() => {
			getOption1();
			getOption2();
			table1Handler();
			table2Handler();

			setTimeout(() => {
				if(tableContainerRef.value){
					const containerH = tableContainerRef.value.clientHeight - 20 - 34; // 减去分页的高度
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
		};
	},
};
</script>

<style lang="less" scoped>
@background: #051b3d;
@comp-background: #09367a;

.home {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 10px;
	background: @background;

	> header {
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1px solid @comp-background;
		// background: #eee;
		background: @background;
		color: #98c9de;
		padding: 0 10px;

		.query-item {
			margin-right: 10px;
			> span {
				font-size: 14px;
				vertical-align: middle;
				display: inline-block;
				margin-right: 5px;
			}
		}
	}
	> section {
		padding: 10px 0;
		background: @background;
		overflow: hidden;
		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}
	}
}

::v-deep(section) {
	.el-table {
		--el-table-header-bg-color: @background;
		--el-table-tr-bg-color: @background;
		--el-fill-color-lighter: #0d2156;
		--el-table-bg-color: @background;
		--el-table-row-hover-bg-color: #0d2156;
		--el-table-border-color: @comp-background;
		--el-text-color-secondary: #9ce1fc;
	}

	.el-pagination__sizes .is-first {
		margin: 0 5px;
	}
	.el-pagination--small .btn-next,
	.el-pagination--small .btn-prev,
	.el-pagination--small .el-pager li {
		margin: 0 1px;
	}

	.table-header th {
		background-color: @background !important;
		height: 40px !important;
		border-top: 1px solid @comp-background !important;
		// border-bottom: 1px solid @background !important;
		// background-color: #e8ecf0 !important;
		// height: 40px !important;
		// border-top: 1px solid #e8ecf0 !important;
		// border-bottom: 1px solid #e8ecf0 !important;
	}

	.el-table th,
	.el-table td {
		padding: 0px !important;
		height: 40px !important;
	}

	.el-table__header-wrapper {
		border-top: 1px solid @comp-background;
	}
	.el-table thead {
		// color: #606266;
		filter: blur(0.3px);
		color: #fff;
	}
}

::v-deep(header) {
	.el-select {
		--el-fill-color-blank: @background;
		--el-border-color: @comp-background;
	}
}
::v-deep(#app) {
	.el-popper.is-light {
		--el-bg-color-overlay: @background;
		--el-border-color-light: @comp-background;
	}
	.el-popper.is-light {
		background: @background;
		border: 1px solid @comp-background;
	}
}
</style>