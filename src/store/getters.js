const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.admin.token,
  avatar: state => state.admin.avatar,
  name: state => state.admin.name,
  introduction: state => state.admin.introduction,
  status: state => state.admin.status,
  menu: state => state.admin.menu,
  setting: state => state.admin.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters
