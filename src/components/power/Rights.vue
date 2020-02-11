<!--  -->
<template>
  <div class="rights_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/rights">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 权限列表 -->
      <el-table :data="RightsList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 0">等级一</el-tag>
                <el-tag type="success" v-else-if="scope.row.level == 1">等级二</el-tag>
                <el-tag type="danger" v-if="scope.row.level == 2">等级三</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RightsList: []
    }
  },

  created() {
    this.getRightsList()
  },

  components: {},

  methods: {
    getRightsList() {
      this.$http.get('rights/list').then(res => {
        this.RightsList = res.data.data
        console.log(this.RightsList)
      })
    }
  }
}
</script>
<style lang='less' scoped>
.el-card{
    margin-top: 20px;
}

</style>