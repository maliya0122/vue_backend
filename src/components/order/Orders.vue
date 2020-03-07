<!--  -->
<template>
  <div class="orders_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/orders">订单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="OrdersList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单号" width="230px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay == 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间" width="230px">
          <template slot-scope="scope">{{scope.row.create_time | showDate}}</template>
        </el-table-column>

        <!-- 操作栏 -->
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editdialog(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-s-promotion"
              size="mini"
              @click="addressdialog(scope.row)"
            ></el-button>
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

      <!-- 编辑的对话框 -->
      <el-dialog title="添加地址" :visible.sync="editdialogVisible" width="50%" @close="editresetform">
        <!-- 表单数据 -->
        <el-form
          ref="editFormRef"
          :model="editordersForm"
          :rules="editordersFormrules"
          label-width="120px"
          class="addroles_form"
        >
          <el-form-item label="省市区/县" prop="province">
            <el-cascader v-model="editordersForm.province" :options="citydata"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="editordersForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 地址的对话框 -->
      <el-dialog title="物流信息" :visible.sync="aaddressdialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in addressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '../../common/ultils'
import citydata from './citydata'
export default {
  data() {
    return {
      //订单列表
      OrdersList: [],
      queryinfo: {
        //搜索数据
        query: '',
        //当前的page数
        pagenum: 1,
        //每页的条数
        pagesize: 10
      },
      total: null,
      editdialogVisible: false,
      editordersForm: {
        province: null,
        address: null
      },
      editordersFormrules: {
        province: [{ required: true, message: '请选择省市', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      citydata: citydata,
      aaddressdialogVisible: false,
      addressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    //获取订单数据
    getOrdersList() {
      this.$http.get('/orders', { params: this.queryinfo }).then(res => {
        this.OrdersList = res.data.data.goods
        this.total = res.data.data.total
        //console.log(this.OrdersList)
      })
    },
    //获取每页展示几个
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getOrdersList()
    },
    //跳转到第几页
    handleCurrentChange(newchange) {
      this.queryinfo.pagenum = newchange
      this.getOrdersList()
    },
    //编辑事件
    editdialog() {
      this.editdialogVisible = true
    },
    //地址事件
    async addressdialog(id) {
      console.log(id)
      this.aaddressdialogVisible = true
      //获取物流信息
      let { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.addressInfo = res.data
      console.log(this.addressInfo)
    },
    //重置对话框
    editresetform() {
      this.$refs.editFormRef.resetFields()
    },
    //选择器
    handleChange() {},
    //搜索
    search(){
      this.getOrdersList()
    }
  },
  filters: {
    //格式化时间
    showDate(value) {
      let date = new Date(value * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
.el-cascader {
  width: 100%;
}
</style>