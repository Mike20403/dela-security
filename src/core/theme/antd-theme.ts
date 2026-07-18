import type { ThemeConfig } from 'antd'
import { tokens } from './tokens'

const toPixels = (value: string) => Number.parseFloat(value) * 16

export const antdTheme = {
  cssVar: { key: 'dela-security', prefix: 'dela' },
  hashed: true,
  token: {
    colorPrimary: tokens.semantic.action.primary,
    colorLink: tokens.semantic.action.primary,
    colorInfo: tokens.semantic.action.primary,
    colorError: tokens.semantic.severity.critical,
    colorWarning: tokens.semantic.severity.medium,
    colorSuccess: tokens.semantic.status.resolved,
    colorBgLayout: tokens.semantic.surface.canvas,
    colorBgContainer: tokens.semantic.surface.container,
    colorBgElevated: tokens.semantic.surface.elevated,
    colorText: tokens.semantic.text.primary,
    colorTextSecondary: tokens.semantic.text.secondary,
    colorTextDisabled: tokens.semantic.text.disabled,
    colorBorder: tokens.semantic.border.default,
    colorBorderSecondary: tokens.semantic.border.subtle,
    colorTextLightSolid: tokens.semantic.text.inverse,
    fontFamily: tokens.primitive.typography.sans,
    fontFamilyCode: tokens.primitive.typography.mono,
    fontSize: toPixels(tokens.primitive.typography.sm),
    fontWeightStrong: tokens.primitive.typography.weightSemibold,
    borderRadius: toPixels(tokens.primitive.radius.md),
    boxShadow: tokens.primitive.elevation.md,
    boxShadowSecondary: tokens.primitive.elevation.sm,
    controlOutline: tokens.semantic.focus.ring,
    controlOutlineWidth: 2,
    lineWidthFocus: 2,
    motionDurationFast: tokens.primitive.motion.fast,
    motionDurationMid: tokens.primitive.motion.normal,
    screenSM: toPixels(tokens.primitive.breakpoint.sm),
    screenMD: toPixels(tokens.primitive.breakpoint.md),
    screenLG: toPixels(tokens.primitive.breakpoint.lg),
    screenXL: toPixels(tokens.primitive.breakpoint.xl),
  },
} satisfies ThemeConfig
