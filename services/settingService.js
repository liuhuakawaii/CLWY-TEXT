const { Setting } = require('../models');
const { NotFoundError } = require('../utils/response');

class SettingService {
  /**
   * 获取系统设置
   * 由于系统设置通常只有一条记录，获取第一条记录
   */
  static async getSettings() {
    const settings = await Setting.findOne();
    if (!settings) {
      throw new NotFoundError('Settings not found');
    }
    return settings;
  }

  /**
   * 更新系统设置
   * 如果设置不存在，则创建新的设置记录
   */
  static async updateSettings(settingsData) {
    const filteredData = this.filterAllowedFields(settingsData);

    // 尝试获取现有设置
    let settings = await Setting.findOne();

    if (settings) {
      // 更新现有设置
      await settings.update(filteredData);
      return settings;
    } else {
      // 创建新设置（防止没有初始数据的情况）
      return await Setting.create(filteredData);
    }
  }

  /**
   * 过滤允许的字段
   */
  static filterAllowedFields(data) {
    const allowedFields = ['name', 'icp', 'copyright'];
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}

module.exports = SettingService; 