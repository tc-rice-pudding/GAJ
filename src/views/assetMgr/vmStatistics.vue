<template>
	<container-warp v-loading="loading" element-loading-text="Loading..." :element-loading-spinner="svg"
		element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.3)">
		<template #title> 虚拟机统计
		</template>

		<template #body>
			<div class="vm-statistic-view">
				<header>
					<div class="query-item">
						<span>使用单位</span>
						<el-select style="width: 150px" v-model="queryInfo.useUnit" placeholder="请选择" clearable
							 multiple collapse-tags collapse-tags-tooltip>
							<el-option v-for="item in useUnitOptions" :key="item.value" :label="item.text"
								:value="item.value" />
						</el-select>
					</div>
					<div class="query-item">
						<span>业务系统</span>
						<el-select style="width: 150px" v-model="queryInfo.systemName" placeholder="请选择" clearable
							
							multiple
							collapse-tags
							collapse-tags-tooltip>
							<el-option v-for="item in systemNameOptions" :key="item.value" :label="item.text"
								:value="item.value" />
						</el-select>
					</div>
					<div class="query-item">
						<span>虚拟机名称</span>
						<el-input style="width: 150px" v-model="queryInfo.name" clearable />
					</div>
					<div class="query-item">
						<span>机房</span>
						<el-select style="width: 150px" v-model="queryInfo.roomId" placeholder="请选择" clearable
							
							multiple
							collapse-tags
							collapse-tags-tooltip>
							<el-option v-for="item in roomOptions" :key="item.value" :label="item.text"
								:value="item.value" />
						</el-select>
					</div>
					<el-button class="btn" type="primary" @click="onSearch">查询</el-button>
					<el-upload style="margin: 0 10px" ref="uploadRef" action="/dcim/custom/device/virtualMachine/import"
						:auto-upload="true" :limit="1" :on-success="onUploadSuccess" :on-error="onUploadError"
						:on-progress="() => (importLoading = true)">
						<template #trigger>
							<el-button class="btn" type="primary" :loading="importLoading">导入</el-button>
						</template>
					</el-upload>
					<el-button class="btn" type="primary" @click="onExport">导出</el-button>
				</header>
				<section style="height: 200px; overflow: hidden">
					<div class="table-title">虚拟机使用情况</div>
					<el-table header-row-class-name="table-header" :data="useInfoList" stripe
						style="width: 100%; height: 100%">
						<el-table-column type="index" width="80" label="序号" align="center" />
						<el-table-column prop="useUnit" label="使用单位" show-overflow-tooltip min-width="90"
							align="center" />
						<el-table-column prop="systemCount" label="系统数量" show-overflow-tooltip min-width="90"
							align="center">
							<template v-slot="{ row }">
								<span style="color: #2bbdf7">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="machineCount" label="虚拟机数量" show-overflow-tooltip min-width="90"
							align="center">
							<template v-slot="{ row }">
								<span style="color: #ffcd75">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="deviceCount" label="设备数量" show-overflow-tooltip min-width="90"
							align="center">
							<template v-slot="{ row }">
								<span style="color: #2bbdf7">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="roomCount" label="机房数量" show-overflow-tooltip min-width="90"
							align="center">
							<template v-slot="{ row }">
								<span style="color: #ffcd75">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="cabinetCount" label="机柜数量" show-overflow-tooltip min-width="90"
							align="center">
							<template v-slot="{ row }">
								<span style="color: #2bbdf7">{{ row.deviceCount }}</span>
							</template>
						</el-table-column>
					</el-table>
				</section>
				<section ref="tableContainerRef" style="height: calc(100% - 260px); overflow: hidden">
					<div class="table-title">虚拟机设备详情</div>
					<el-table header-row-class-name="table-header" :height="tableHeight" :data="deviceInfoList" stripe
						style="width: 100%">
						<el-table-column type="index" width="80" label="序号" align="center" />
						<el-table-column prop="name" label="虚拟机名称" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="useUnit" label="使用单位" show-overflow-tooltip min-width="90"
							align="center" />
						<el-table-column prop="systemName" label="业务系统上报名称" show-overflow-tooltip min-width="90"
							align="center" />
						<el-table-column prop="deviceNum" label="设备序列号" show-overflow-tooltip min-width="90"
							align="center" />
						<el-table-column prop="roomName" label="机房名称" show-overflow-tooltip min-width="90"
							align="center" />
						<el-table-column prop="serialNum" label="机柜编号" show-overflow-tooltip min-width="90"
							align="center" />
						<el-table-column prop="upath" label="所在U位" show-overflow-tooltip min-width="90"
							align="center" />
					</el-table>
					<el-pagination class="pagenation" :current-page="currentPage" :page-size="pageSize"
						:page-sizes="[10, 30, 50, 100]" small="small" layout="sizes, prev, pager, next" :total="total"
						@size-change="handleSizeChange" @current-change="handleCurrentChange" />
				</section>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { exportHandler } from '@/utils';
