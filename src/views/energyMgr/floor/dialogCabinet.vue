<template>
	<el-dialog v-model="dialogInfo.dialogCabinetVisible" :title="dialogInfo.cabinetName" align-center :center="false" :width="1000" class="custom-dialog">
		<div class="cabinet-dialog-view" v-loading="loading" element-loading-text="Loading..." :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.2)">
			<cabinetView class="cabinet" :deviceMap="deviceMap"> </cabinetView>
			<div class="split-line"></div>
			<!-- tab 页 -->
			<section class="device-table">
				<el-tabs v-model="energyTab" type="card" class="demo-tabs">
					<el-tab-pane label="历史功耗曲线" name="historyPower"></el-tab-pane>
					<el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
				</el-tabs>
				<Chart-Line v-if="energyTab === 'historyPower' && reflushFlag" ref="historyPowerRef" class="chart-item" :options="historyPowerOps" />
				<el-table v-if="energyTab === 'deviceList'" header-row-class-name="table-header" :data="deviceList" stripe style="height: calc(100% - 56px)">
					<el-table-column prop="serialNum" label="序列号" show-overflow-tooltip min-width="90" align="center" />
					<el-table-column prop="deviceType" label="设备类型" show-overflow-tooltip min-width="85" align="center" />
					<el-table-column prop="upath" label="所在U位" show-overflow-tooltip min-width="85" align="center" />
					<el-table-column prop="useOrg" label="使用单位" show-overflow-tooltip min-width="85" align="center" />
					<el-table-column prop="sysName" label="系统名称" show-overflow-tooltip min-width="85" align="center" />
					<el-table-column prop="power" label="功耗 (kw)" show-overflow-tooltip min-width="70" align="center" />
				</el-table>
			</section>
		</div>
	</el-dialog>
</template>

<script>
import {
	toRefs,
	reactive,
	onMounted,
	watch,
	ref,
	defineComponent,
	computed,
} from "vue";
import axios from "axios";
import { lineOpsDefault } from "../options";
import CabinetView from "./cabinetView.vue";
import ChartLine from "@/components/Chart-Line.vue";
import { deepClone } from "@/utils";

export default defineComponent({
	name: "DialogCabinet",
	components: { CabinetView, ChartLine },
	props: {
		dialogInfo: {
			type: Object,
			default: () => {},
		},
	},
	setup(props) {
		const energyTab = ref("historyPower");
		const deviceList = ref([]);
		const historyPowerRef = ref(null);
		let deviceMap = reactive({});

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

		const constryctDeviceMap = () => {
			let tmp = deviceList.value.reduce((map, curr) => {
				const [, startU, endU] = curr.upath.match(/(\d{1,2})-(\d{1,2})U/);
				const uHeight = endU - startU + 1;
				map[endU] = Object.assign(curr, { uHeight: uHeight });
				return map;
			}, {});

			Object.assign(deviceMap, tmp);
		};

		const historyPowerList = ref([]);
		const reflushFlag = ref(true);
		const reflushHandler = () => {
			reflushFlag.value = false;
			setTimeout(() => {
				reflushFlag.value = true;
			}, 200);
		};
		const getHistoryPower = async () => {
			try {
				reflushHandler();
				const { data: list } = await axios.get(
					`/dcim/custom/energy/cabinet/power/statistics/${props.dialogInfo.resourceId}`
				);
				historyPowerList.value = list || [];
			} catch (error) {
				historyPowerList.value = [
					{ value: "1", time: "2020-01" },
					{ value: "2", time: "2020-02" },
					{ value: "3", time: "2020-03" },
					{ value: "4", time: "2020-04" },
					{ value: "5", time: "2020-05" },
					{ value: "6", time: "2020-05" },
				];
				console.log(error);
			}
		};

		let historyPowerOps = computed(() => {
			let defaultOps = deepClone(lineOpsDefault);
			defaultOps.color = ["#00DEFF"];
			defaultOps.title.text = "历史功耗 (kw)";
			defaultOps.xAxis.data = historyPowerList.value.map((it) => it.time) || [];
			defaultOps.legend = null;
			defaultOps.series = {
				type: "line",
				areaStyle: {
					opacity: 0.2,
				},
				symbol: "emptyCircle",
				symbolSize: 6,
				data: historyPowerList.value.map((it) => it.value) || [],
			};

			return defaultOps;
		});

		const init = async (cabinetId) => {
			try {
				loadingInfo.loading = true;
				getHistoryPower();
				const { data: res } = await axios.get(
					`/dcim/custom/energy/getDevicesByCabinet/${cabinetId}`
				);
				deviceList.value = res;
				constryctDeviceMap();
				loadingInfo.loading = false;
			} catch (error) {
				console.log(error);
				loadingInfo.loading = false;
				setTimeout(() => {
					deviceList.value = [{
							serialNum: "BJID000011",
							deviceType: "服务器",
							upath: "39-42U",
							useOrg: "单位",
							sysName: "系统名称",
							power: "12",
						},
						{
							serialNum: "BJID000012",
							deviceType: "服务器",
							upath: "12-15U",
							useOrg: "单位",
							sysName: "系统名称",
							power: "12",
						},
						{
							serialNum: "BJID000013",
							deviceType: "服务器",
							upath: "1-3U",
							useOrg: "单位",
							sysName: "系统名称",
							power: "12",
						},
					];
					constryctDeviceMap();
				}, 1000);
			}
		};

		return {
			reflushFlag,
			historyPowerRef,
			energyTab,
			init,
			deviceList,
			deviceMap,
			...toRefs(loadingInfo),
			historyPowerOps,
		};
	},
});
</script>

<style lang="less" scoped>
@import "@/css/conponents.less";
.cabinet-dialog-view {
	display: flex;
	height: 630px;
	.cabinet {
		width: 230px;
		position: relative;
	}
	.split-line {
		background-image: linear-gradient(to bottom, transparent, #0262af, transparent);
		width: 2px;
		height: 50%;
		margin: 0 20px;
		margin-top: 15%;
	}
	.device-table {
		flex: 1;
		::v-deep(.el-tabs__item) {
			border: none;
			color: #fff;
			background: #034785;
			border-top: 2px solid #038acc;
		}
		::v-deep(.el-tabs__nav-scroll) {
			margin: 0;
		}
		::v-deep(.el-tabs__item.is-active) {
			background: #0462aa;
			font-weight: 500;
		}
	}
}

.el-dialog {
	background-color: rgb(160, 207, 255);
}

::v-deep(.root-view) {
	.custom-dialog {
		background: #051b3d;
		.el-dialog__header {
			text-align: left;
		}
		.el-dialog__body {
			padding: 5px;
		}
	}
}
</style>

<style lang="less">
.el-dialog {
	background: #01192e;
	border: 1px solid #005eb1;
	.el-dialog__header {
		text-align: left;
		.el-dialog__title {
			color: #fff;
		}
	}
	.el-dialog__body {
		padding: 10px 20px;
	}
}
</style>
