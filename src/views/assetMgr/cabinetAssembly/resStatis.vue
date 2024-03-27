<template>
	<container-warp>
		<template #title> 机柜资源统计 </template>
		<template #body>
			<div class="res-statis-view">
				<div class="warp">
					<div class="row-info">
						<div class="info-item">
							<div class="label">机柜编码</div>
							<div class="content">{{ info.name }}</div>
						</div>
						<div class="info-item">
							<div class="label">楼层</div>
							<div class="content">{{ info.floor }}</div>
						</div>
						<div class="info-item">
							<div class="label">机房名称</div>
							<div class="content">{{ info.room }}</div>
						</div>
					</div>
					<div class="row-use">
						<header>使用情况</header>
						<section class="use-row-item">
							<div class="use-item">
								<div class="label">安装设备数量</div>
								<div class="content">{{ info.deviceCount }}</div>
							</div>
							<div class="use-item">
								<div class="label">总额定功率</div>
								<div class="content">{{ info.powerUsed }}</div>
							</div>
						</section>
						<section class="use-row-item">
							<div class="use-item">
								<div class="label">电源接口数使用数</div>
								<div class="content">{{ info.electricSocketUsed }}</div>
							</div>
							<div class="use-item">
								<div class="label">设备总高度</div>
								<div class="content">{{ info.uused }}</div>
							</div>
						</section>
					</div>
					<div class="row-base">
						<header>基本属性</header>
						<section class="row-base-item">
							<div class="base-item">
								<div class="label">机柜属性</div>
								<div class="content">{{ info.rackType }}</div>
							</div>
							<div class="split"></div>
							<div class="base-item">
								<div class="label">额定供电量</div>
								<div class="content">{{ info.power }}</div>
							</div>
						</section>
						<section class="row-base-item">
							<div class="base-item">
								<div class="label">PDU 电源接口数</div>
								<div class="content">{{ info.electricSocket }}</div>
							</div>
							<div class="split"></div>
							<div class="base-item">
								<div class="label">机柜容量</div>
								<div class="content">{{ info.utotal }}</div>
							</div>
						</section>
						<section class="row-base-item">
							<div class="base-item">
								<div class="label">空间利用率</div>
								<div class="content">{{ info.spaceRate }}</div>
							</div>
							<div class="split"></div>
							<div class="base-item">
								<div class="label">功率使用率</div>
								<div class="content">{{ info.powerRate }}</div>
							</div>
						</section>
						<section class="row-base-item">
							<div class="base-item">
								<div class="label">电源接口使用率</div>
								<div class="content">{{ info.electricSocketRate }}</div>
							</div>
							<div class="split"></div>
							<div class="base-item">
								<div class="label">综合利用率</div>
								<div class="content">{{ info.rate }}</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</template>
	</container-warp>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'ResStatis',
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
	},
	setup() {
		return {};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.res-statis-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	color: #c5dff9;
	padding: 10px;
	.warp {
		border: 1px solid #0382e6;
		height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		.row-info {
			flex: 0.8;
			display: flex;
			.info-item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.label {
					height: 25px;
					line-height: 25px;
					text-align: center;
					color: #fff;
					font-size: 14px;
				}
				.content {
					height: 25px;
					line-height: 25px;
					text-align: center;
					color: #ffcd75;
					font-size: 18px;
				}
			}
		}
		.row-use {
			flex: 1.5;
			display: flex;
			flex-direction: column;
			> header {
				height: 40px;
				line-height: 40px;
				background-image: url('@/assets/images/asset/title-bg.png');
				background-size: 100%;
			}
			.use-row-item {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 1;

				.use-item {
					flex: 1;
					.label {
						height: 25px;
						line-height: 25px;
						text-align: center;
						color: #fff;
						font-size: 14px;
					}
					.content {
						height: 25px;
						line-height: 25px;
						text-align: center;
						color: #0be7fb;
						font-size: 18px;
					}
				}
			}
			.use-row-item:first-of-type {
				border-bottom: 1px solid #0382e6;
			}
		}
		.row-base {
			flex: 3;
			display: flex;
			flex-direction: column;
			> header {
				height: 40px;
				line-height: 40px;
				background-image: url('@/assets/images/asset/title-bg.png');
				background-size: 100%;
			}
			.row-base-item {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 1;
				border-bottom: 1px solid #0382e6;
				.base-item {
					flex: 1;
					.label {
						height: 25px;
						line-height: 25px;
						text-align: center;
						color: #fff;
						font-size: 14px;
					}
					.content {
						height: 25px;
						line-height: 25px;
						text-align: center;
						color: #0be7fb;
						font-size: 18px;
					}
				}
				.split {
					height: 100%;
					width: 1px;
					background: #0382e6;
				}
			}
			.row-base-item:nth-of-type(3),
			.row-base-item:nth-of-type(4) {
				flex: 1.2;
				.content {
					height: 50px;
					line-height: 50px;
					background-image: url('@/assets/images/asset/base-bg.png');
					background-size: 80px;
					background-repeat: no-repeat;
					background-position: center;
				}
			}
			.row-base-item:last-of-type {
				border-bottom: none;
			}
			.row-base-item:first-child {
				border-right: 1px solid #0382e6;
			}
		}
	}
}
</style>
