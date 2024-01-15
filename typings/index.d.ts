import type { jsPDFOptions as IJsPDFOptions } from 'jspdf';
import type { Options as IHtml2CanvasOptions } from 'html2canvas';
import JsPDF from 'jspdf';
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
export declare const html2canvas: (el: HTMLElement, options?: Partial<IHtml2CanvasOptions>) => Promise<HTMLCanvasElement>;
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
export declare const html2pdf: (filename: string, el: HTMLElement | Array<HTMLElement>, options?: {
    download?: boolean | undefined;
    jsPDFOptions?: IJsPDFOptions | undefined;
    html2canvasOptions?: IHtml2CanvasOptions | undefined;
}) => Promise<void | JsPDF>;
