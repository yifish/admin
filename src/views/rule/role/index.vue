<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editData(null, -1, 'create')">
        新增角色
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
        <el-form-item label="名称">
          <el-input v-model="value.name" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="value.is_use">
            <el-radio :label="'0'">否</el-radio>
            <el-radio :label="'1'">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            v-if="isRoleTree"
            ref="roleTree"
            :data="menuList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="roleTreeDefaultExpanded"
            @check-change="changeRoleTree"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="formType === 'update'" type="primary" @click="editRole">修改</el-button>
        <el-button v-if="formType === 'create'" type="primary" @click="addRole">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, menuAll, addRole, updateRole } from '@/api/admin'

export default {
  name: 'Role',
  data() {
    return {
      listLoading: false,
      isRoleTree: false,
      showForm: false,
      list: [],
      menuAll: [],
      count: 0,
      dataIndex: -1,
      menuList: [],
      value: {
        is_use: '1',
        name: '',
        action_name: ''
      },
      saveTitle: {
        'create': '新增角色',
        'update': '修改角色'
      },
      formType: 'create',
      form: {
        page: 1,
        size: 20
      },
      columns: [
        {
          label: 'ID',
          prop: 'role_id'
        },
        {
          label: '昵称',
          prop: 'name'
        },
        {
          label: '创建时间',
          prop: 'create_time'
        },
        {
          label: '操作',
          slot: true
        }
      ],
      modelRoleTree: [],
      roleTreeDefaultExpanded: []
    }
  },
  created() {
    this.getMenuAll()
    this.getListData()
  },
  methods: {
    getListData() {
      this.listLoading = true
      roleList(this.form).then((res) => {
        this.listLoading = false
        // console.log(res)
        if (res.data) {
          this.list = res.data.list
          this.count = parseInt(res.data.count)
        }
      })
    },
    editData(row, index, formType) {
      this.initMenuList(row)
      this.formType = formType
      this.showForm = true
      this.dataIndex = index
      if (row !== null) {
        this.value = JSON.parse(JSON.stringify(row))
      } else {
        this.value = {
          is_use: '1',
          name: '',
          action_name: ''
        }
      }
    },
    handleSizeChange(page) {
      console.log(page)
    },
    // 点击数字
    handleCurrentChange(page) {
      this.form.page = page
      this.getListData()
    },
    editRole() {
      const param = JSON.parse(JSON.stringify(this.value))
      const roleTree = []
      this.menuList.forEach((value, index, array) => {
        let isMenu = false
        value.children.forEach((v, i, arr) => {
          if (this.modelRoleTree.indexOf(v.id) !== -1) {
            roleTree.push(v.id)
            isMenu = true
          }
        })
        if (isMenu) {
          roleTree.push(value.id)
        }
      })
      param.action_name = roleTree.join(',')
      updateRole(param).then((res) => {
        if (res) {
          this.$message.success('修改成功')
          this.cancel()
          this.form.page = 1
          this.getListData()
        }
      })
    },
    addRole() {
      const param = JSON.parse(JSON.stringify(this.value))
      const roleTree = []
      this.menuList.forEach((value, index, array) => {
        let isMenu = false
        value.children.forEach((v, i, arr) => {
          if (this.modelRoleTree.indexOf(v.id) !== -1) {
            roleTree.push(v.id)
            isMenu = true
          }
        })
        if (isMenu) {
          roleTree.push(value.id)
        }
      })
      param.action_name = roleTree.join(',')
      addRole(param).then((res) => {
        if (res) {
          this.$message.success('新增成功')
          this.cancel()
          this.form.page = 1
          this.getListData()
        }
      })
    },
    // 获取权限数据
    getMenuAll() {
      menuAll().then((res) => {
        this.menuAll = []
        if (res) {
          res.data.menu.forEach((value, index, array) => {
            this.menuAll.push(value.action_name)
          })
        }
      })
    },
    cancel() {
      this.showForm = false
    },
    // 初始化权限菜单
    initMenuList(row) {
      this.isRoleTree = false
      // 默认选中
      const roleTreeDefaultCheck = []
      this.roleTreeDefaultExpanded = []
      let actionName = ''
      if (row !== null) {
        actionName = row.action_name
      }
      actionName = actionName.split(',')
      this.modelRoleTree = actionName
      this.menuList.splice(0, this.menuList.length)
      const routes = this.$router.options.routes
      routes.forEach((value, index, array) => {
        if (value.rule !== false) {
          if (this.menuAll.includes(value.name)) {
            const menu = {
              id: value.name,
              label: value.meta.title,
              parentId: 0,
              children: []
            }
            value.children.forEach((val, i, arr) => {
              if (this.menuAll.includes(val.name)) {
                const children = {
                  id: val.name,
                  label: val.meta.title,
                  parentId: value.name
                }
                menu.children.push(children)
              }
              if (actionName.includes(val.name)) {
                roleTreeDefaultCheck.push(val.name)
                this.roleTreeDefaultExpanded.push(val.name)
              }
            })
            this.menuList.push(menu)
          }
        }
      })
      this.isRoleTree = true
      this.setTreeKeys('roleTree', roleTreeDefaultCheck, true)
    },
    setTreeKeys(tree, list, bool) {
      this.$nextTick(() => {
        this.$refs[tree].setCheckedKeys(list, bool)
      })
    },
    // role树形选择事件
    // 参数 data 该节点所对应的对象、myBool 节点本身是否被选中、nextElement 节点的子树中是否有被选中的节点
    changeRoleTree(data, myBool, nextElement) {
      const index = this.modelRoleTree.indexOf(data.id)
      if (index === -1 && (myBool === true || nextElement === true)) {
        this.modelRoleTree.push(data.id)
      }
      if (index !== -1 && myBool === false && nextElement === false) {
        this.modelRoleTree.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
