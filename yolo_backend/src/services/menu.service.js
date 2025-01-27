const Menu = require('../models/menu.model');
const Permission = require('../models/permission.model');
const createError = require('http-errors');

class MenuService {
  /**
   * 创建菜单
   */
  async createMenu(menuData) {
    // 检查菜单编码是否已存在
    const existingMenu = await Menu.findOne({ code: menuData.code });
    if (existingMenu) {
      throw createError(400, '菜单编码已存在');
    }

    // 如果有父菜单，检查父菜单是否存在
    if (menuData.parentCode) {
      const parentMenu = await Menu.findOne({ code: menuData.parentCode });
      if (!parentMenu) {
        throw createError(400, '父菜单不存在');
      }
    }

    const menu = new Menu(menuData);
    await menu.save();
    return menu;
  }

  /**
   * 更新菜单
   */
  async updateMenu(code, updateData) {
    // 如果要更新父菜单，检查父菜单是否存在
    if (updateData.parentCode) {
      const parentMenu = await Menu.findOne({ code: updateData.parentCode });
      if (!parentMenu) {
        throw createError(400, '父菜单不存在');
      }

      // 检查是否将菜单设为自己的子菜单
      if (updateData.parentCode === code) {
        throw createError(400, '不能将菜单设为自己的子菜单');
      }
    }

    const menu = await Menu.findOneAndUpdate(
      { code },
      { $set: updateData },
      { new: true }
    );

    return menu;
  }

  /**
   * 删除菜单
   */
  async deleteMenu(code) {
    // 检查是否有子菜单
    const hasChildren = await Menu.exists({ parentCode: code });
    if (hasChildren) {
      throw createError(400, '请先删除子菜单');
    }

    // 检查是否有用户在使用此菜单
    const hasUsers = await Permission.exists({ menuCodes: code });
    if (hasUsers) {
      throw createError(400, '有用户正在使用此菜单，无法删除');
    }

    const result = await Menu.findOneAndDelete({ code });
    return result;
  }

  /**
   * 获取菜单树
   */
  async getMenuTree() {
    const menus = await Menu.find().sort({ sort: 1 });
    return this._buildMenuTree(menus);
  }

  /**
   * 获取所有菜单（平铺结构）
   */
  async getAllMenus() {
    return Menu.find().sort({ sort: 1 });
  }

  /**
   * 构建菜单树
   * @private
   */
  _buildMenuTree(menus, parentCode = null) {
    const tree = [];
    
    for (const menu of menus) {
      if (menu.parentCode === parentCode) {
        const node = menu.toObject();
        node.menuId = node._id;
        delete node._id;
        const children = this._buildMenuTree(menus, menu.code);
        if (children.length) {
          node.children = children;
        }
        tree.push(node);
      }
    }
    
    return tree;
  }
}

module.exports = MenuService;
