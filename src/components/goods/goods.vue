<!--  -->
<template>
  <div class="goods_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/categories">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>

      <!-- 搜索区域，使用栅栏模式 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" class="input-with-select" v-model="queryinfo.query">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addProduct">添加商品</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="GoodsList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="130px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time}}
          </template>
        </el-table-column>

        <!-- 操作栏 -->
        <el-table-column label="操作" width="200px">
          <template>
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>


    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //保存用户数据
      GoodsList: [],
      queryinfo: {
        //搜索数据
        query: '',
        //当前的page数
        pagenum: 1,
        //每页的条数
        pagesize: 10
      },
      //数据总数
      total:0
    }
  },

  components: {},
  created(){
    this.getGoodsList()
  },

  methods: {
    //获取商品列表数据
    getGoodsList(){
      this.$http.get('/goods', { params: this.queryinfo }).then(res=>{
        this.GoodsList = res.data.data.goods
        this.total = res.data.data.total
        console.log(this.GoodsList)
      })
      
    },
    //获取每页展示几个
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getGoodsList()
    },
    //跳转到第几页
    handleCurrentChange(newchange) {
      this.queryinfo.pagenum = newchange
      this.getGoodsList()
    },
    search(){
      this.getGoodsList()
    },
    //添加商品按钮
    addProduct(){
      this.$router.push('/add')
    }
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}

</style>