<!--  -->
<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px' : '200px'">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          unique-opened
          :default-active="activepath"
        >
          <!-- 折叠/展开按钮 -->
          <div class="toggle" @click="toggle">三</div>
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in MenuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="savepath('/'+subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体页面 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      MenuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activepath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activepath = window.sessionStorage.getItem('activepath');
  },
  components: {},

  computed: {},

  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取菜单数据
    async getMenuList() {
      const { data: result } = await this.$http.get('/menus')
      //console.log(result);
      if (result.meta.status !== 200){
        return this.$message.error(result.meta.msg)
      }
      this.MenuList = result.data
    },
    //切换折叠效果
    toggle(){
      this.isCollapse = !this.isCollapse
    },
    //保存激活路径
    savepath(activepath){
      window.sessionStorage.setItem('activepath',activepath)
      this.activepath = activepath
    }
  }
}
</script>
<style lang='less' scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      color: #fff;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 20px;
      }
      span {
        font-size: 25px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: 0;
    }
    .toggle{
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #999;
      color: #fff;
      text-align: center;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
}
</style>