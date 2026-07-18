import { array, object, string, tuple, type InferType } from 'yup'
import type { AlertSeverity } from '../../core/types/alerts'

const severities: readonly AlertSeverity[] = [
  'critical',
  'high',
  'medium',
  'low',
]

const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/
const validDate = string()
  .required()
  .test('valid-date', 'Date range must contain valid dates.', (value) => {
    const match = dateOnlyPattern.exec(value)
    if (!match) return false
    const [, year, month, day] = match
    const parsed = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    )
    return parsed.toISOString().slice(0, 10) === value
  })
const dateRangeSchema = tuple([validDate, validDate])
  .nullable()
  .defined()
  .test('date-order', 'Start date must be on or before end date.', (value) => {
    if (value === undefined || value === null) return true
    if (!dateOnlyPattern.test(value[0]) || !dateOnlyPattern.test(value[1])) {
      return true
    }
    return value[0] <= value[1]
  })

export const alertFilterSchema = object({
  search: string().trim().defined(),
  severities: array()
    .of(string<AlertSeverity>().oneOf(severities).required())
    .defined(),
  categories: array().of(string().trim().required()).defined(),
  dateRange: dateRangeSchema,
}).noUnknown()

export type AlertFilters = InferType<typeof alertFilterSchema>

export const defaultAlertFilters: AlertFilters = {
  search: '',
  severities: [],
  categories: [],
  dateRange: null,
}
