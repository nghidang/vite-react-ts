// ============================================================
// Button.native.tsx
// 📱 REACT NATIVE
// Metro tự pick file này thay vì Button.tsx.
// ============================================================

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import type { PressableStateCallbackType, ViewStyle } from 'react-native'
import {
  BUTTON_DISABLED,
  BUTTON_SIZES,
  BUTTON_VARIANT_COLORS,
} from './button.constants'
import type { ButtonAppearance, ButtonBaseProps, ButtonVariant } from './button.types'

type ButtonNativeProps = ButtonBaseProps & {
  onPress?: () => void
  style?:   ViewStyle
  testID?:  string
}

// ── Style helpers ─────────────────────────────────────────────────

function getContainerStyle(
  appearance: ButtonAppearance,
  variant: ButtonVariant,
  pressed: boolean,
  isDisabled: boolean,
): ViewStyle {
  if (isDisabled) {
    return {
      backgroundColor: appearance === 'filled' ? BUTTON_DISABLED.bg : 'transparent',
      borderColor:     BUTTON_DISABLED.borderColor,
      borderWidth:     appearance === 'outline' ? 1.5 : 0,
    }
  }

  const v = BUTTON_VARIANT_COLORS[variant]

  switch (appearance) {
    case 'filled':
      return {
        backgroundColor: pressed ? v.accentPress : v.accent,
        borderColor:     'transparent',
        borderWidth:     0,
      }
    case 'outline':
      return {
        backgroundColor: pressed ? v.accentMid : 'transparent',
        borderColor:     v.accent,
        borderWidth:     1.5,
      }
    case 'clear':
      return {
        backgroundColor: pressed ? v.accentMid : 'transparent',
        borderColor:     'transparent',
        borderWidth:     0,
      }
  }
}

function getTextColor(
  appearance: ButtonAppearance,
  variant: ButtonVariant,
  isDisabled: boolean,
): string {
  if (isDisabled) return BUTTON_DISABLED.text
  const v = BUTTON_VARIANT_COLORS[variant]
  return appearance === 'filled' ? v.textOnFill : v.accent
}

// ── Component ─────────────────────────────────────────────────────

export function Button({
  appearance = 'filled',
  variant    = 'primary',
  size       = 'medium',
  disabled   = false,
  loading    = false,
  leftIcon,
  rightIcon,
  children,
  onPress,
  style,
  testID,
}: ButtonNativeProps) {
  const sizeToken  = BUTTON_SIZES[size]
  const isDisabled = disabled || loading
  const textColor  = getTextColor(appearance, variant, isDisabled)

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.base,
        {
          paddingVertical:   sizeToken.paddingVertical,
          paddingHorizontal: sizeToken.paddingHorizontal,
          borderRadius:      sizeToken.borderRadius,
          gap:               sizeToken.gap,
        },
        getContainerStyle(appearance, variant, pressed, isDisabled),
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} style={styles.icon} />
      ) : (
        leftIcon && <View style={styles.icon}>{leftIcon}</View>
      )}

      <Text
        style={[
          styles.label,
          {
            fontSize:   sizeToken.fontSize,
            lineHeight: sizeToken.lineHeight,
            color:      textColor,
          },
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>

      {!loading && rightIcon && (
        <View style={styles.icon}>{rightIcon}</View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign:  'center',
    flexShrink: 1,
  },
  icon: {
    flexShrink: 0,
  },
})
