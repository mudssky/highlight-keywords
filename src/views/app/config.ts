import type { ThemePresets, RuleItem, DynamicColors } from './types'

// 配置名称常量
export const CONFIG_NAME = 'hightlight-config'

// 样式预设
export const themePresets: ThemePresets = {
  default: {
    highlight: 'background: yellow; color: black;',
    active: 'background: orange; color: white; outline: 2px solid #ff5722;',
  },
  dark: {
    highlight: 'background: #333; color: #fff; border: 1px solid #666;',
    active: 'background: #555; color: #fff; outline: 2px solid #00bcd4;',
  },
  modern: {
    highlight:
      'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 3px; padding: 1px 3px;',
    active:
      'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 3px; padding: 1px 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);',
  },
  minimal: {
    highlight:
      'background: #e3f2fd; color: #1976d2; border-bottom: 2px solid #2196f3;',
    active:
      'background: #ffecb3; color: #f57c00; border-bottom: 2px solid #ff9800; font-weight: bold;',
  },
}

// 默认表单配置
export const defaultFormData = {
  configJson: '',
  defaultHightlightStyle: 'background:gold;color:black;',
  highlightStyle: 'background:gold;color:black;',
  activeStyle: 'background: orange; color: white; outline: 2px solid #ff5722;',
  selectedTheme: 'default',
  placeholder: `//示例：
	[
        {
            "keywords": ["成年コミック"],
            "matchUrl": "sukebei.nyaa.si",
        },
    ]
	
	`,
}

// 动态配色方案生成函数
export const generateDynamicColors = (isDarkMode: boolean): DynamicColors => {
  if (isDarkMode) {
    return {
      panelBg:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
      triggerBg: 'bg-slate-700/30',
      contentBg: 'bg-slate-800/20',
      infoBg: 'bg-slate-700/30',
      borderColor: 'border-slate-600/30',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      buttonPrimary: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      buttonSecondary: 'linear-gradient(135deg, #6366f1, #4338ca)',
      buttonDanger: 'linear-gradient(135deg, #ef4444, #dc2626)',
      buttonSuccess: 'linear-gradient(135deg, #10b981, #059669)',
    }
  } else {
    return {
      panelBg:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.98))',
      triggerBg: 'bg-white/40',
      contentBg: 'bg-white/20',
      infoBg: 'bg-blue-50/50',
      borderColor: 'border-gray-200/50',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      buttonPrimary: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      buttonSecondary: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      buttonDanger: 'linear-gradient(135deg, #f59e0b, #d97706)',
      buttonSuccess: 'linear-gradient(135deg, #10b981, #059669)',
    }
  }
}

/**
 * 配置验证函数
 * ajv库打包体积太大了,改用手动校验了
 * @param configList
 */
export function validateConfig(configList: RuleItem[]): [boolean, string] {
  const res: [boolean, string] = [false, '配置项格式不对']
  if (!Array.isArray(configList)) {
    return res
  }
  if (
    configList.some((item) => {
      return typeof item !== 'object'
    })
  ) {
    return res
  }
  // 校验关键词
  for (const property of ['keywords', 'matchUrl'] as const) {
    if (
      configList.some((item) => {
        return !(item?.[property] ?? false)
      })
    ) {
      // 存在不满足的属性
      res[1] = `${property} 属性是必须的`
      return res
    }
  }

  for (const item of configList) {
    if (typeof item.matchUrl !== 'string') {
      res[1] = 'matchUrl类型错误'
      return res
    }
    if (!Array.isArray(item.keywords)) {
      res[1] = 'keywords类型错误'
      return res
    }
    for (const keyword of item.keywords) {
      if (typeof keyword !== 'string') {
        res[1] = 'keywords类型错误'
        return res
      }
      if (keyword.trim() === '') {
        console.log('空字符串')
        res[1] = 'keywords不能为空'
        return res
      }
    }
  }
  // 避免空字符串
  return [true, res[1]]
}