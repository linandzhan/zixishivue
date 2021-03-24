<template>
    <div class="layout">
        <layout-header v-if="route.meta.isShowHeader"></layout-header>
        <layout-left v-if="route.meta.isShowLeftSider"></layout-left>


        <el-main :style="{marginLeft:layoutMarginLeft+'px',marginTop:LayoutHeaderHeight+'px',padding:0}">
          <keep-alive>
            <router-view
              v-if="route.meta.keepAlive"
              :style="{zIndex: 0,width: viewWidth + 'px', height: viewHeight + 'px', backgroundColor: 'rgba(255, 255, 255, 1)'}"
            ></router-view>
          </keep-alive>
          <router-view
            v-if="!route.meta.keepAlive"
            :style="{zIndex: 0,width: viewWidth + 'px', height: viewHeight + 'px', backgroundColor: 'rgba(255, 255, 255, 1)'}"
          ></router-view>
        </el-main>


    </div>
</template>

<script>
  import LayoutLeft from "./layout-left.vue";
  import LayoutHeader from "./layout-header.vue";
    export default {
        name: "layout",
      components:{
          LayoutHeader,LayoutLeft
      },
      data(){
          return{
            LayoutHeaderHeight: 50, // 50
            layoutMarginLeft: 200,
            viewWidth: 0,
            viewHeight: 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
          }
      },
      created() {
        // watch window size change
        window.addEventListener(
          "resize",
          () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
          },
          false
        );
        this.computedStyle();
      },
      watch: {
        windowWidth(val) {
          this.computedStyle();
        },
        windowHeight(val) {
          this.computedStyle();
        },
        route(val) {
          this.computedStyle();
        }
      },
      methods: {
        computedStyle() {
          let route = this.route;
          let meta = route.meta;
          let windowWidth = this.windowWidth;
          let windowHeight = this.windowHeight;
          if (meta.isShowLeftSider) {
            this.layoutMarginLeft = 200;
            this.viewWidth = windowWidth - this.layoutMarginLeft;
          } else {
            this.layoutMarginLeft = 0;
            this.viewWidth = windowWidth;
          }
          if (meta.isShowHeader) {
            // iview fix header heiget 64px
            this.LayoutHeaderHeight = 48;
            this.viewHeight = windowHeight - this.LayoutHeaderHeight;
          } else {
            this.LayoutHeaderHeight = 0;
            this.viewHeight = windowHeight;
          }
        },
        handleRefresh() {
          window.location.reload();
        }
      },
      computed: {
        path() {
          return this.$route.path;
        },
        route() {
          console.log(this.$route.meta);
          return this.$route;
        },
        user() {
          return this.$store.state.user;
        }
      }
    }
</script>

<style scoped>

</style>
