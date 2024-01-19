<template>
	<el-dialog
		v-model="dialogInfo.dialogCabinetVisible"
		:title="dialogInfo.cabinetName"
		align-center
		:center="false"
		:width="1000"
		class="custom-dialog"
	>
		<div
			class="cabinet-dialog-view"
			v-loading="loading"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.2)"
		>
			<cabinetView class="cabinet" :deviceMap="deviceMap"> </cabinetView>

			<div class="split-line"></div>
			<el-table
				class="device-table"
				header-row-class-name="table-header"
				:data="deviceList"
				stripe
				style="height: 100%"
			>
				<el-table-column prop="serialNum" label="序列号" show-overflow-tooltip min-width="90" align="center" />
				<el-table-column
					prop="deviceType"
					label="设备类型"
					show-overflow-tooltip
					min-width="85"
					align="center"
				/>
				<el-table-column prop="upath" label="所在U位" show-overflow-tooltip min-width="85" align="center" />
				<el-table-column prop="useOrg" label="使用单位" show-overflow-tooltip min-width="85" align="center" />
				<el-table-column prop="sysName" label="系统名称" show-overflow-tooltip min-width="85" align="center" />
				<el-table-column prop="power" label="功耗" show-overflow-tooltip min-width="70" align="center" />
			</el-table>
		</div>
	</el-dialog>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import CabinetView from './cabinetView.vue';

export default defineComponent({
	name: 'DialogCabinet',
	components: { CabinetView },
	props: {
		dialogInfo: {
			type: Object,
			default: () => {},
		},
	},
	setup() {
		const deviceList = ref([
			// fix
			{
				serialNum: 'BJID000011',
				deviceType: '服务器',
				upath: '39-42U',
				useOrg: '单位',
				sysName: '系统名称',
				power: '12',
			},
			{
				serialNum: 'BJID000012',
				deviceType: '服务器',
				upath: '12-15U',
				useOrg: '单位',
				sysName: '系统名称',
				power: '12',
			},
			{
				serialNum: 'BJID000013',
				deviceType: '服务器',
				upath: '1-3U',
				useOrg: '单位',
				sysName: '系统名称',
				power: '12',
			},
		]);
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

		const init = async (cabinetId) => {
			try {
				loadingInfo.loading = true;
				const { data: res } = await axios.get(`/dcim/custom/energy/getDevicesByCabinet/${cabinetId}`);
				deviceList.value = res;
				loadingInfo.loading = false;
			} catch (error) {
				console.log(error);
				loadingInfo.loading = false;
			}
		};

		watch(
			deviceList,
			() => {
				// {
				//     serialNum: 'BJID000011',
				//     deviceType: '服务器',
				//     upath: '39-42U',
				//     useOrg: '单位',
				//     sysName: '系统名称',
				//     power: '12',
				// }
				deviceMap = deviceList.value.reduce((map, curr) => {
					const [, startU, endU] = curr.upath.match(/(\d{1,2})-(\d{1,2})U/);
					const uHeight = endU - startU + 1;
					map[endU] = Object.assign(curr, { uHeight: uHeight });
					return map;
				}, {});
			},
			{ immediate: true }
		);

		return { init, deviceList, deviceMap, ...toRefs(loadingInfo) };
	},
});
</script>

<style lang="less" scoped>
@import '@/css/conponents.less';

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
