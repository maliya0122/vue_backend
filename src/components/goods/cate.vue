<!--  -->
<template>
  <div class="cate_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/categories">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="addCateDialog">添加分类</el-button>
      <!-- 表格tree -->
      <zk-table ref="zktable" :data="AllCates" :columns="columns" border class="zk-table"
                show-index :expand-type="false" :selection-type="false">
        <!-- 是否有效  -->
        <template slot="isok" slot-scope="scopes">
            <i class="el-icon-success" style="color: lightgreen;" v-if="!scopes.row.cat_deleted"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scopes">
            <el-tag v-if="scopes.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scopes.row.cat_level === 1">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="options" slot-scope="scopes">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>

      </zk-table>

      <!-- 添加分类的对话框 -->
      <el-dialog title="添加分类" :visible.sync="addotdialogVisible" width="50%" @close="addotresetform">

          <el-form
            ref="addcateFormRef"
            :model="addcateForm"
            :rules="addcateFormrules"
            label-width="80px"
            class="addcate_form"
          >
            <!-- 分类名称 -->
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addcateForm.cat_name"></el-input>
            </el-form-item>
            <!-- 父类级别 -->
            <el-form-item label="父类级别">
                <div class="block">
                    <el-cascader
                        clearable
                        expand-trigger="hover"
                        v-model="selectedvalue"
                        :options="parentcates"
                        :props="props"
                        change-on-select
                        @change="addcateChange"
                    >
                    </el-cascader>
                </div>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addotdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addcate">确 定</el-button>
          </span>
      </el-dialog>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
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
      //获取页面的全部分类数据
      AllCates: [],
      //查询的数据
      queryinfo: {
        //数据类型
        type: '',
        //当前的page数
        pagenum: 1,
        //每页的条数
        pagesize: 5
      },
      //总数
      total: 0,
      //zk-table每一列的配置
      columns:[
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            type: 'template',
            template: 'isok',
          },
          {
            label: '排序',
            prop: 'cat_level',
            type: 'template',
            template: 'order',
          },
          {
            label: '操作',
            type: 'template',
            template: 'options',
          },
      ],
      //添加分类的对话框显示
      addotdialogVisible:false,
      //添加分类的表单数据
      addcateForm:{
          cat_name : "",
          cat_pid : 0,
          cat_level : 0
      },
      //添加分类的正则
      addcateFormrules:{
          cat_name : [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
      },
      //父级分类的选中数据
      selectedvalue:[],
      //cascade的数据源
      parentcates:[],
      //props配置
      props:{
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
      }
    }
  },

  created() {
    this.getAllCates()
  },

  components: {},

  methods: {
    //获取所有的分类数据
    getAllCates() {
      this.$http.get('categories', { params: this.queryinfo }).then(res => {
        const result = res.data
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        this.AllCates = result.data.result
        this.total = result.data.total
        //console.log(this.AllCates)
      })
    },
    //添加分类的对话框显示
    addCateDialog(){
        this.addotdialogVisible = true
        this.getparentCate()
    },
    //添加分类的操作
    addcate(){
        this.$refs.addcateFormRef.validate(valid=>{
            if (!valid) {
                return
            }
            //提交的表单数据
            const data = this.addcateForm
            //发送请求
            this.$http.post('categories', data).then(res => {
                const result = res.data
                if (result.meta.status !== 201) {
                    //添加失败
                    this.$message.error('添加分类失败！')
                    this.addotdialogVisible = false
                } else {
                    //添加成功：弹框消失，有提示信息，页面自动刷新
                    this.$message.success('添加分类成功！')
                    this.addotdialogVisible = false
                    this.getAllCates()
                }
             })
        })
    },
    //重置添加分类的对话框
    addotresetform(){
        this.$refs.addcateFormRef.resetFields()
        this.selectedvalue = ""
    },
    //获取父级分类数据
    getparentCate(){
        const data = { type : 2 }
        this.$http.get('categories', { params: data }).then(res => {
            
        const result = res.data
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }

        this.parentcates = result.data
        //console.log(this.parentcates)
      })
    },
    //选中父级分类后，重新给表单数据赋值
    addcateChange(){
        //如果是选中了父级
        if(this.selectedvalue.length > 0){
            this.addcateForm.cat_pid = this.selectedvalue[this.selectedvalue.length-1]
            this.addcateForm.cat_level = this.selectedvalue.length
        }else{
            //没有选父级
            this.addcateForm.cat_pid = 0
            this.addcateForm.cat_level = 0
        }
    },
    handleSizeChange(newsize){
        this.queryinfo.pagesize = newsize
        this.getAllCates()
    },
    handleCurrentChange(newchange){
        this.queryinfo.pagenum = newchange
        this.getAllCates()
    }
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}
.zk-table{
    margin-top: 20px;
}
</style>