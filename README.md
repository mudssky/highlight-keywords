# highlight-keywords



## 项目运行方法

```shell
# 安装依赖
pnpm i
# 打包脚本
pnpm build
```
也可以到我的脚本发布页安装

https://greasyfork.org/zh-CN/scripts/461411-highlight-keywords

## 使用方法

脚本的作用是高亮关键词。

遍历页面所有的文本节点，通过修改标签的方法添加样式

在油猴脚本的菜单里面，打开配置面板，就可以配置脚本，配置信息使用油猴脚本的存储存在浏览器本地

配置文件的json需要满足下面的格式。

```json

[
  {
    "keywords": ["watch"],
    "matchUrl": "cn.vuejs.org"
  }
]

```

