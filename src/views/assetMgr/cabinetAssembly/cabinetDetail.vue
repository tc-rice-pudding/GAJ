<template>
	<container-warp>
		<template #title> {{ name }} </template>
		<template #body>
			<div class="cabinet-detail-view">
				<section class="left">
					<div class="warp">
						<div class="row">
							<label class="title">机柜名称</label>
							<label class="content">{{ cabinetInfo.name || '' }}</label>
						</div>
						<div class="row">
							<label class="title">机柜属性</label>
							<label class="content">{{ cabinetInfo.rackType || '' }}</label>
						</div>
						<div class="row">
							<label class="title">是否启用</label>
							<label class="content">{{ cabinetInfo.isUsed || '' }}</label>
						</div>
						<div class="row">
							<label class="title">使用单位</label>
							<label class="content">{{ cabinetInfo.userName || '' }}</label>
						</div>
						<div class="row">
							<label class="title">机柜容量</label>
							<label class="content">{{ cabinetInfo.uTotal || '' }}</label>
						</div>
						<div class="row">
							<label class="title">机柜承重</label>
							<label class="content">{{ cabinetInfo.weight || '' }}</label>
						</div>
						<div class="row">
							<label class="title">机柜负责人</label>
							<label class="content">{{ cabinetInfo.rackPrincial || '' }}</label>
						</div>
						<div class="row">
							<label class="title">联系方式</label>
							<label class="content">{{ cabinetInfo.telephone || '' }}</label>
						</div>
					</div>
				</section>
				<section class="right">
					<cabinetView :deviceMap="deviceMap"></cabinetView>
				</section>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import CabinetView from './cabinetView.vue';

export default defineComponent({
	name: 'CabinetDetail',
	props: {
		name: String,
		cabinetInfo: {
			type: Object,
			default: () => ({}),
		},
		deviceMap: {
			type: Object,
			default: () => ({}),
		},
	},
	components: { CabinetView },
	setup() {
		return {};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.cabinet-detail-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	padding-right: 240px;

	.left {
		width: 250px;
		height: 626px;
		display: flex;
		justify-content: center;
		.warp {
			background-image: url('@/assets/images/asset/cabinet-bg.png');
			background-size: 100% 100%;
			height: 85px;
			padding: 20px;
			.row {
				margin: 5px 0;
				.title {
					width: 80px;
					display: inline-block;
					text-align: left;
					color: #fff;
					font-size: 14px;
				}
				.content {
					width: 110px;
					display: inline-block;
					text-align: left;
					color: #03c2f2;
					font-size: 16px;
				}
			}
		}
	}
	.right {
		display: flex;
		justify-content: center;
	}
}
</style>
