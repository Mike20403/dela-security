import type { ThemeConfig } from 'antd'
import { systemTokens } from './tokens'

const toPixels = (value: string) => Number.parseFloat(value) * 16

export const antdTheme = {
  cssVar: { key: 'dela-security', prefix: 'dela' },
  hashed: true,
  token: {
    colorPrimary: systemTokens.color.action.primary.background,
    colorLink: systemTokens.color.action.primary.background,
    colorInfo: systemTokens.color.action.primary.background,
    colorError: systemTokens.color.feedback.danger.foreground,
    colorWarning: systemTokens.color.feedback.warning.foreground,
    colorSuccess: systemTokens.color.feedback.success.foreground,
    colorBgLayout: systemTokens.color.background.canvas,
    colorBgContainer: systemTokens.color.background.surface,
    colorBgElevated: systemTokens.color.background.elevated,
    colorText: systemTokens.color.foreground.default,
    colorTextSecondary: systemTokens.color.foreground.muted,
    colorTextDisabled: systemTokens.color.foreground.disabled,
    colorBorder: systemTokens.color.border.default,
    colorBorderSecondary: systemTokens.color.border.subtle,
    colorTextLightSolid: systemTokens.color.foreground.inverse,
    fontFamily: systemTokens.typography.body.family,
    fontFamilyCode: systemTokens.typography.code.family,
    fontSize: toPixels(systemTokens.typography.body.size),
    fontWeightStrong: systemTokens.typography.heading.weight,
    borderRadius: toPixels(systemTokens.radius.medium),
    boxShadow: systemTokens.elevation.overlay,
    boxShadowSecondary: systemTokens.elevation.surface,
    controlOutline: systemTokens.focus.ring,
    controlOutlineWidth: 2,
    lineWidthFocus: 2,
    motionDurationFast: systemTokens.motion.fast,
    motionDurationMid: systemTokens.motion.normal,
    screenSM: toPixels(systemTokens.breakpoint.sm),
    screenMD: toPixels(systemTokens.breakpoint.md),
    screenLG: toPixels(systemTokens.breakpoint.lg),
    screenXL: toPixels(systemTokens.breakpoint.xl),
  },
  components: {
    Badge: {
      colorError: systemTokens.color.action.primary.background,
      colorBgContainer: systemTokens.color.foreground.inverse,
    },
  },
} satisfies ThemeConfig
