# highlight-keywords



## 项目运行方法

项目采用webpack配置，添加ts-loader提供对typescript的支持。

结果我发现其实没必要怎么搞，只写js的话tsc就够用了。

引入vue以后才需要webpack

执行下面的命令，会监视脚本文件，进行修改之后会重新build

你在tempermonkey脚本管理器中 `@require file://`使用文件url来引入脚本，这样改动完vscode的代码浏览器一刷新就能看到结果了。

```
npm run start 
```

这个powershell脚本把src目录中的userscriptHead和编译好的js文件拼接起来，并复制到剪切板。

因为油猴脚本不允许混淆，比起webpack生成的乱七八糟的代码，还是tsc直接转译的代码更友好一些。

```powershell
concatSrcipts.ps1
```

也可以到我的脚本发布页安装

https://greasyfork.org/zh-CN/scripts/428302-hightlight-keywords

## 使用方法

脚本的作用是高亮关键词。

获取网页的innerHtml.然后使用正则匹配关键词，替换成用em标签进行包裹，并且在em标签的style属性上设置你提供的样式实现高亮

只需要修改脚本中的RuleList,添加你想更改样式的项目即可，

脚本里面默认的是sukebei.nyaa.si这个网站，  如果你添加了新的网站，注意在脚本的头部用@include添加上网址才会生效。

还有一个问题是对那些使用vue,react之类使用ajax动态加载页面内容的类型的网页并没有适配可能并不会生效。
```javascript
var RuleList = [
        {
            keyword: '成年コミック',
            // color: 'yellow',
            styleText: 'background:gold;',
            matchUrl: 'sukebei.nyaa.si',
        },
    ];
```

