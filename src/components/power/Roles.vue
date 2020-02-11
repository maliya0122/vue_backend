<!--  -->
<template>
  <div class="roles_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/rights">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片界面 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary" @click="addrolesdialog">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table :data="RolesList" style="width: 100%" stripe border>
        <!-- 展开的数据 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 循环children数据  row:一行  -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['border-bottom', i1 === 0 ? 'border-top' : '','vcenter']"
            >
              <!-- 渲染第一层数据 col:一列-->
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染第二层和第三层数据  col:一列-->
              <el-col :span="19">
                <!-- 通过for循环嵌套循环第二层数据 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[ i2 === 0 ? '' : 'border-top','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- for循环嵌套第三层数据 -->
                  <el-col :span="13">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      @close="deleteright(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editrolesdialog(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteroles(scope.row.id)"
            >删除</el-button>
            <el-button type="info" icon="el-icon-star-off" size="small" @click="rightsdialog(scope.row)">权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addrolesdialogVisible" width="40%" @close="addresetform">
        <el-form
          ref="addrolesFormRef"
          :model="addrolesForm"
          :rules="addrolesFormrules"
          label-width="80px"
          class="addroles_form"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addrolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addrolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addrolesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addroles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色的对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editrolesdialogVisible" width="40%" @close="editresetform">
        <el-form
          ref="editrolesFormRef"
          :model="editrolesForm"
          :rules="editrolesFormrules"
          label-width="80px"
          class="editroles_form"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editrolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editrolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editrolesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editroles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog title="分配角色" :visible.sync="editrightsdialogVisible" width="60%" @close="rightsresetform">
        <el-tree :data="rightsList" :props="defaultProps"
                  ref='treeRef'
                  show-checkbox default-expand-all
                  node-key="id" :default-checked-keys="defaultRights"
                  ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editrightsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allocatedRights">确 定</el-button>
        </span>
      </el-dialog>
        

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据
      RolesList: [],
      //添加角色的对话框显示
      addrolesdialogVisible: false,
      //添加角色的表单数据
      addrolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色的正则
      addrolesFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //编辑角色的对话框显示
      editrolesdialogVisible: false,
      //编辑角色的表单数据
      editrolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //编辑角色的正则
      editrolesFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //角色的id
      RolesId: '',
      //分配角色的对话框显示
      editrightsdialogVisible :false,
      //权限数据的显示
      rightsList:[],
      //树形列表的展示配置
      defaultProps: {
          children: 'children',
          label: 'authName'
      },
      //默认展示的权限
      defaultRights:[],
      //分配权限
      allotRights:[]
    }
  },
  created() {
    this.getRolesList()
  },

  components: {},

  methods: {
    //获取角色的数据
    getRolesList() {
      this.$http.get('roles').then(res => {
        this.RolesList = res.data.data
        //console.log(this.RolesList)
      })
    },
    //删除角色对应的权限
    deleteright(role, rightid) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        })
        .then(res => {
          const result = res.data
          if (result.meta.status !== 200) {
            this.$message.error(result.meta.msg)
          } else {
            this.$message.success('删除权限成功！')
            //删除以后调用this.getRolesList，页面会自动刷新，会关闭
            //所以把role.children重新赋值，数据就会刷新，提升体验
            role.children = result.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //添加角色对话框
    addrolesdialog() {
      this.addrolesdialogVisible = true
    },
    //添加的对话框重置
    addresetform() {
      this.$refs.addrolesFormRef.resetFields()
    },
    //编辑角色的对话框重置
    editresetform() {
      this.$refs.editrolesFormRef.resetFields()
    },
    //添加角色
    addroles() {
      this.$refs.addrolesFormRef.validate(valid => {
        if (!valid) {
          return
        }
        //提交的表单数据
        const data = this.addrolesForm
        //发送添加角色请求
        this.$http.post('roles', data).then(res => {
          const result = res.data
          if (result.meta.status !== 201) {
            //添加失败
            this.$message.error('添加角色失败！')
            this.addrolesdialogVisible = false
          } else {
            //添加成功：弹框消失，有提示信息，页面自动刷新
            this.$message.success('添加角色成功！')
            this.addrolesdialogVisible = false
            this.getRolesList()
          }
        })
      })
    },
    //编辑角色的对话框
    editrolesdialog(data) {
      //将编辑角色的数据进行赋值
      this.editrolesdialogVisible = true
      this.RolesId = data.id
      this.editrolesForm.roleName = data.roleName
      this.editrolesForm.roleDesc = data.roleDesc
    },
    //编辑角色
    editroles() {
      this.$refs.editrolesFormRef.validate(valid => {
        if (!valid) {
          return
        }
        //提交的表单数据
        const data = this.editrolesForm
        //提交编辑操作
        this.$http.put('roles/' + this.editrolesid, data).then(res => {
          const result = res.data
            if (result.meta.status !== 200) {
              //添加失败
              this.$message.error('编辑角色失败！')
              this.editrolesdialogVisible = false
            } else {
              //添加成功：弹框消失，有提示信息，页面自动刷新
              this.$message.success('编辑角色成功！')
              this.editrolesdialogVisible = false
              this.getRolesList()
            }
        })
      })
    },
    //删除角色
    deleteroles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$http.delete('roles/' + id)
        }).then(res=> {
          const result = res.data
          if(result.meta.status !== 200){
            this.$message.error(result.meta.msg)
          }else{
            this.$message.success('删除角色成功！')
            this.getRolesList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //点击角色分配的对话框
    rightsdialog(data){
      //获取所有的权限数据
      this.$http.get('rights/tree').then(res=>{
        //console.log(res.data.data)
        this.rightsList = res.data.data
      })

      //给角色id赋值
      this.RolesId = data.id

      //弹框显示
      this.editrightsdialogVisible = true

      //获取角色对应的权限
      this.getdefaultRights(data,this.defaultRights)
    },
    //递归获取角色下的第三层权限
    getdefaultRights(node,arr){
      //如果没有children了，说明是最后一层
      if(!node.children){
        return arr.push(node.id)
      }else{
        node.children.forEach( value => {
          this.getdefaultRights(value,arr)
        })
      }
    },
    //重置分配权限的对话框
    rightsresetform(){
      this.defaultRights = []
    },
    //分配角色
    allocatedRights(){
      this.allotRights = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ].join(',')
      //console.log(this.allotRights)

      if(!this.allotRights){
        return this.$message.error('请选择权限！')
      }
      this.$http.post(`roles/${this.RolesId}/rights`,{ rids : this.allotRights }).then(res=>{
            const result = res.data
            if (result.meta.status !== 200) {
              //添加失败
              this.$message.error('分配角色失败！')
              this.editrightsdialogVisible = false
            } else {
              //添加成功：弹框消失，有提示信息，页面自动刷新
              this.$message.success('分配角色成功！')
              this.editrightsdialogVisible = false
              this.getRolesList()
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
.el-tag {
  margin: 10px;
}
.el-row {
  padding: 10px;
}
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>