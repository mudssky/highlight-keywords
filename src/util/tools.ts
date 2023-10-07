// 这个文件里面是网上找的代码

/**
 * 遍历所有文本节点的方法
 * @param node
 * @param callback
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function traverseTextNodes(node: any, callback: any) {
  if (node.nodeType === Node.TEXT_NODE) {
    callback(node)
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      traverseTextNodes(child, callback)
    }
  }
}

/**
 * 高亮关键字
 * @param node 节点
 * @param pattern 匹配的正则表达式
 * @param index - 可选。本项目中特定的需求，表示第几组关键词
 * @returns exposeCount - 匹配次数
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function highlightKeyword(node: any, pattern: RegExp, index?: string) {
  let exposeCount = 0

  if (node.nodeType === Node.TEXT_NODE && node instanceof Text) {
    // 匹配结果
    const matchResult = node.data.match(pattern)
    if (matchResult) {
      const highlightEl = document.createElement('span')
      highlightEl.dataset.highlight = 'yes'
      // match返回元组的，第一个就是匹配到的字符串。
      highlightEl.dataset.highlightMatch = matchResult[0]

      if (index ?? false) {
        highlightEl.dataset.highlightIndex = index
      }
      // 根据匹配结果的个数，拆分文本节点
      // 先拆分左边
      const matchNode = node.splitText(matchResult?.index ?? 0)
      // 再拆分右边
      matchNode.splitText(matchResult[0].length)
      // 根据匹配的内容创建高亮节点
      var highlightTextNode = document.createTextNode(matchNode.data)
      highlightEl.appendChild(highlightTextNode)
      // 用高亮节点替换掉拆分出匹配的节点
      matchNode.parentNode?.replaceChild(highlightEl, matchNode)
      exposeCount++
    }
  }

  // 判断是元素节点，并且不是script，style标签
  else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !/script|style/.test(node.tagName.toLowerCase())
  ) {
    // 已经添加高亮的情况
    if (node.dataset.highlight === 'yes') {
      // 没有index的情况，不会重复添加高亮，直接返回
      if ((index ?? null) === null) {
        return
      }
      // index相等的情况下，直接返回
      if (node.dataset.highlightIndex === (index ?? '').toString()) {
        return
      }
    }
    let childNodes = node.childNodes
    for (var i = 0; i < childNodes.length; i++) {
      highlightKeyword(childNodes[i], pattern, index)
    }
  }
  return exposeCount
}

/**
 * 关闭高亮的函数，也就是把包裹的一层span去掉
 * @param pattern 匹配的正则表达式
 * @param index 关键词的组别，即第几组关键词
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function closeHighlight(pattern: any, index: any = null) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  var highlightNodeList: any = document.querySelectorAll('[data-highlight=yes]')
  for (var n = 0; n < highlightNodeList.length; n++) {
    const dataset = highlightNodeList[n].dataset
    // 如果不需要分组或分组了组别不对，则不需要取消
    if (index === null || dataset.highlightIndex !== index.toString()) {
      return
    }
    if (pattern.test(dataset.highlightMatch)) {
      var parentNode = highlightNodeList[n].parentNode
      var childNodes = highlightNodeList[n].childNodes
      var childNodesLen = childNodes.length
      var nextSibling = highlightNodeList[n].nextSibling
      for (var k = 0; k < childNodesLen; k++) {
        parentNode.insertBefore(childNodes[0], nextSibling)
      }
      var flagNode = document.createTextNode('')
      parentNode.replaceChild(flagNode, highlightNodeList[n])
      // Node.normalize() 方法将当前节点和它的后代节点”规范化“（normalized）。在一个"规范化"后的 DOM 树中，不存在一个空的文本节点，或者两个相邻的文本节点。
      parentNode.normalize()
    }
  }
}

/**
 *
 * @param keywords  要高亮的关键词数组
 * @returns
 */
export function cleanKeywords(keywords: string[]) {
  let wordMatchString = ''
  const words = [...keywords]
  words.forEach((item: string) => {
    //  $&在js替换中表示每一次匹配到的内容，\\是斜杠，也就是对每一次匹配到的内容转义。
    let transformString = item.replace(/[.[*?+^$|()/]|\]|\\/g, '\\$&')
    wordMatchString += `|(${transformString})`
  })
  // 移除开头的多余的|
  wordMatchString = wordMatchString.substring(1)
  // 用于关闭高亮时精确匹配
  const wholePattern = new RegExp(`^${wordMatchString}$`, 'i')
  // 用于第一次高亮的关键字匹配正则
  const pattern = new RegExp(wordMatchString, 'i')
  return [pattern, wholePattern]
}
