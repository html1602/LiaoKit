import LiaoIcon from './LiaoIcon.vue';
import { registerSvgIcon, registerSvgIcons, getSvgIcon, hasSvgIcon, removeSvgIcon, getAllSvgIconNames, clearAllSvgIcons } from '../../utils/icons';
import { registerIconComponents, getCustomSvgIcon } from './icons';

// 导出图标工具函数
export { 
  registerSvgIcon, 
  registerSvgIcons, 
  getSvgIcon, 
  hasSvgIcon, 
  removeSvgIcon, 
  getAllSvgIconNames, 
  clearAllSvgIcons,
  getCustomSvgIcon
};

// 导出图标组件注册函数（已废弃，保留向后兼容）
export { registerIconComponents };

export default LiaoIcon; 