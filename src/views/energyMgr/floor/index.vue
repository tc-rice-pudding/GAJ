<template>
	<container-warp>
		<template #title> {{ floorInfo.floorName }} 能耗总览 </template>
		<template #body>
			<div class="energy-overview-view">
				<nav>
					<el-tabs v-model="energyTab" type="card" class="demo-tabs">
						<el-tab-pane label="整体能耗" name="whole"></el-tab-pane>
						<el-tab-pane label="使用单位能耗" name="unit"></el-tab-pane>
						<el-tab-pane label="使用系统能耗" name="system"></el-tab-pane>
						<el-tab-pane label="异常能耗机柜" name="cabinet"></el-tab-pane>
					</el-tabs>
				</nav>
				<section>
					<whole v-if="energyTab === 'whole'" />
					<unit v-if="energyTab === 'unit'" />
					<system v-if="energyTab === 'system'" />
					<cabinet v-if="energyTab === 'cabinet'" />
				</section>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import Whole from './whole.vue';
import Unit from './unit.vue';
import System from './system.vue';
import Cabinet from './cabinet.vue';

export default defineComponent({
	name: 'FloorEnergy',
	components: { Whole, Unit, System, Cabinet },
	setup() {
		const route = useRoute();
		const energyTab = ref('whole');

		const floorInfo = computed(() => ({
			floorId: route.query.floorId,
			floorName: route.query.floorName,
		}));

		return { energyTab, floorInfo };
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.energy-overview-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;

	> nav {
		text-align: left;
		::v-deep(.el-tabs__item) {
			border: none;
			color: #fff;
			background: #034785;
			border-top: 2px solid #038ACC;
		}
		::v-deep(.el-tabs__nav-scroll) {
			margin: 10px 14px;
		}
		::v-deep(.el-tabs__item.is-active) {
			background: #0462aa;
			font-weight: 500;
		}
	}
	> section {
		width: 100%;
		height: calc(100% - 56px);
		overflow: hidden;
	}
}
</style>
