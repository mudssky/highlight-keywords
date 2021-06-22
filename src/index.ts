// 因为是用的@require 方法引用脚本，就和页面引入js一样是会阻塞线程的导致页面加载不出，这边onload等页面加载完再执行
// window.onload = function () {
//   setTimeout(() => {
//     main()
//   }, 3000)
// }

;(function () {
  interface Rule {
    keyword: string
    styleText: string
    matchUrl: string
  }

  // const defaultStyleText = 'background:gold;'
  // interface RuleList
  const RuleList: Array<Rule> = [
    {
      keyword: '成年コミック',
      // color: 'yellow',
      styleText: 'background:gold;',
      matchUrl: 'sukebei.nyaa.si',
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

  // 这个变量存放最后修改后的html
  let lastHtml = document.body.innerHTML
  // console.log(matchedRuleList)
  // 使用innerhtml 替换的方式,替换关键词为带高亮style的html
  for (const i in matchedRuleList) {
    // 作为中间变量，每次循环从上次的结果基础上进行。
    const currentHtml = lastHtml
    const htmlPattern = new RegExp(
      `(<[^>]+>[^<>]*?)${matchedRuleList[i].keyword}([^<>]*?<[^>]+>)`,
      'g'
    )
    lastHtml = currentHtml.replaceAll(
      htmlPattern,
      `$1<em style="${matchedRuleList[i].styleText}">${matchedRuleList[i].keyword}</em>$2`
    )
  }
  document.body.innerHTML = lastHtml
})()
