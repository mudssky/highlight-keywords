const keywordsList = [
  {
    keyword: '使用',
    color: 'yellow',
    //     styleText: 'background:yellow;',
  },
]
const oldHtml = document.body.innerHTML
// console.log(page)
// console.log(typeof oldHtml)
let newHtml = oldHtml
for (const i in keywordsList) {
  newHtml = newHtml.replaceAll(keywordsList[i].keyword, 'hello')
}
document.body.innerHTML = newHtml
