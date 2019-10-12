<template>
  <div class="app-container">
    <p>菜单列表</p>
    <el-tree
      :data="menuList"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="data.isCreate === false" type="primary" size="mini" @click="appendRule(data)">添加权限</el-button>
          <el-button v-if="data.isUpdate === true" type="primary" size="mini" @click="updateRule(data)">修改</el-button>
          <!-- <el-button v-if="data.isCreate === true" type="danger" size="mini">禁用</el-button>-->
          <!-- <el-button type="danger" size="mini">删除权限</el-button>-->
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { addMenuRule, menuAll } from '@/api/admin'
export default {
  name: 'Menu',
  data() {
    return {
      menuList: [
        // {
        //   id: 1,
        //   label: '一级 1',
        //   children: [{
        //     id: 4,
        //     label: '二级 1-1',
        //     children: [{
        //       id: 9,
        //       label: '三级 1-1-1'
        //     }, {
        //       id: 10,
        //       label: '三级 1-1-2'
        //     }]
        //   }]
        // }
      ],
      menuRule: [],
      menuAll: []
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    // 初始化权限菜单
    initMenuList() {
      this.menuList.splice(0, this.menuList.length)
      const routes = this.$router.options.routes
      routes.forEach((value, index, array) => {
        if (value.rule !== false) {
          const menu = {
            id: value.name,
            label: value.meta.title,
            parentId: 0,
            isCreate: false,
            isUpdate: false,
            children: []
          }
          if (this.menuRule.includes(menu.id)) {
            menu.isCreate = true
          }
          value.children.forEach((val, i, arr) => {
            const children = {
              id: val.name,
              label: val.meta.title,
              isCreate: true,
              isUpdate: false,
              parentId: value.name
            }
            if (menu.isCreate) {
              children.isCreate = false
            }
            if (this.menuRule.includes(children.id)) {
              children.isCreate = true
            }
            if (this.menuAll[value.name] && !this.menuAll[value.name].includes(children.id)) {
              children.isUpdate = true
            }
            menu.children.push(children)
          })
          this.menuList.push(menu)
        }
      })
    },
    // 添加菜单权限
    appendRule(rule) {
      const post = {
        parent_id: rule.parentId,
        action_name: rule.id,
        name: rule.label,
        type: 1
      }
      if (rule.parentId !== 0) {
        post.type = 2
      }
      addMenuRule(post).then((res) => {
        if (res) {
          this.$message.success('添加成功')
          this.getListData()
        }
      })
    },
    // 获取列表
    getListData() {
      menuAll().then((res) => {
        this.menuRule = []
        this.menuAll = []
        if (res) {
          res.data.menu.forEach((value, index, array) => {
            this.menuRule.push(value.action_name)
            if (!this.menuAll[value.action_name] && (value.parent_id === 0 || value.parent_id === '0')) {
              this.menuAll[value.action_name] = []
            }
            if (value.parent_id !== 0 && value.parent_id !== '0') {
              this.menuAll[value.parent_name].push(value.action_name)
            }
          })
        }
        this.initMenuList()
      })
    },
    // 修改菜单权限
    updateRule() {}
  }
}
</script>

<style lang="scss" scoped>
</style>
<style>
/* 修改树形菜单默认高度 */
.el-tree-node__content {
  height : 36px ;
}
</style>
