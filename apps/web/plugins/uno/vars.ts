/** 色系类型 */
type ColorsType = 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'info'
/** 色系token */
type ColorsToken = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
function createColorVars() {
  const colors: ColorsType[] = ['primary', 'success', 'warning', 'danger', 'error', 'info']
  const nums: ColorsToken[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const colorVars = {} as {
    [key: string]: string
  }
  colors.forEach((color) => {
    colorVars[color] = `rgb(var(--${color}-color))`
    nums.forEach((n) => (colorVars[`${color}-${n}`] = `rgb(var(--${color}-color-${n}))`))
  })
  return colorVars
}
const colorVars = createColorVars()
/** unocss变量 */
const themeVars = {
  colors: {
    ...colorVars,
  },
}

export { ColorsType, themeVars }
