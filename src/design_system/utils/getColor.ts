import { colors } from './tokens'

function getColor(scale: string, shade: number) {
  return colors[scale][shade]
}

export default getColor