import { ElMessage } from 'element-plus';

export const useOptions = () => {
	const useUnitOptions = ref([]);
	const systemNameOptions = ref([]);
	const roomOptions = ref([]);

	Promise.all([
		axios.get('/dcim/custom/device/virtualMachine/selectBox/1'),
		axios.get('/dcim/custom/device/virtualMachine/selectBox/2'),
		axios.get('/dcim/custom/device/virtualMachine/selectBox/3'),
	])
		.then(([res1, res2, res3]) => {
			useUnitOptions.value = res1.data;
			systemNameOptions.value = res2.data;
			roomOptions.value = res3.data;
		})
		.catch((error) => {
			console.log(error);
		});

	return { useUnitOptions, systemNameOptions, roomOptions };
};

export default defineComponent({
	name: 'vmStatistics',
	components: {},
	setup() {
		// 查询条件
		const queryInfo = reactive({
			useUnit: [], // 使用单位
			systemName: [], // 业务系统
			name: '', // 虚拟机名字
			roomId: [], // 机房
		});

		const useInfoList = ref([]);
		const deviceInfoList = ref([]);
		const pageInfo = reactive({ currentPage: 1, pageSize: 50, total: 0 });
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

		const getParams = () => ({
			useUnit: queryInfo.useUnit.toString(),
			systemName: queryInfo.systemName.toString(),
			name: queryInfo.name,
			roomId: queryInfo.roomId.toString(),
		});
		const getTableInfo = () => {
			loadingInfo.loading = true;

			Promise.all([
				axios.post('/dcim/custom/device/virtualMachine/getVMUsage', getParams()),
				axios.post(
					`/dcim/custom/device/virtualMachine/getPage?pageSize=${pageInfo.pageSize}&pageNum=${pageInfo.currentPage}`,
					getParams()
				),
			])
				.then(([res1, res2]) => {
					useInfoList.value = res1.data;
					deviceInfoList.value = res2.data.rows;
					pageInfo.total = res2.data.total;
					loadingInfo.loading = false;
				})
				.catch((error) => {
					console.log(error);
					loadingInfo.loading = false;
				});
		};
		getTableInfo();

		const handleSizeChange = (size) => {
			pageInfo.pageSize = size;
			getTableInfo();
		};
		const handleCurrentChange = (inx) => {
			pageInfo.currentPage = inx;
			getTableInfo();
		};

		const onSearch = () => {
			getTableInfo();
		};

		const importLoading = ref(false);
		const onUploadSuccess = (res) => {
			console.log('onUploadSuccess');
			importLoading.value = false;
			ElMessage.success(res || '导入成功......');
			Object.assign(queryInfo, {
				useUnit: [], // 使用单位
				systemName: [], // 业务系统
				name: '', // 虚拟机名字
				roomId: [], // 机房
			});
			getTableInfo();
		};
		const onUploadError = () => {
			console.log('onUploadError');
			importLoading.value = false;
			ElMessage.error('服务端错误......');
		};

		const onExport = () => {
			loadingInfo.loading = true;
			exportHandler('/dcim/custom/device/virtualMachine/export', getParams(), () => {
				loadingInfo.loading = false;
			});
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
			...toRefs(useOptions()),
			queryInfo,
			useInfoList,
			deviceInfoList,
			...toRefs(pageInfo),
			...toRefs(loadingInfo),
			tableContainerRef,
			tableHeight,
			handleSizeChange,
			handleCurrentChange,
			onSearch,
			importLoading,
			onUploadSuccess,
			onUploadError,
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

	>header {
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #c5dff9;
		padding: 10px;

		.query-item {
			margin-right: 20px;

			>span {
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

	>section {
		overflow: hidden;

		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}

		.table-title {
			color: #fff;
			text-align: left;
			padding: 5px 10px;
			margin: 0;
			font-size: 16px;
			font-weight: 600;
		}
	}
}
</style>

<style lang="less">
.el-upload-list {
	display: none;
}
</style>
