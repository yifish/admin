<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button v-if="showCreate" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.adminAdd') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" row-key="adminId" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.adminId }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.roleName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.loginName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.loginTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.created_at')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="showUpdate" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="showDelete" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="listQuery.limit" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus=='create'" :label="$t('table.loginName')" prop="loginName">
          <el-input v-model="temp.loginName"/>
        </el-form-item>
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" :label="$t('table.password')" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item :label="$t('table.role')" prop="type">
          <el-select :placeholder="$t('table.pleaseSelect')" v-model="temp.roleId" class="filter-item">
            <el-option v-for="role in roleList" :key="role.key" :label="role.name" :value="role.roleId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminList, adminRoleAll, adminUpdate, adminCreate, adminDelete } from '@/api/admin'

export default {
  name: 'AdminList',
  components: {},
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      showCreate: false,
      showUpdate: false,
      showDelete: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: [],
      roleList: [],
      temp: {
        adminId: undefined,
        name: '',
        roleId: undefined,
        loginName: undefined,
        password: undefined
      },
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.create')
      },
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'competence'
    ])
  },
  created() {
    this.getList()
    // 获取所有角色列表
    this.getRoleAll()
    // 初始化权限
    this.showCompetence()
  },
  methods: {
    getList() {
      this.listLoading = true
      adminList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // console.log(this.list)
        this.oldList = this.list.map(v => v.adminId)
        this.newList = this.oldList.slice()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() { // 添加管理员
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp.name = ''
      this.temp.roleId = undefined
      this.temp.loginName = undefined
      this.temp.password = undefined
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      adminDelete(row).then(response => {
        if (response) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    getRoleAll() {
      adminRoleAll({}).then(response => {
        // console.log(response)
        this.roleList = response.data
      })
    },
    updateData() { // 修改管理员信息
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log(this.temp)
          const tempData = Object.assign({}, this.temp)
          adminUpdate(tempData).then(response => {
            // console.log(response)
            if (response) {
              for (const v of this.list) {
                if (v.adminId === this.temp.adminId) {
                  const index = this.list.indexOf(v)
                  const tempData = Object.assign({}, this.temp)
                  this.list.splice(index, 1, tempData)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log(this.temp)
          const tempData = Object.assign({}, this.temp)
          adminCreate(tempData).then(response => {
            if (response) {
              this.resetTemp()
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    showCompetence() {
      // console.log(this.competence)
      if (this.competence.indexOf('adminCreate') > 0) {
        this.showCreate = true
      }
      if (this.competence.indexOf('adminUpdate') > 0) {
        this.showUpdate = true
      }
      if (this.competence.indexOf('adminDelete') > 0) {
        this.showDelete = true
      }
    }
  }
}
</script>
