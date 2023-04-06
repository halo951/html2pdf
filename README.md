# html2pdf-browser | 截屏并生成 pdf 文件

> Take a screenshot and generate a PDF, solved the problem of SVG rendering and chinese text overlap.
>
> 截屏并生成 pdf, 解决了 svg 渲染和中文文本重叠问题
>
> 感谢 [html2canvas](https://www.npmjs.com/package/html2canvas), [jspdf](https://www.npmjs.com/package/jspdf) 库作者提供的工具, 这里主要对两个插件的能力进行封装以及解决使用阶段产生的问题.

## Support

> [TIP] 由于 pr 还未合并, 所以内置了一个从原始库中 fork 的 `html2canvas@v1.4.1` 依赖, 后续 pr 合并后, 会还原到官方库

1. 支持在浏览器内生成, 不需要额外添加 node 服务层
2. 解决 `<svg><use href='#id'></svg>` 引用 svg 方式无法被 `html2canvas` 渲染转化问题

    - 特定场景: 使用如 `svg-sprite-loader` 插件, 加载 svg 资源

3. 解决 `html2canvas` 渲染 svg 时, 设置 `position: absolute;` 导致的渲染内容残缺.
4. 解决中文文字换行重叠问题。(中文符号体积计算渲染空间错误)

## usage

1. install

```bash
yarn add html2pdf-browser
# or
npm install html2pdf-browser
```

2. use demo

> 注: 默认 `scale`(html2canvas 老版本的 dpi 参数) 为 **4**

```typescript
await html2pdf(`filename.pdf`, el)
```

## methods

| method      | desc                                                                           |
| ----------- | ------------------------------------------------------------------------------ |
| html2pdf    | 将 html 转化为 pdf, 并触发下载                                                 |
| html2canvas | 将 html 转化为 canvas (对 html2canvas 库封装, 解决中文符号渲染和 svg 渲染问题) |

## FAQ

1. 浏览器兼容性

    继承 `html2canvas` 和 `jspdf` 库的支持情况, 大多数浏览器环境内没什么问题

2. 中文文本渲染

    这里通过为 `<body>` 节点设置一个 **0.0001px**的字间距, 解决计算中文符号占用空间与实际渲染空间不一致问题.
