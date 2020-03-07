<!--  -->
<template>
  <div class="users_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/users">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域，使用栅栏模式 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" class="input-with-select" v-model="queryinfo.query">
              <el-button slot="append" icon="el-icon-search" @click="search(queryinfo.query)"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="UsersList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱地址"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 状态栏 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="statechange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edituserdialog(scope.row)">编辑用户</el-button>
            <el-button type="info" size="mini" @click="allotuserdialog(scope.row)">修改角色</el-button>
            <el-button type="danger" size="mini" @click="deleteuser(scope.row.id)">删除用户</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalusers"
      ></el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="adddialogVisible" width="40%" @close="addresetform">
        <el-form
          ref="adduserFormRef"
          :model="adduserForm"
          :rules="adduserFormrules"
          label-width="80px"
          class="adduser_form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adduserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adduserForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="adduserForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adduserForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="editdialogVisible" width="40%" @close="editresetform">
        <el-form
          ref="edituserFormRef"
          :model="edituserForm"
          :rules="edituserFormrules"
          label-width="80px"
          class="edituser_form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="edituserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="edituserForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="edituserForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edituser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改角色的对话框 -->
      <el-dialog title="修改角色" :visible.sync="allotdialogVisible" width="40%" @close="allotresetform">
        <div class="text">当前用户：{{currentName}}</div>
        <div class="text">当前角色：{{currentRole}}</div>
        <div class="text">修改角色：
          <template>
            <el-select v-model="rolename" placeholder="请选择" @change="selectRole">
              <el-option
                v-for="item in RolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="allotdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRole">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的正则规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }
    //验证手机号的正则规则
    var checkMobile = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        // 合法的邮箱
        return callback()
      }

      callback(new Error('请输入合法的手机号'))
    }

    return {
      //保存用户数据
      UsersList: [],
      //请求数据的参数
      queryinfo: {
        //搜索数据
        query: '',
        //当前的page数
        pagenum: 1,
        //每页的条数
        pagesize: 5
      },
      //所有的数据的条数
      totalusers: null,
      //添加用户的对话框显示
      adddialogVisible: false,
      //添加用户
      adduserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      //添加用户的规则
      adduserFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //编辑用户的对话框显示
      editdialogVisible: false,
      //编辑用户
      edituserForm: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      //编辑用户的正则规则
      edituserFormrules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //修改角色
      allotdialogVisible:false,
      //用户的id
      UserId:"",
      currentName:"",
      currentRole:"",
      //获取角色的数据
      RolesList:[],
      //修改的角色
      rolename:"",
      //角色id
      RoleId:""
    }
  },

  created() {
    this.getUsersList()
  },

  components: {},

  methods: {
    // 获取用户信息
    async getUsersList() {
      const { data: result } = await this.$http.get('/users', {
        params: this.queryinfo
      })
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.UsersList = result.data.users
      this.totalusers = result.data.total
    },
    //获取每页展示几个
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getUsersList()
    },
    //跳转到第几页
    handleCurrentChange(newchange) {
      this.queryinfo.pagenum = newchange
      this.getUsersList()
    },
    //搜索用户
    search(data) {
      this.getUsersList()
    },
    //修改用户状态
    async statechange(info) {
      const { data: result } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.$message.success('用户状态更新成功')
    },
    //对话框关闭
    addresetform() {
      this.$refs.adduserFormRef.resetFields()
    },
    editresetform() {
      this.$refs.edituserFormRef.resetFields()
    },
    //添加用户
    adduser() {
      this.$refs.adduserFormRef.validate(valid => {
        if (!valid) {
          return
        }
        //提交的表单数据
        const data = this.adduserForm
        //发送添加用户请求
        this.$http.post('users', data).then(res => {
          const result = res.data
          if (result.meta.status !== 201) {
            //添加失败
            this.$message.error('添加用户失败！')
            this.adddialogVisible = false
          } else {
            //添加成功：弹框消失，有提示信息，页面自动刷新
            this.$message.success('添加用户成功！')
            this.adddialogVisible = false
            this.getUsersList()
          }
        })
      })
    },
    //编辑用户的对话框
    edituserdialog(data) {
      this.edituserForm.id = data.id
      this.edituserForm.username = data.username
      this.edituserForm.mobile = data.mobile
      this.edituserForm.email = data.email
      this.editdialogVisible = true
    },
    //编辑操作
    edituser() {
      this.$refs.edituserFormRef.validate(valid => {
        if (!valid) {
          return
        }
        //提交的表单数据
        const data = this.edituserForm
        //提交编辑操作
        this.$http
          .put('users/' + data.id, {
            id: data.id,
            email: data.email,
            mobile: data.mobile
          })
          .then(res => {
            const result = res.data
            if (result.meta.status !== 200) {
              //添加失败
              this.$message.error('编辑用户失败！')
              this.editdialogVisible = false
            } else {
              //添加成功：弹框消失，有提示信息，页面自动刷新
              this.$message.success('编辑用户成功！')
              this.editdialogVisible = false
              this.getUsersList()
            }
          })
      })
    },
    //删除用户
    deleteuser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$http.delete('users/' + id)
        }).then(res=> {
          const result = res.data
          if(result.meta.status !== 200){
            this.$message.error(result.meta.msg)
          }else{
            this.$message.success('删除用户成功！')
            this.getUsersList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //修改角色的对话框
    allotuserdialog(data){
      this.allotdialogVisible = true
      this.UserId = data.id
      this.currentName = data.username
      this.currentRole = data.role_name
      this.getRolesList()
    },
    //获取角色的数据
    getRolesList() {
      this.$http.get('roles').then(res => {
        this.RolesList = res.data.data
        //console.log(this.RolesList)
      })
    },
    //重置修改角色的对话框
    allotresetform(){
      this.rolename = ""
      this.RoleId = ""
    },
    //获取选择的角色id
    selectRole(event){
      //采用的是change事件，打印出来的event值就是绑定的id值
      this.RoleId = event
    },
    //修改角色事件
    allotRole(){
      if(!this.RoleId){
        return this.$message.error('请选择角色！')
      }

      this.$http.put(`users/${this.UserId}/role`,{ rid : this.RoleId }).then(res=>{
            const result = res.data
            if (result.meta.status !== 200) {
              //添加失败
              this.$message.error('修改角色失败！')
              this.allotdialogVisible = false
            } else {
              //添加成功：弹框消失，有提示信息，页面自动刷新
              this.$message.success('修改角色成功！')
              this.allotdialogVisible = false
              this.getUsersList()
            }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.text{
  font-size: 16px;
  margin-top: 10px;
}
</style>