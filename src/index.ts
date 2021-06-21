interface Rule {
  keyword: string
  styleText: string
  matchUrl: string
}
// interface RuleList
const RuleList: Array<Rule> = [
  {
    keyword: '成年コミック',
    // color: 'yellow',
    styleText: 'background:yellow;',
    matchUrl: 'sukebei.nyaa.si',
  },
  {
    keyword: '使用',
    styleText: 'background:red',
    matchUrl: 'www.jianshu.com',
  },
]

// 筛选匹配当前页面的规则
const matchedRuleList = RuleList.filter(function (rule) {
  // 检查是否存在matchUrl选项,如果没有直接报错,默认当作匹配所有网站处理,直接通过过滤
  if (!rule.matchUrl) {
    console.error('this rule should have a match url')
    return rule
  }
  // 存在matchUrl选项,则过滤匹配当前页面的rule
  if (rule.matchUrl) {
    const urlPattern = new RegExp(rule.matchUrl)
    if (urlPattern.test(window.location.href)) {
      return rule
    }
  }
})
// console.log(matchedRuleList)
// 使用innerhtml 替换的方式,替换关键词为带高亮style的html
const oldHtml = document.body.innerHTML
let newHtml = oldHtml
for (const i in matchedRuleList) {
  const htmlPattern = new RegExp(
    `(<[^>]+>[^<>]*?)${matchedRuleList[i].keyword}([^<>]*?<[^>]+>)`,
    'g'
  )
  newHtml = newHtml.replaceAll(
    htmlPattern,
    `$1<em style="${matchedRuleList[i].styleText}">${matchedRuleList[i].keyword}</em>$2`
  )
}
document.body.innerHTML = newHtml
