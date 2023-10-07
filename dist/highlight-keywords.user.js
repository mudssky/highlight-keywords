// ==UserScript==
// @name         highlight-keywords
// @namespace    https://github.com/mudssky/highlight-keywords
// @version      2.0.4
// @author       mudssky
// @description  高亮关键词,可设置关键词的样式,支持正则匹配
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @homepage     https://github.com/mudssky/highlight-keywords
// @homepageURL  https://github.com/mudssky/highlight-keywords
// @supportURL   https://github.com/mudssky/highlight-keywords/issues
// @updateURL    https://github.com/mudssky/highlight-keywords/blob/main/dist/highlight-keywords.user.js
// @match        *://*/*
// @exclude      *://element-plus*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.3.14/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.3.14/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const r=document.createElement("style");r.textContent=t,document.head.append(r)})(" .dialog-footer button[data-v-aead4c22]:first-child{margin-right:10px}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.min-h-\\[400px\\]{min-height:400px}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)} ");

(function (vue, ElementPlus) {
  'use strict';

  var zhCn = {
    name: "zh-cn",
    el: {
      colorpicker: {
        confirm: "确定",
        clear: "清空"
      },
      datepicker: {
        now: "此刻",
        today: "今天",
        cancel: "取消",
        clear: "清空",
        confirm: "确定",
        selectDate: "选择日期",
        selectTime: "选择时间",
        startDate: "开始日期",
        startTime: "开始时间",
        endDate: "结束日期",
        endTime: "结束时间",
        prevYear: "前一年",
        nextYear: "后一年",
        prevMonth: "上个月",
        nextMonth: "下个月",
        year: "年",
        month1: "1 月",
        month2: "2 月",
        month3: "3 月",
        month4: "4 月",
        month5: "5 月",
        month6: "6 月",
        month7: "7 月",
        month8: "8 月",
        month9: "9 月",
        month10: "10 月",
        month11: "11 月",
        month12: "12 月",
        weeks: {
          sun: "日",
          mon: "一",
          tue: "二",
          wed: "三",
          thu: "四",
          fri: "五",
          sat: "六"
        },
        months: {
          jan: "一月",
          feb: "二月",
          mar: "三月",
          apr: "四月",
          may: "五月",
          jun: "六月",
          jul: "七月",
          aug: "八月",
          sep: "九月",
          oct: "十月",
          nov: "十一月",
          dec: "十二月"
        }
      },
      select: {
        loading: "加载中",
        noMatch: "无匹配数据",
        noData: "无数据",
        placeholder: "请选择"
      },
      cascader: {
        noMatch: "无匹配数据",
        loading: "加载中",
        placeholder: "请选择",
        noData: "暂无数据"
      },
      pagination: {
        goto: "前往",
        pagesize: "条/页",
        total: "共 {total} 条",
        pageClassifier: "页",
        page: "页",
        prev: "上一页",
        next: "下一页",
        currentPage: "第 {pager} 页",
        prevPages: "向前 {pager} 页",
        nextPages: "向后 {pager} 页",
        deprecationWarning: "你使用了一些已被废弃的用法，请参考 el-pagination 的官方文档"
      },
      messagebox: {
        title: "提示",
        confirm: "确定",
        cancel: "取消",
        error: "输入的数据不合法!"
      },
      upload: {
        deleteTip: "按 delete 键可删除",
        delete: "删除",
        preview: "查看图片",
        continue: "继续上传"
      },
      table: {
        emptyText: "暂无数据",
        confirmFilter: "筛选",
        resetFilter: "重置",
        clearFilter: "全部",
        sumText: "合计"
      },
      tree: {
        emptyText: "暂无数据"
      },
      transfer: {
        noMatch: "无匹配数据",
        noData: "无数据",
        titles: ["列表 1", "列表 2"],
        filterPlaceholder: "请输入搜索内容",
        noCheckedFormat: "共 {total} 项",
        hasCheckedFormat: "已选 {checked}/{total} 项"
      },
      image: {
        error: "加载失败"
      },
      pageHeader: {
        title: "返回"
      },
      popconfirm: {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    }
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function highlightKeyword(node, pattern, index) {
    var _a;
    let exposeCount = 0;
    if (node.nodeType === Node.TEXT_NODE && node instanceof Text) {
      const matchResult = node.data.match(pattern);
      if (matchResult) {
        const highlightEl = document.createElement("span");
        highlightEl.dataset.highlight = "yes";
        highlightEl.dataset.highlightMatch = matchResult[0];
        if (index ?? false) {
          highlightEl.dataset.highlightIndex = index;
        }
        const matchNode = node.splitText((matchResult == null ? void 0 : matchResult.index) ?? 0);
        matchNode.splitText(matchResult[0].length);
        var highlightTextNode = document.createTextNode(matchNode.data);
        highlightEl.appendChild(highlightTextNode);
        (_a = matchNode.parentNode) == null ? void 0 : _a.replaceChild(highlightEl, matchNode);
        exposeCount++;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && !/script|style/.test(node.tagName.toLowerCase())) {
      if (node.dataset.highlight === "yes") {
        if ((index ?? null) === null) {
          return;
        }
        if (node.dataset.highlightIndex === (index ?? "").toString()) {
          return;
        }
      }
      let childNodes = node.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        highlightKeyword(childNodes[i], pattern, index);
      }
    }
    return exposeCount;
  }
  function closeHighlight(pattern, index = null) {
    var highlightNodeList = document.querySelectorAll("[data-highlight=yes]");
    for (var n = 0; n < highlightNodeList.length; n++) {
      const dataset = highlightNodeList[n].dataset;
      if (index === null || dataset.highlightIndex !== index.toString()) {
        return;
      }
      if (pattern.test(dataset.highlightMatch)) {
        var parentNode = highlightNodeList[n].parentNode;
        var childNodes = highlightNodeList[n].childNodes;
        var childNodesLen = childNodes.length;
        var nextSibling = highlightNodeList[n].nextSibling;
        for (var k = 0; k < childNodesLen; k++) {
          parentNode.insertBefore(childNodes[0], nextSibling);
        }
        var flagNode = document.createTextNode("");
        parentNode.replaceChild(flagNode, highlightNodeList[n]);
        parentNode.normalize();
      }
    }
  }
  function cleanKeywords(keywords) {
    let wordMatchString = "";
    const words = [...keywords];
    words.forEach((item) => {
      let transformString = item.replace(/[.[*?+^$|()/]|\]|\\/g, "\\$&");
      wordMatchString += `|(${transformString})`;
    });
    wordMatchString = wordMatchString.substring(1);
    const wholePattern = new RegExp(`^${wordMatchString}$`, "i");
    const pattern = new RegExp(wordMatchString, "i");
    return [pattern, wholePattern];
  }
  const configName = "hightlight-config";
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const ruleFormRef = vue.ref();
      const dialogVisible = vue.ref(false);
      const ruleList = vue.ref([]);
      const pageState = vue.reactive({
        globalStyle: void 0
      });
      const form = vue.reactive({
        configJson: "",
        defaultHightlightStyle: "background:gold;color:black;",
        highlightStyle: "background:gold;color:black;",
        placeholder: `//示例：
	[
        {
            "keywords": ["成年コミック"],
            "matchUrl": "sukebei.nyaa.si",
        },
    ]
	
	`
      });
      const matchedRuleList = vue.computed(() => {
        return ruleList.value.filter((rule) => {
          var urlPattern = new RegExp(rule.matchUrl);
          return urlPattern.test(window.location.href);
        });
      });
      const matchedKeywords = vue.computed(() => {
        const keywordsLists = matchedRuleList.value.map((item) => {
          return item.keywords;
        });
        return [...new Set(keywordsLists.flat())];
      });
      function generateHighlightStyle(styleText) {
        return `[data-highlight="yes"]{${styleText}}`;
      }
      function loadGlobalStyle() {
        let style2 = document.createElement("style");
        style2.textContent = generateHighlightStyle(form.defaultHightlightStyle);
        document.head.appendChild(style2);
        pageState.globalStyle = style2;
      }
      function updateHighlightStyle(styleText) {
        if (pageState.globalStyle) {
          pageState.globalStyle.textContent = generateHighlightStyle(styleText);
        }
      }
      function handleCopyJson() {
        _GM_setClipboard(form.configJson, "text");
      }
      function loadRuleList() {
        const vv = _GM_getValue(configName, []);
        ruleList.value = vv;
        form.configJson = JSON.stringify(ruleList.value);
      }
      function handleOpenPanel() {
        dialogVisible.value = true;
      }
      function handleClose() {
        dialogVisible.value = false;
      }
      function validateConfig(configList) {
        const res = [false, "配置项格式不对"];
        if (!Array.isArray(configList)) {
          return res;
        }
        if (configList.some((item) => {
          return typeof item !== "object";
        })) {
          return res;
        }
        for (const property of ["keywords", "matchUrl"]) {
          if (configList.some((item) => {
            return !((item == null ? void 0 : item[property]) ?? false);
          })) {
            res[1] = `${property} 属性是必须的`;
            return res;
          }
        }
        for (const item of configList) {
          if (typeof item.matchUrl !== "string") {
            res[1] = "matchUrl类型错误";
            return res;
          }
          if (!Array.isArray(item.keywords)) {
            res[1] = "keywords类型错误";
            return res;
          }
          for (const keyword of item.keywords) {
            if (typeof keyword !== "string") {
              res[1] = "keywords类型错误";
              return res;
            }
            if (keyword.trim() === "") {
              console.log("空字符串");
              res[1] = "keywords不能为空";
              return res;
            }
          }
        }
        return [true, res[1]];
      }
      async function handleUpdateConfig() {
        var _a;
        await ((_a = ruleFormRef.value) == null ? void 0 : _a.validate((valid2, fields) => {
          if (valid2) {
            console.log("submit!");
          } else {
            console.log("error submit!", fields);
          }
        }));
        let list;
        try {
          list = JSON.parse(form.configJson);
        } catch (error) {
          ElementPlus.ElMessage({
            type: "warning",
            message: "json解析错误"
          });
          return;
        }
        const [valid, errorMessage] = validateConfig(list);
        if (!valid) {
          ElementPlus.ElMessage({
            type: "warning",
            message: errorMessage
          });
          return;
        }
        ruleList.value = list;
        updateHighlightStyle(form.highlightStyle);
        _GM_setValue(configName, list);
        highlightMatchedKeywords();
        ElementPlus.ElMessage({
          type: "success",
          message: "配置更新成功"
        });
        handleClose();
      }
      function highlightMatchedKeywords() {
        if (matchedKeywords.value.length < 1) {
          return;
        }
        const [pattern, _] = cleanKeywords(matchedKeywords.value);
        closeHighlight(document.body, pattern);
        highlightKeyword(document.body, pattern);
      }
      vue.onMounted(() => {
        loadRuleList();
        if (matchedKeywords.value.length > 0) {
          loadGlobalStyle();
          highlightMatchedKeywords();
        }
        _GM_registerMenuCommand("打开配置面板", handleOpenPanel);
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: dialogVisible.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogVisible.value = $event),
          title: "配置面板",
          width: "30%",
          "before-close": handleClose,
          class: "min-h-[400px]"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_el_form, {
              model: form,
              ref_key: "ruleFormRef",
              ref: ruleFormRef
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, {
                  label: "高亮样式",
                  prop: "highlightStyle",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入高亮样式",
                      trigger: "change"
                    }
                  ]
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.highlightStyle,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.highlightStyle = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "配置" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.configJson,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.configJson = $event),
                      placeholder: form.placeholder,
                      type: "textarea",
                      autosize: { minRows: 5, maxRows: 10 }
                    }, null, 8, ["modelValue", "placeholder"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"]),
            vue.createVNode(_component_el_row, { justify: "end" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_space, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, { onClick: handleCopyJson }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("复制json")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_button, {
                      onClick: handleUpdateConfig,
                      type: "primary"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("更新配置")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const app$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-aead4c22"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const config = vue.reactive({
        zIndex: 100
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElConfigProvider), {
          locale: vue.unref(zhCn),
          zIndex: config.zIndex
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(app$1)
          ]),
          _: 1
        }, 8, ["locale", "zIndex"]);
      };
    }
  });
  const app = vue.createApp(_sfc_main);
  const appContainer = (() => {
    const app2 = document.createElement("div");
    document.documentElement.append(app2);
    return app2;
  })();
  app.use(ElementPlus);
  app.mount(appContainer);

})(Vue, ElementPlus);