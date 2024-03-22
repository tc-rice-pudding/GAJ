<template>
	<el-dialog v-model="dialogInfo.dialogCabinetVisible" :title="dialogInfo.cabinetName" align-center :center="false"
		:width="480" class="custom-dialog">
		<div class="cabinet-dialog-view">
			<cabinetView class="cabinet" :deviceMap="deviceMap" :hightlightUMap="uMap[highlightType]" />
			<div style="padding-left: 30px;">
				<p :class="{ hightlight: true, active: highlightType === 'list2u' }" @click="highlightType = 'list2u'">可部署
					2U 设备</p>
				<p :class="{ hightlight: true, active: highlightType === 'list3u' }" @click="highlightType = 'list3u'">可部署 3U 设备</p>
				<p :class="{ hightlight: true, active: highlightType === 'list23u' }" @click="highlightType = 'list23u'">可部署 23U 设备</p>
			</div>
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
import CabinetView from "./cabinetView.vue";

export default defineComponent({
	name: "DialogCabinet",
	components: { CabinetView },
	props: {
		dialogInfo: {
			type: Object,
			default: () => { },
		},
	},
	setup(props) {
		const deviceMap = reactive({
			3: {
				uHeight: 3,
			},
			8: {
				uHeight: 2,
			},
			12: {
				uHeight: 1,
			},
		});

		const highlightType = ref('list2u');
		const uMap = reactive({
			list2u: {},
			list3u: {},
			list23u: {},
		});

		const setHighlightUInfo = (uInfo, deviceObj) => {
			Object.assign(uMap, uInfo);
			Object.assign(deviceMap, deviceObj);
			console.log(uMap, deviceMap);
		};

		return {
			deviceMap,
			setHighlightUInfo,
			highlightType,
			uMap,
		};
	},
});
</script>

<style lang="less" scoped>
@import "@/css/conponents.less";

.cabinet-dialog-view {
	display: flex;
	height: 630px;
	justify-content: center;

	.cabinet {
		width: 230px;
		position: relative;
	}

	.hightlight {
		cursor: pointer;
	}

	.active {
		color: #0ae1f9;
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
