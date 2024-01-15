import type { jsPDFOptions as IJsPDFOptions } from 'jspdf'
import type { Options as IHtml2CanvasOptions } from 'html2canvas'
import JsPDF from 'jspdf'
import h2c from 'html2canvas'

/**
 * 将html转化为 canvas
 *
 * @description
 *  1. 解决使用 <use href='id'> 格式引用的svg渲染问题
 *  2. 设置字间距, 解决中文文字渲染空间计算导致的重叠问题
 *
 * @param el 待渲染节点
 * @param options html2canvas 参数
 * @returns
 */
export const html2canvas = async (
    el: HTMLElement,
    options?: Partial<IHtml2CanvasOptions>
): Promise<HTMLCanvasElement> => {
    const { offsetWidth, offsetHeight } = el
    // > convert html el to canvas
    const canvas: HTMLCanvasElement = await h2c(el, {
        width: offsetWidth,
        height: offsetHeight,
        windowWidth: offsetWidth,
        windowHeight: offsetHeight,
        scrollX: 0,
        scrollY: 0,
        scale: 4,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 30 * 1000,
        onclone(doc: Document, ele: Element): void {
            /* fix: 解决使用 <use href='id'> 格式引用的svg渲染问题 */
            const use: Array<Element> = Array.from(ele.querySelectorAll('use[href]'))
            /** svg 图标 */
            let svg!: HTMLElement
            let id!: string | null
            /** svg 内容元素 */
            let svgSymbol!: Element | null
            for (const u of use) {
                id = u.getAttribute('href')
                svgSymbol = document.querySelector(id ?? '')
                if (u.parentNode) {
                    svg = u.parentNode as HTMLElement
                }
                svg.innerHTML = svgSymbol?.innerHTML ?? ''
            }
            /* fix: 设置字间距, 解决中文文字渲染空间计算导致的重叠问题 */
            doc.body.style.letterSpacing = '0.0001px'
        },
        ...options
    })

    return canvas
}

/** 将 html 转化为 pdf 并下载
 *
 * @description
 *  1. 当使用 echart 图表时, 应声明配置 `echarts.init(this.$el as HTMLDivElement, undefined, { devicePixelRatio: 2 })`, 处理清晰度问题
 *  2. 当使用了 <use href='#id'> 方式(如: svg-sprite-loader) 加载svg资源时, 应
 *
 * @param filename 下载文件名
 * @param el 需要转化的html节点, 可为数组
 * @param options.downlaod 是否下载
 * @param options.jsPDFOptions jspdf 参数
 * @param options.html2canvasOptions html2canvas 参数
 *
 * @returns 转换成功后, 自动触发下载操作
 *
 * @author libin<libin@persagy.com>
 */
export const html2pdf = async (
    filename: string,
    el: HTMLElement | Array<HTMLElement>,
    options: {
        download?: boolean
        jsPDFOptions?: IJsPDFOptions
        html2canvasOptions?: IHtml2CanvasOptions
    } = {}
): Promise<void | JsPDF> => {
    const { download, jsPDFOptions, html2canvasOptions } = options
    // @ 实例化 pdf 对象
    const doc = new JsPDF({
        /** 方向 */
        orientation: 'portrait',
        /** 像素单位 */
        unit: 'pt',
        // # 参数替换
        ...jsPDFOptions
    })

    // @ canvas
    let canvas!: HTMLCanvasElement
    // @ image's base64 data
    let image!: string

    // @ transform to array element's
    const els: Array<HTMLElement> = el instanceof Array ? el : [el]

    // ? 检查并补全文件名
    if (!filename.includes('.pdf')) filename += '.pdf'
    // > 解析, 转化为pdf
    for (const el of els) {
        const { offsetWidth, offsetHeight } = el
        // > 添加新页
        doc.addPage('JPEG')
        // > transform el to canvas
        canvas = await html2canvas(el, html2canvasOptions)
        // > transform canvas to image(jpg)
        image = canvas.toDataURL('image/jpeg', 1.0)
        // > append to pdf's doc
        doc.addImage(image, 'JPEG', 0, 0, offsetWidth, offsetHeight)
    }
    // > 删除空页面
    doc.deletePage(1)
    if (download) {
        // > 触发保存下载
        return doc.save(filename, { returnPromise: true })
    } else {
        return doc
    }
}
