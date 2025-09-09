/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            typography: () => ({
                customDark: {
                    css: {
                        // 基本文本颜色，影响正文段落 <p>
                        '--tw-prose-body': 'var(--color-pink-800)',
                        // 所有标题的颜色 <h1>, <h2>, <h3>, <h4>, <h5>, <h6>
                        '--tw-prose-headings': 'var(--color-pink-900)',
                        // 引导段落颜色，通常是大号首段，使用 prose-lead 类
                        '--tw-prose-lead': 'var(--color-pink-700)',
                        // 链接文本颜色 <a> 标签
                        '--tw-prose-links': 'var(--color-pink-900)',
                        // 粗体文本颜色 <strong>, <b> 标签
                        '--tw-prose-bold': 'var(--color-pink-900)',
                        // 有序列表的数字颜色 <ol> 中的数字
                        '--tw-prose-counters': 'var(--color-pink-600)',
                        // 无序列表的项目符号颜色 <ul> 中的圆点
                        '--tw-prose-bullets': 'var(--color-pink-400)',
                        // 水平分隔线颜色 <hr> 标签
                        '--tw-prose-hr': 'var(--color-pink-300)',
                        // 引用文本颜色 <blockquote> 内的文本
                        '--tw-prose-quotes': 'var(--color-pink-900)',
                        // 引用块左边框颜色 <blockquote> 的左侧边框
                        '--tw-prose-quote-borders': 'var(--color-pink-300)',
                        // 图片和表格标题颜色 <figcaption> 标签
                        '--tw-prose-captions': 'var(--color-pink-700)',
                        // 表头单元格边框颜色 <th> 标签边框
                        '--tw-prose-th-borders': 'var(--color-pink-300)',
                        // 表格数据单元格边框颜色 <td> 标签边框
                        '--tw-prose-td-borders': 'var(--color-pink-200)',
                        // 以下是暗色模式（使用 dark 类时）的对应设置
                        // 暗色模式下的正文文本颜色
                        '--tw-prose-invert-body': '#FEFCE4',
                        // 暗色模式下的标题颜色
                        '--tw-prose-invert-headings': '#E0DEC0',
                        // 暗色模式下的引导段落颜色
                        '--tw-prose-invert-lead': '#F7C9B6',
                        // 暗色模式下的链接颜色
                        '--tw-prose-invert-links': 'var(--color-blue-400)',
                        // 暗色模式下的粗体文本颜色
                        '--tw-prose-invert-bold': '#FFF3BF',
                        // 暗色模式下的有序列表数字颜色
                        '--tw-prose-invert-counters': '#FFF3BF',
                        // 暗色模式下的无序列表项目符号颜色
                        '--tw-prose-invert-bullets': '#FFF3BF',
                        // 暗色模式下的行内代码颜色
                        '--tw-prose-invert-code': '#FFF9DB',
                        // 暗色模式下的水平分隔线颜色
                        '--tw-prose-invert-hr': '#bbb89c',
                        // 暗色模式下的引用文本颜色
                        '--tw-prose-invert-quotes': '#D5C8B0',
                        // 暗色模式下的引用块边框颜色
                        '--tw-prose-invert-quote-borders': '#CFCBA0',
                        // 暗色模式下的图片和表格标题颜色
                        '--tw-prose-invert-captions': '#F7C9B6',
                        // 暗色模式下的表头单元格边框颜色
                        '--tw-prose-invert-th-borders': '#bbb89c',
                        // 暗色模式下的表格数据单元格边框颜色
                        '--tw-prose-invert-td-borders': '#bbb89c'
                    }
                },
                customOrange: {
                    css: {
                        // 基本文本颜色，影响正文段落 <p>
                        '--tw-prose-body': 'var(--color-pink-800)',
                        // 所有标题的颜色 <h1>, <h2>, <h3>, <h4>, <h5>, <h6>
                        '--tw-prose-headings': 'var(--color-pink-900)',
                        // 引导段落颜色，通常是大号首段，使用 prose-lead 类
                        '--tw-prose-lead': 'var(--color-pink-700)',
                        // 链接文本颜色 <a> 标签
                        '--tw-prose-links': 'var(--color-pink-900)',
                        // 粗体文本颜色 <strong>, <b> 标签
                        '--tw-prose-bold': 'var(--color-pink-900)',
                        // 有序列表的数字颜色 <ol> 中的数字
                        '--tw-prose-counters': 'var(--color-pink-600)',
                        // 无序列表的项目符号颜色 <ul> 中的圆点
                        '--tw-prose-bullets': 'var(--color-pink-400)',
                        // 水平分隔线颜色 <hr> 标签
                        '--tw-prose-hr': 'var(--color-pink-300)',
                        // 引用文本颜色 <blockquote> 内的文本
                        '--tw-prose-quotes': 'var(--color-pink-900)',
                        // 引用块左边框颜色 <blockquote> 的左侧边框
                        '--tw-prose-quote-borders': 'var(--color-pink-300)',
                        // 图片和表格标题颜色 <figcaption> 标签
                        '--tw-prose-captions': 'var(--color-pink-700)',
                        // 表头单元格边框颜色 <th> 标签边框
                        '--tw-prose-th-borders': 'var(--color-pink-300)',
                        // 表格数据单元格边框颜色 <td> 标签边框
                        '--tw-prose-td-borders': 'var(--color-pink-200)',
                        // 以下是暗色模式（使用 dark 类时）的对应设置
                        // 暗色模式下的正文文本颜色
                        '--tw-prose-invert-body': '#FEFCE4',
                        // 暗色模式下的标题颜色
                        '--tw-prose-invert-headings': '#E0DEC0',
                        // 暗色模式下的引导段落颜色
                        '--tw-prose-invert-lead': '#F7C9B6', // 柔和橙粉色
                        // 暗色模式下的链接颜色
                        '--tw-prose-invert-links': '#F7A072', // 明亮暖橙粉
                        // 暗色模式下的粗体文本颜色
                        '--tw-prose-invert-bold': '#FEFCE4',
                        // 暗色模式下的有序列表数字颜色
                        '--tw-prose-invert-counters': '#F7B6A0', // 柔和橙粉
                        // 暗色模式下的无序列表项目符号颜色
                        '--tw-prose-invert-bullets': '#F7A8A0', // 偏橙粉
                        // 暗色模式下的水平分隔线颜色
                        '--tw-prose-invert-hr': '#E0B7A0', // 暖米色
                        // 暗色模式下的引用文本颜色
                        '--tw-prose-invert-quotes': '#FFD6B3', // 柔和暖色
                        // 暗色模式下的引用块边框颜色
                        '--tw-prose-invert-quote-borders': '#F7A072', // 明亮暖橙粉
                        // 暗色模式下的图片和表格标题颜色
                        '--tw-prose-invert-captions': '#F7C9B6', // 柔和橙粉色
                        // 暗色模式下的表头单元格边框颜色
                        '--tw-prose-invert-th-borders': '#E0B7A0', // 暖米色
                        // 暗色模式下的表格数据单元格边框颜色
                        '--tw-prose-invert-td-borders': '#F7A8A0' // 偏橙粉
                    }
                }
            })
        }
    }
};
