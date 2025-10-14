import chroma from 'chroma-js'

export interface IColorPalette {
  num: number
  color: string
  text: string
}

export function useColorPalette() {
  function getHsl(color: string) {
    const hslColor = chroma(color).hsl()
    const hslC = {
      h: hslColor[0],
      s: hslColor[1] * 100,
      l: hslColor[2] * 100,
    }
    return hslC
  }
  function hexToRgb(hex: string) {
    hex = hex.replace('#', '')
    if (hex.length !== 6) {
      throw new Error('Invalid hex color value')
    }
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)
    return `${r} ${g} ${b}`
  }

  function generatePalette(color: string) {
    const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const len = colorPaletteNumbers.length
    const min = 10
    const max = 95
    const part = (max - min) / len
    const colorPalette: IColorPalette[] = []
    const primaryIndex = Math.floor(len / 2)
    const hsl = getHsl(color)
    if (hsl.l < min) hsl.l = min
    if (hsl.l > max) hsl.l = max
    colorPaletteNumbers.forEach((num, i) => {
      let hslCss = `hsl(${Object.is(Number.NaN, hsl.h) ? 0 : hsl.h}, ${hsl.s}%, ${hsl.l}%)`
      if (i !== primaryIndex) {
        const gap = Math.abs(primaryIndex - i)
        const l = i > primaryIndex ? hsl.l - gap * part : hsl.l + gap * part
        hslCss = `hsl(${Object.is(Number.NaN, hsl.h) ? 0 : hsl.h}, ${hsl.s}%, ${l}%)`
        const hex = chroma(hslCss).hex()
        const text = chroma.mix(l < 50 ? 'white' : 'black', hex, 0.5).hex()
        colorPalette.push({
          num,
          color: hex,
          text,
        })
        return void 0
      }
      const hex = chroma(hslCss).hex()
      const text = chroma.mix(hsl.l < 50 ? 'white' : 'black', hex, 0.5).hex()
      colorPalette.push({
        num,
        color,
        text,
      })
    })

    return colorPalette
  }

  return {
    /** 获取hsl */
    getHsl,
    /** 16进制转rgb */
    hexToRgb,
    /** 生成颜色调色盘 */
    generatePalette,
  }
}
