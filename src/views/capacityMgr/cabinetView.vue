<template>
	<div class="cabinet-view">
		<div class="canbinet-top"></div>
		<div class="cabinet-center-item" v-for="u in uList" :key="u">
			<div class="left">{{ u.toString().padStart(2, 0) }}</div>

			<div class="center" :class="{
			'device-1u-height': deviceMap[u]?.uHeight === 1,
			'device-2u-height': deviceMap[u]?.uHeight === 2,
			'device-3u-height': deviceMap[u]?.uHeight === 3,
			'device-4u-height': deviceMap[u]?.uHeight === 4,
		}" :style="{
			height: `${100 * (deviceMap[u]?.uHeight ? deviceMap[u]?.uHeight : 1)}%`,
			'z-index': u,
		}">
				<div class="shade" :style="{ height: `${100 * (hightlightUMap[u]?.uHeight || 0)}%` }"></div>
			</div>
			<div class="right" />
		</div>
		<div class="canbinet-bottom "></div>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'CabinetView',
	props: {
		// 设备 map，{u位：{uHeight, 设备属性信息}}
		deviceMap: {
			type: Object,
			default: () => ({
				// 3: {
				// 	uHeight: 3,
				// },
				// 8: {
				// 	uHeight: 2,
				// },
				// 12: {
				// 	uHeight: 1,
				// },
				// 23: {
				// 	uHeight: 4,
				// },
			}),
		},
		hightlightUMap: {
			type: Object,
			default: () => ({
				// 3: {
				// 	uHeight: 3,
				// },
				// 8: {
				// 	uHeight: 2,
				// },
				// 12: {
				// 	uHeight: 1,
				// },
				// 23: {
				// 	uHeight: 4,
				// },
			}),
		}
	},
	components: {},
	setup(props) {
		const uList = ref([]);
		uList.value = new Array(42)
			.fill(0)
			.map((it, inx) => inx + 1)
			.reverse();

		watch(() => props.deviceMap, () => {
			console.log('更新设备...');
		});
		watch(() => props.hightlightUMap, () => {
			console.log('高亮u位...');
			console.log(props.hightlightUMap);
			console.log('高亮u位...');
		}, {
			immediate: true
		});

		return { uList };
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';
@cabinet-width: 220px;
@device-height: 14px;
@device-border: 28px;

.cabinet-view {
	box-sizing: border-box;
	overflow: auto;
	width: @cabinet-width;

	.canbinet-top {
		height: 14px;
		background: url('@/assets/images/cabinet/cabinet-top.svg') no-repeat center 0;
		background-size: 100%;
	}

	.cabinet-center-item {
		display: flex;
		height: @device-height;

		.left {
			font-size: 10px;
			text-align: center;
			width: @device-border;
			background: url('@/assets/images/cabinet/cabinet-left.svg') no-repeat;
			background-size: 100%;
		}

		.center {
			flex: 1;
			background: url('@/assets/images/cabinet/cabinet-uspace.svg') no-repeat;
			background-size: 100%;
			position: relative;

			.shade {
				position: absolute;
				top: 0;
				left: 0;
				background: #ff00005c;
				width: 100%;
			}
		}

		.right {
			width: @device-border;
			background: url('@/assets/images/cabinet/cabinet-right.svg') no-repeat;
			background-size: 100%;
		}

		.device-1u-height {
			flex: 1;
			background-size: 100%;
			background-image: url('@/assets/images/cabinet/1U.svg');
		}

		.device-2u-height {
			flex: 1;
			background-size: 100%;
			background-image: url('@/assets/images/cabinet/2U.svg');
		}

		.device-3u-height {
			flex: 1;
			background-size: 100%;
			background-image: url('@/assets/images/cabinet/3U.svg');
		}

		.device-4u-height {
			flex: 1;
			background-size: 100%;
			background-image: url('@/assets/images/cabinet/4U.svg');
		}

		.device-1u-height,
		.device-2u-height,
		.device-3u-height,
		.device-4u-height {
			cursor: pointer;
		}

		// .device-1u-height:hover,
		// .device-2u-height:hover,
		// .device-3u-height:hover,
		// .device-4u-height:hover {
		// 	border: 1px solid #fff;
		// }
	}

	.canbinet-bottom {
		height: 24px;
		background: url('@/assets/images/cabinet/cabinet-bottom.svg') no-repeat center 0;
		background-size: 100%;
	}
}

.tip-row {
	color: #03c2f2;
	margin: 5px 3px 8px;

	.tip-label {
		color: #fff;
		display: inline-block;
		width: 80px;
	}
}
</style>

<style lang="less">
.el-popover.custom-popover {
	background-image: url('@/assets/images/asset/tip-bg.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-color: transparent;
	border: none;

	.el-popper__arrow {
		display: none;
	}
}
</style>
