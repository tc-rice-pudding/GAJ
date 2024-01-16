<template>
	<div class="menu-view">
		<div class="menu-row" v-for="item in menuList" :key="item.path">
			<p>
				<el-button :type="btnType[item.type]" @click="menuClick(item)">{{ item.label }}</el-button>
			</p>
			<p>{{ item.path }}</p>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { routes } from '@/router/main.js';
import { useRouter } from 'vue-router';

export default defineComponent({
	setup() {
		const router = useRouter();
		const [, , ...menuList] = [...routes];
		const btnType = ['', 'info', 'success', 'primary', 'warning', 'danger'];

		const menuClick = (menu) => {
			window.open(`/#${menu.path}`, '_blank');
		};

		return { menuList, btnType, menuClick };
	},
});
</script>

<style lang="less">
.menu-view {
	padding: 30px;
	height: 100%;
	box-sizing: border-box;
	overflow: auto;

	> button {
		margin: 0 10px 10px 0 !important;
	}

	.menu-row {
		display: flex;
		> p:first-of-type {
			width: 220px;
			text-align: left;
			color: #fff;
			font-size: 14px;
			line-height: 26px;
		}
		> p:last-of-type {
			flex: 1;
			text-align: left;
			font-weight: 700;
			line-height: 26px;
			color: #2ec1f7;
		}
	}
}
</style>
