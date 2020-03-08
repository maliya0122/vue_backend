<!--  -->
<template>
  <div class="params_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/goods">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <!-- 级联选择器 -->
      <el-row :gutter="10">
        <span>选择商品分类</span>
        <el-cascader
          expand-trigger="hover"
          :options="cateList"
          :props="props"
          v-model="cateInfo"
          @change="handleChange"
        ></el-cascader>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 标签页：动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" :disabled="isbtndisabled" @click="addDialog">添加参数</el-button>

          <!-- 表格区域 -->
          <el-table :data="cateTabData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(i,scope.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteattr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 标签页：静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isbtndisabled" @click="addDialog">添加属性</el-button>

          <!-- 表格区域 -->
          <el-table :data="cateTabData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(i,scope.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteattr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数的对话框 -->
      <el-dialog
        :title="'添加'+formtext"
        :visible.sync="adddialogVisible"
        width="50%"
        @close="addresetform"
      >
        <el-form ref="addFormRef" :model="addForm" :rules="addFormrules" label-width="80px">
          <el-form-item :label="formtext" prop="attr">
            <el-input v-model="addForm.attr"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttr">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      //配置项
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //级联选择器选中的值
      cateInfo: [],
      activeName: 'many',
      //表格数据
      cateTabData: [],
      //添加参数的对话框显示
      adddialogVisible: false,
      //参数项
      addForm: {
        attr: ''
      },
      addFormrules: {
        attr: [{ required: true, message: '请输入数据', trigger: 'blur' }]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getcateList()
  },
  methods: {
    getcateList() {
      this.$http.get('/categories').then(res => {
        const result = res.data
        if (result.meta.status !== 200) {
          this.$message.error('获取分类数据失败！')
        }
        this.cateList = result.data
        //console.log(this.cateList)
      })
    },
    //级联选择器的change事件
    handleChange(value) {
      if (value.length !== 3) {
        this.cateInfo = []
        this.cateTabData = []
      }else{
        this.getcateTabData()
      }
    },
    //标签页切换事件
    handleTabClick(tab) {
      this.activeName = tab.name
      if (this.cateInfo.length == 3) {
        this.getcateTabData()
      }
    },
    //获取参数数据
    getcateTabData() {
      //获取参数的数据
      this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } }).then(res => {
        const result = res.data
        if (result.meta.status !== 200) {
          this.$message.error('获取分类数据失败！')
        }

        //把attr_vals切割成数组
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })

        this.cateTabData = result.data
        console.log(this.cateTabData)
      })
    },
    //添加参数的按钮
    addDialog() {
      this.adddialogVisible = true
    },
    //重置对话框
    addresetform() {
      this.$refs.addFormRef.resetFields()
    },
    //添加参数
    addAttr() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }
        const data = {
          attr_name: this.addForm.attr,
          attr_sel: this.activeName
        }
        this.$http.post(`categories/${this.cateId}/attributes`, data).then(res => {
          const result = res.data
          if (result.meta.status !== 201) {
            this.$message.error('获取分类数据失败！')
          }
          this.adddialogVisible = false
          this.$message.success('添加参数成功！')
          this.getcateTabData()
        })
      })
    },
    //删除参数
    deleteattr(data) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$http.delete(`categories/${this.cateId}/attributes/${data.attr_id}`)
        })
        .then(res => {
          const result = res.data
          if (result.meta.status !== 200) {
            this.$message.error(result.meta.msg)
          } else {
            this.$message.success('删除参数成功！')
            this.getcateTabData()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //点击tag，进行添加
    handleInputConfirm(row){
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue);
        //发送请求，添加参数保存参数
        this.getTagData(row)
      }
      row.inputVisible = false;
      row.inputValue = '';
    },
    showInput(row){
      row.inputVisible = true;
      //自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag
    handleClose(i,row){
      row.attr_vals.splice(i, 1);
      this.getTagData(row);
    },
    //删除，添加tag的方法
    getTagData(row){
      const data = {
          attr_name : row.attr_name,
          attr_sel : this.activeName,
          attr_vals : row.attr_vals.join(' ')
        }
        this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,data).then(res=>{
          const result = res.data
          if (result.meta.status !== 200) {
            this.$message.error('获取分类数据失败！')
          }
          this.$message.success('添加参数成功！')
        })
    }
  },
  computed: {
    //按钮是否是disabled
    isbtndisabled() {
      if (this.cateInfo.length == 3) {
        return false
      }
      return true
    },
    //分类id
    cateId() {
      if (this.cateInfo.length == 3) {
        return this.cateInfo[2]
      }
    },
    //formtext
    formtext() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}
.el-alert {
  margin-bottom: 20px;
}
.el-cascader {
  margin-left: 10px;
}
.el-tabs {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
.el-tag{
  margin-right: 10px;
  margin-bottom:10px;
}
.input-new-tag{
  width: 120px;
}
</style>