<!--  -->
<template>
  <div class="goods_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/categories">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="命名参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="基本图片"></el-step>
        <el-step title="命名内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单和左侧导航栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeleave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="catelist"
                :props="props"
                v-model="addForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="命名参数" name="1">命名参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="基本图片" name="3">
            <el-upload
              class="upload-demo"
              :action="url"
              :headers="header"
              list-type="picture"
              :on-success="filesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="命名内容" name="4">命名内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条显示的index
      activeIndex: '0',
      //添加商品
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //分类列表
      catelist: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      url:'http://127.0.0.1:8888/api/private/v1/upload',
      header:{ Authorization: window.sessionStorage.getItem('token') }
    }
  },

  created() {
    this.getcatelist()
  },

  components: {},

  methods: {
    getcatelist() {
      this.$http.get('/categories').then(res => {
        const result = res.data
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        this.catelist = result.data

        //console.log(this.catelist)
      })
    },
    beforeleave(activeName, oldActiveName){
      if(oldActiveName === '0'){
        if(!this.addForm.goods_cat.length){
          this.$message.error('请选择商品参数！')
          return false
        }
      }
    },
    filesuccess(response){
      //console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    }
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 20px;
}
</style>