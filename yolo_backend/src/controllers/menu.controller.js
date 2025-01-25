const createError = require('http-errors');
const Response = require('../utils/response');
const MenuService = require('../services/menu.service');

class MenuController {
  constructor() {
    this.menuService = new MenuService();
  }

  /**
   * 创建菜单
   */
  async createMenu(req, res, next) {
    try {
      const { title, code, path, icon, parentCode, sort = 0 } = req.body;
      
      // 验证必填字段
      if (!title || !code || !path) {
        throw createError(400, '标题、编码和路径为必填项');
      }

      const menu = await this.menuService.createMenu({
        title,
        code,
        path,
        icon,
        parentCode,
        sort,
        createdBy: req.user.username,
        updatedBy: req.user.username
      });

      res.json(Response.success(menu, '菜单创建成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新菜单
   */
  async updateMenu(req, res, next) {
    try {
      const { code } = req.params;
      const { title, path, icon, parentCode, sort } = req.body;

      const menu = await this.menuService.updateMenu(code, {
        title,
        path,
        icon,
        parentCode,
        sort,
        updatedBy: req.user.username
      });

      if (!menu) {
        throw createError(404, '菜单不存在');
      }

      res.json(Response.success(menu, '菜单更新成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除菜单
   */
  async deleteMenu(req, res, next) {
    try {
      const { code } = req.params;
      const result = await this.menuService.deleteMenu(code);
      
      if (!result) {
        throw createError(404, '菜单不存在');
      }

      res.json(Response.success(null, '菜单删除成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取菜单列表（树形结构）
   */
  async getMenuTree(req, res, next) {
    try {
      const menuTree = await this.menuService.getMenuTree();
      res.json(Response.success(menuTree));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取所有菜单（平铺结构）
   */
  async getAllMenus(req, res, next) {
    try {
      const menus = await this.menuService.getAllMenus();
      res.json(Response.success(menus));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MenuController;
