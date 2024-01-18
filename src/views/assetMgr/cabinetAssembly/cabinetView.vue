<template>
	<div class="cabinet-view">
		<div class="canbinet-top"></div>
		<div class="cabinet-center-item" v-for="u in uList" :key="u">
			<div class="left">{{ u.toString().padStart(2, 0) }}</div>
			<el-popover
				placement="right"
				popper-class="custom-popover"
				:width="200"
				trigger="hover"
				:disabled="!deviceMap[u]"
			>
				<template #reference>
					<div
						v-if="deviceMap[u]"
						class="center"
						:class="{
							'device-1u-height': deviceMap[u].uHeight === 1,
							'device-2u-height': deviceMap[u].uHeight === 2,
							'device-3u-height': deviceMap[u].uHeight === 3,
							'device-4u-height': deviceMap[u].uHeight === 4,
						}"
						:style="{ height: `${100 * deviceMap[u].uHeight}%`, 'z-index': 1 }"
					></div>
					<div class="center" v-else />
				</template>
				<p class="tip-row"><span class="tip-label">U位</span>{{ deviceMap[u]?.uposition }}</p>
				<p class="tip-row"><span class="tip-label">高度</span>{{ deviceMap[u]?.uheight }}</p>
				<p class="tip-row"><span class="tip-label">品牌</span>{{ deviceMap[u]?.brand }}</p>
				<p class="tip-row"><span class="tip-label">型号</span>{{ deviceMap[u]?.model }}</p>
				<p class="tip-row"><span class="tip-label">类型</span>{{ deviceMap[u]?.deviceType }}</p>
				<p class="tip-row"><span class="tip-label">编号</span>{{ deviceMap[u]?.deviceNum }}</p>
				<p class="tip-row"><span class="tip-label">使用状态</span>{{ deviceMap[u]?.usage }}</p>
				<p class="tip-row"><span class="tip-label">设备电源</span>{{ deviceMap[u]?.electricSocket }}</p>
				<p class="tip-row"><span class="tip-label">联网类型</span>{{ deviceMap[u]?.networkingType }}</p>
				<p class="tip-row"><span class="tip-label">业务系统</span>{{ deviceMap[u]?.systemName }}</p>
				<p class="tip-row"><span class="tip-label">使用单位</span>{{ deviceMap[u]?.userName }}</p>
				<p class="tip-row"><span class="tip-label">使用部门</span>{{ deviceMap[u]?.deptName }}</p>
				<p class="tip-row"><span class="tip-label">设备管理人</span>{{ deviceMap[u]?.ownerName }}</p>
				<p class="tip-row"><span class="tip-label">联系电话</span>{{ deviceMap[u]?.telephone }}</p>
				<p class="tip-row"><span class="tip-label">资产备注</span>{{ deviceMap[u]?.decription }}</p>
				<p class="tip-row"><span class="tip-label">录入时间</span>{{ deviceMap[u]?.createTime }}</p>
			</el-popover>
			<div class="right" />
		</div>
		<div class="canbinet-bottom"></div>
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
	},
	components: {},
	setup() {
		const uList = ref([]);
		uList.value = new Array(42)
			.fill(0)
			.map((it, inx) => inx + 1)
			.reverse();

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
		.device-1u-height:hover,
		.device-2u-height:hover,
		.device-3u-height:hover,
		.device-4u-height:hover {
			border: 1px solid #fff;
		}
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
		width: 125px;
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
