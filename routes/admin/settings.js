const express = require('express');
const router = express.Router();
const SettingService = require('../../services/settingService');
const { success } = require('../../utils/response');
const { asyncHandler, validateParams } = require('../../utils/middleware');

// 验证规则
const updateSettingsValidation = {
  name: { minLength: 1, maxLength: 100 },
  icp: { minLength: 1, maxLength: 100 },
  copyright: { minLength: 1, maxLength: 200 }
};

/**
 * 获取系统设置
 * GET /admin/settings
 */
router.get('/', asyncHandler(async (req, res) => {
  const settings = await SettingService.getSettings();

  success(res, 'Settings fetched successfully', settings);
}));

/**
 * 更新系统设置
 * PUT /admin/settings
 */
router.put('/', validateParams(updateSettingsValidation), asyncHandler(async (req, res) => {
  const settings = await SettingService.updateSettings(req.body);

  success(res, 'Settings updated successfully', settings);
}));

module.exports = router; 