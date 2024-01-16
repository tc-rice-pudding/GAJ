<template>
	<container-warp>
		<template #title> 各层机柜使用量 </template>
		<template #operation>
			<el-popover placement="top-start" :width="500" trigger="hover">
				<template #reference>
					<div style="padding: 10px; cursor: pointer; width: 100px; float: right">计算规则说明</div>
				</template>
				<p><span class="tip-label">可部署2U设备：</span>机柜顶部/底部各预留1U，机柜内连续U位/3，向下取整</p>
				<p><span class="tip-label">可部署3U设备：</span>机柜顶部/底部各预留1U，机柜内连续U位/4，向下取整</p>
				<p><span class="tip-label">可部署2+3U设备：</span>机柜顶部/底部各预留1U，机柜内连续U位/7，向下取整</p>
			</el-popover>
		</template>
		<template #body>
			<div class="floor-view">
				<div class="device-count">
					<div class="item">
						<span class="font-color-one">{{ resInfo.totalCount }} 个</span>
						<span>机柜总数</span>
					</div>
					<div class="item">
						<span class="font-color-two">{{ resInfo.usedCount }} 个</span>
						<span>已使用</span>
					</div>
					<div class="item">
						<span class="font-color-one">{{ resInfo.freeCount }} 个</span>
						<span>未使用</span>
					</div>
					<div class="item">
						<span class="font-color-two">{{ resInfo.device2UCount }} 个</span>
						<span>可部署2U设备</span>
					</div>
					<div class="item">
						<span class="font-color-one">{{ resInfo.device3UCount }} 个</span>
						<span>可部署3U设备</span>
					</div>
					<div class="item">
						<span class="font-color-two">{{ resInfo.device23UCount }} 个</span>
						<span>可部署2+3U设备</span>
					</div>
				</div>
				<section
					ref="tableContainerRef"
					style="height: calc(100% - 100px); overflow: hidden"
					v-loading="loading"
					element-loading-text="Loading..."
					:element-loading-spinner="svg"
					element-loading-svg-view-box="-10, -10, 50, 50"
					element-loading-background="rgba(122, 122, 122, 0.2)"
				>
					<el-table
						header-row-class-name="table-header"
						:span-method="objectSpanMethod"
						:height="tableHeight"
						:data="resInfo.floorList"
						:cell-style="cellStyle"
						@row-click="rowClick"
						stripe
						style="width: 100%"
						border
					>
						<el-table-column
							prop="floorName"
							label="楼层"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="totalCount"
							label="机柜总数"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column prop="usedCount" label="已使用" show-overflow-tooltip align="center" />
						<el-table-column
							prop="freeCount"
							label="未使用"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="device2UCount"
							label="可部署2U设备"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="device3UCount"
							label="可部署3U设备"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
						<el-table-column
							prop="device23UCount"
							label="可部署2+3U设备"
							show-overflow-tooltip
							min-width="90"
							align="center"
						/>
					</el-table>
				</section>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'CabinetUsage',
	components: {},
	setup() {
		// 获取当前路由对象
		const router = useRouter();
		const resInfo = reactive({
			floorList: [],
			totalCount: 0,
			usedCount: 0,
			freeCount: 0,
			device2UCount: 0,
			device3UCount: 0,
			device23UCount: 0,
		});

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

		const tableHandler = async () => {
			try {
				loadingInfo.loading = true;
				const res = await axios.get('/dcim/custom/capacity/cabinet/count/floor');
				Object.assign(resInfo, res);
			} catch (error) {
				console.log(error);
			} finally {
				loadingInfo.loading = false;
			}
		};

		//行单击事件，跳转到机房视图
		const rowClick = (row, column, event) => {
			router.push({ path: '/roomView', query: { ...row } });
		};

		const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
			if (columnIndex === 1 || columnIndex === 3 || columnIndex === 5) {
				return { color: '#2BBDF7' };
			} else if (columnIndex === 2 || columnIndex === 4 || columnIndex === 6) {
				return { color: '#F9C471' };
			} else {
				return {};
			}
		};

		const tableContainerRef = ref();
		let tableHeight = ref(500);
		onMounted(() => {
			tableHandler();

			setTimeout(() => {
				if (tableContainerRef.value) {
					const containerH = tableContainerRef.value.clientHeight; // 减去分页的高度
					tableHeight.value = `${containerH}`;
				}
			}, 100);
		});

		return {
			...toRefs(loadingInfo),
			resInfo,
			tableContainerRef,
			tableHeight,
			rowClick,
			cellStyle,
		};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.tip-label {
	color: #fff;
	display: inline-block;
	width: 125px;
}

.floor-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: @background;
	font-size: 16px;
	font-family: Microsoft YaHei;
	color: #c5dff9;
	.title-panel {
		display: flex;
		flex-direction: row;
		align-items: left;
		width: 100%;
		height: 42px;
		background: linear-gradient(90deg, rgba(0, 122, 251, 0.3), rgba(0, 122, 251, 0.2));
		.panel-left {
			height: 100%;
			width: 200px;
			height: 42px;
			display: flex;
			flex-direction: row;
			align-items: left;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			background-image: url('@/assets/images/asset/title-panl.png');
			.title-iocn {
				background-image: url('@/assets/images/asset/title-query.png');
				width: 42px;
				height: 44px;
			}
			.title-font {
				font-size: 20px;
				font-family: PangMenZhengDaoBiaoTiTiMianFeiBan-4;
				font-weight: 400;
				color: #ffffff;
				padding-top: 8px;
				padding-left: 5px;
			}
		}
		.panel-right {
			text-align: right;
			width: 90%;
			vertical-align: middle;
			font-weight: 400;
			color: #ffffff;
		}
	}
	.device-count {
		height: 100px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		vertical-align: middle;
		justify-content: center;
		.item {
			width: 232px;
			height: 44px;
			padding: 20px 0px;
			text-align: center;
			vertical-align: middle;
			justify-content: center;
			display: inline-grid;
			align-items: center;
			background-image: url('@/assets/images/asset/back.png');
			background-position: center;
			.font-color-one {
				font-family: Microsoft YaHei;
				font-weight: bold;
				font-size: 16px;
				color: #2bbdf7;
				padding-left: 5px;
			}
			.font-color-two {
				font-family: Microsoft YaHei;
				font-weight: bold;
				font-size: 16px;
				color: #f9c471;
				padding-left: 5px;
			}
		}
	}
	> header {
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: @background;
		color: #c5dff9;
		padding: 10px;
		.query-item {
			margin-right: 10px;
			> span {
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
	> section {
		overflow: hidden;
		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}
	}
}
</style>
