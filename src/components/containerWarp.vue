<template>
	<div class="root-view">
		<header>
			<div class="left">
				<div class="icon rotate-animation"></div>
				<div class="title">
					<slot name="title"></slot>
				</div>
			</div>
			<div class="right">
				<slot name="operation"></slot>
			</div>
		</header>
		<section>
			<slot name="body"></slot>
		</section>
	</div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.root-view {
	height: 100%;
	padding: 10px;
	font-family: Microsoft YaHei;
	box-sizing: border-box;
	color: #ffffff;

	> header {
		height: 48px;
		background: linear-gradient(90deg, rgba(0, 122, 251, 0.3), rgba(0, 122, 251, 0.2));
		box-sizing: border-box;
		display: flex;
		.left {
			display: flex;
			width: 300px;
			.icon {
				background-image: url('@/assets/images/asset/title-query.png');
				width: 48px;
				background-repeat: no-repeat;
				background-position: center;
				transform-origin: 50% 50%;
			}
			.title {
				flex: 1;
				background-image: url('@/assets/images/asset/title-panl.png');
				background-size: 100%;
				font-size: 20px;
				font-weight: 400;
				line-height: 50px;
				text-align: left;
				padding: 0 5px;
			}
		}
		.right {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}
	> section {
		height: calc(100% - 48px);
		background: #0e264a;
		overflow: hidden;
	}
}

@keyframes rotateIcon {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.rotate-animation {
	animation: rotateIcon 2s linear 0s infinite;
}
</style>
