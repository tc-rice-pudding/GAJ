<template>
	<container-warp>
		<template #title> 能耗总览 </template>
		<template #body>
			<div class="energy-overview-view">
				<nav>
					<el-radio-group v-model="energyTab" style="padding: 10px 10px 30px">
						<el-radio-button label="whole">整体能耗</el-radio-button>
						<el-radio-button label="unit">使用单位能耗</el-radio-button>
						<el-radio-button label="system">使用系统能耗</el-radio-button>
						<el-radio-button label="cabinet">异常能耗机柜</el-radio-button>
					</el-radio-group>
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
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Whole from './energyComponents/whole.vue';
import Unit from './energyComponents/unit.vue';
import System from './energyComponents/system.vue';
import Cabinet from '@/views/energyComponents/cabinet.vue';

export default defineComponent({
	name: 'energyOverview',
	components: { Whole, Unit, System, Cabinet },
	setup() {
		const energyTab = ref('whole');

		return { energyTab };
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
	}
	> section {
		width: 100%;
		height: calc(100% - 72px);
		overflow: hidden;
	}
}
</style>
