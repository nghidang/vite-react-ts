// ============================================================
// Button.native.tsx
// 📱 REACT NATIVE — chỉ dùng cho React Native
//
// Metro bundler tự pick file này thay vì Button.tsx
// khi build cho iOS/Android.
// ============================================================

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import type { PressableStateCallbackType, ViewStyle } from 'react-native'
import { BUTTON_COLORS, BUTTON_SIZES } from './button.constants'
import type { ButtonBaseProps } from './button.types'

type ButtonNativeProps = ButtonBaseProps & {
  onPress?: () => void
  style?:   ViewStyle
  testID?:  string
}

export function Button({
  variant   = 'filled',
  size      = 'medium',
  disabled  = false,
  loading   = false,
  leftIcon,
  rightIcon,
  children,
  onPress,
  style,
  testID,
}: ButtonNativeProps) {
  const sizeToken    = BUTTON_SIZES[size]
  const colorToken   = BUTTON_COLORS[variant]
  const isDisabled   = disabled || loading

  // ── Dynamic container style per press state ───────────────
  function getContainerStyle({ pressed }: PressableStateCallbackType): ViewStyle {
    const stateKey = isDisabled ? 'disabled' : pressed ? 'press' : 'default'
    const c = colorToken[stateKey]

    return {
      backgroundColor: c.bg,
      borderColor:     c.borderColor,
      borderWidth:     c.borderWidth,
      borderRadius:    sizeToken.borderRadius,
      paddingVertical: sizeToken.paddingVertical,
      paddingHorizontal: sizeToken.paddingHorizontal,
    }
  }

  // ── Text color (not affected by pressed — only by state) ──
  const textColor = isDisabled
    ? colorToken.disabled.text
    : colorToken.default.text

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      style={(state) => [styles.base, getContainerStyle(state), style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {/* Left icon / spinner */}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.spinner}
        />
      ) : (
        leftIcon && (
          <View style={styles.iconWrapper}>
            {leftIcon}
          </View>
        )
      )}

      {/* Label */}
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

      {/* Right icon */}
      {!loading && rightIcon && (
        <View style={styles.iconWrapper}>
          {rightIcon}
        </View>
      )}
    </Pressable>
  )
}

// ── Static styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter',    // ensure Inter is loaded via expo-font / react-native-fonts
    fontWeight: '600',
    textAlign:  'center',
    flexShrink: 1,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  spinner: {
    flexShrink: 0,
  },
})
