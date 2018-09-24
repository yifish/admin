<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button v-if="showCreate" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.roleAdd') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" row-key="adminId" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
      <el-pagination :current-page="listQuery.page" :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>

        <el-form-item :label="$t('table.competenceList')">
          <el-tree
            ref="competenceList"
            :data="competenceList"
            :accordion="true"
            :props="defaultProps"
            :default-expand-all="true"
            node-key="enName"
            show-checkbox
            @check-change="handleCheckChange"
          />
        </el-form-item>

        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
        </div>

      </el-form>

    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { roleList, getCompetenceList, roleCreate, roleUpdate, roleDelete } from '@/api/role'

export default {
  name: 'RoleList',
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
      competenceList: [],
      checkedCompetenceList: [],
      checkedCompetenceTemp: [],
      defaultProps: {
        children: 'competence',
        label: 'name'
      },
      temp: {
        name: '',
        competence: '',
        roleId: undefined
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
    // 初始化权限
    this.showCompetence()
    this.getCompetenceList()
  },
  methods: {
    getList() {
      this.listLoading = true
      roleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // console.log(this.list)
        this.oldList = this.list.map(v => v.roleId)
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
    getCompetenceList() {
      getCompetenceList({}).then(response => {
        if (response) {
          this.competenceList = response.data
        }
      })
    },
    // 选中权限列表返回事件
    handleCheckChange(data, checked, parentChecked) {
      if (checked || parentChecked) {
        if (this.checkedCompetenceList.indexOf(data.enName) < 0) {
          this.checkedCompetenceList.push(data.enName)
        }
      } else {
        const index = this.checkedCompetenceList.indexOf(data.enName)
        if (index > -1) {
          this.checkedCompetenceList.splice(index, 1)
        }
      }
    },
    handleCreate() { // 添加角色
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.competenceList.setCheckedKeys([], false)
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) { // 修改角色
      this.temp = Object.assign({}, row)
      this.checkedCompetenceList = []
      this.checkedCompetenceTemp = []
      this.showCheckedCompetence(this.competenceList, this.temp.competence.split(','))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.competenceList.setCheckedKeys(this.checkedCompetenceTemp)
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) { // 删除角色
      this.temp = Object.assign({}, row)
      roleDelete(this.temp).then(response => {
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
    // 初始化权限栏
    showCheckedCompetence(competenceList, competence) {
      competenceList.map(value => {
        if (competence.indexOf(value.enName) >= 0 || competence.indexOf('*') >= 0) {
          if (!value.competence || competence.indexOf('*') >= 0) {
            this.checkedCompetenceTemp.push(value.enName)
          }
          this.checkedCompetenceList.push(value.enName)
        }
        if (value.competence && value.competence.length > 0) {
          this.showCheckedCompetence(value.competence, competence)
        }
      })
    },
    // 显示权限的方法
    showCompetence() {
      // console.log(this.competence)
      if (this.competence.indexOf('roleCreate') > 0) {
        this.showCreate = true
      }
      if (this.competence.indexOf('roleUpdate') > 0) {
        this.showUpdate = true
      }
      if (this.competence.indexOf('roleDelete') > 0) {
        this.showDelete = true
      }
    },
    // 添加角色方法
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.competence = this.checkedCompetenceList.join(',')
          roleCreate(tempData).then(response => {
            if (response) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 修改角色
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.competence = this.checkedCompetenceList.join(',')
          const tempData = Object.assign({}, this.temp)
          roleUpdate(tempData).then(response => {
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
    // 重置编辑对象
    resetTemp() {
      this.checkedCompetenceList = []
      this.temp.roleId = undefined
      this.temp.competence = ''
      this.temp.name = ''
    }
  }
}
</script>

<style>
  .dialog-footer{
    text-align: right;
  }
</style>
