<template>
	<container-warp>
		<template #title> 设备主要信息 </template>
		<template #body>
			<div class="device-detail-view">
				<el-table
					header-row-class-name="table-header"
					:data="tableData"
					stripe
					style="width: 100%; height: 100%"
				>
					<el-table-column type="index" width="60" label="序号" />
					<el-table-column
						prop="deviceType"
						label="设备类型"
						min-width="80"
						show-overflow-tooltip
						align="center"
					/>
					<el-table-column prop="brand" label="品牌" min-width="60" show-overflow-tooltip align="center" />
					<el-table-column
						prop="startU"
						label="起始U位"
						min-width="80"
						show-overflow-tooltip
						align="center"
					/>
					<el-table-column
						prop="power"
						label="额定功率"
						min-width="80"
						show-overflow-tooltip
						align="center"
					/>
					<el-table-column
						prop="electricSocket"
						min-width="100"
						label="电源接口数"
						show-overflow-tooltip
						align="center"
					/>
				</el-table>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'DeviceDetail',
	props: {
		tableData: {
			type: Array,
			default: () => [],
		},
	},
	setup() {
		return {};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.device-detail-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	padding: 5px;
}
</style>
