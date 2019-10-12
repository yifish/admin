<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editData({}, -1, 'create')">
        新增管理员
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      empty-text="暂无数据"
      style="width: 100%"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        align="center"
        :fixed="item.fixed"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="{ row }">
          <template v-if="!item.slot">
            {{ row[item.prop] }}
          </template>
          <template v-else>
            <el-button type="primary" @click="editData(row, index, 'update')">编辑</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        :current-page.sync="form.page"
        layout="total, prev, pager, next, jumper"
        :page-size="form.size"
        :total="count"
        :prev-text="'上一页'"
        :next-text="'下一页'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="saveTitle[formType]" :visible.sync="showForm">
      <el-form ref="form" :model="value" label-width="80px">
        <el-form-item label="登录账号">
          <template v-if="formType === 'update'">{{ value.username }}</template>
          <template v-else><el-input v-model="value.username" /></template>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="value.name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="value.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="formType === 'update'" type="primary" @click="editAdmin">修改</el-button>
        <el-button v-if="formType === 'create'" type="primary" @click="addAdmin">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminList, updateAdmin, addAdmin } from '@/api/admin'

export default {
  name: 'Admin',
  data() {
    return {
      listLoading: false,
      showForm: false,
      list: [],
      count: 0,
      dataIndex: -1,
      value: {},
      saveTitle: {
        'create': '新增管理员',
        'update': '修改管理员'
      },
      formType: 'create',
      form: {
        page: 1,
        size: 20
      },
      columns: [
        {
          label: 'ID',
          prop: 'admin_id'
        },
        {
          label: '登录账号',
          prop: 'username'
        },
        {
          label: '昵称',
          prop: 'name'
        },
        {
          label: '登录时间',
          prop: 'login_time'
        },
        {
          label: '登录ip',
          prop: 'login_ip'
        },
        {
          label: '创建时间',
          prop: 'create_time'
        },
        {
          label: '操作',
          slot: true
        }
      ]
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      this.listLoading = true
      getAdminList(this.form).then((res) => {
        this.listLoading = false
        // console.log(res)
        if (res.data) {
          this.list = res.data.list
          this.count = parseInt(res.data.count)
        }
      })
    },
    editData(row, index, formType) {
      this.formType = formType
      this.showForm = true
      this.dataIndex = index
      this.value = JSON.parse(JSON.stringify(row))
    },
    handleSizeChange(page) {
      console.log(page)
    },
    // 点击数字
    handleCurrentChange(page) {
      this.form.page = page
      this.getListData()
    },
    editAdmin() {
      updateAdmin(this.value).then((res) => {
        if (res) {
          this.$message.success('修改成功')
          this.cancel()
          this.getListData()
        }
      })
    },
    addAdmin() {
      addAdmin(this.value).then((res) => {
        if (res) {
          this.$message.success('新增成功')
          this.cancel()
          this.form.page = 1
          this.getListData()
        }
      })
    },
    cancel() {
      this.showForm = false
      this.value = {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
