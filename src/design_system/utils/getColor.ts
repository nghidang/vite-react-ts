import { colors } from '../tokens/colors'

function getColor(scale: keyof typeof colors, shade: keyof (typeof colors)[typeof scale]): string {
  return colors[scale][shade]
}

export default getColor
