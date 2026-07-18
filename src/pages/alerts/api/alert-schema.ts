import * as yup from 'yup'
import type { ObjectSchema } from 'yup'
import type { SecurityAlert } from '../../../core/types/alerts'

const requiredString = yup.string().trim().required()

export const alertSchema: ObjectSchema<SecurityAlert> = yup
  .object({
    id: requiredString,
    title: requiredString,
    severity: yup
      .mixed<SecurityAlert['severity']>()
      .oneOf(['critical', 'high', 'medium', 'low'])
      .required(),
    status: yup
      .mixed<SecurityAlert['status']>()
      .oneOf(['open', 'in_review', 'resolved', 'suppressed'])
      .required(),
    category: requiredString,
    affectedAsset: requiredString,
    domainController: requiredString,
    detectedAt: yup.string().datetime().required(),
    description: requiredString,
    recommendedAction: requiredString,
    // Assign-only API: omission means unchanged; clearing is not supported.
    assignedTo: requiredString.optional(),
  })
  .noUnknown()

export const alertsSchema = yup.array().of(alertSchema).required()
