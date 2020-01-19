<template>
	<div class="app-wrapper" >
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<!-- <tags-view></tags-view> -->
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
// import { Navbar, Sidebar, AppMain, TagsView } from './components'
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  computed: {
    // sidebar() {
    //   return this.$store.state.app.sidebar
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/common.scss";
	.app-wrapper{
		display: flex;
		background-color: #eee;
		width: 100%;
		height: 100%;
		.sidebar-container{
			width: 180px;
		}
		.main-container{
			// width: calc(100% - 200px);
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			// overflow-y: scroll;
      @include scrollBar;
			// background-color: #666;
		}
	}
</style>