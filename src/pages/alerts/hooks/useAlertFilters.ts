import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  alertFilterSchema,
  defaultAlertFilters,
  type AlertFilters,
} from '../alert-filter-schema'

export function useAlertFilters(onReset: () => void) {
  const form = useForm<AlertFilters>({
    defaultValues: defaultAlertFilters,
    resolver: yupResolver(alertFilterSchema, { strict: true }),
  })
  const [filters, setFilters] = useState(defaultAlertFilters)

  return {
    form,
    filters,
    apply: form.handleSubmit(setFilters),
    reset: () => {
      form.reset(defaultAlertFilters)
      setFilters(defaultAlertFilters)
      onReset()
    },
  }
}
