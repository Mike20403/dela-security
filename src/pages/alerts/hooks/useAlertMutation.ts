import { useMutation, useQueryClient } from '@tanstack/react-query'
import { putAlertOverride } from '../../../core/persistence/db'
import type { SecurityAlert } from '../../../core/types/alerts'
import { alertKeys } from '../api/alert-query-keys'
import type { AlertsRepository, AlertUpdate } from '../api/alerts-repository'
import { fetchAlertsRepository } from '../api/fetch-alerts-repository'

interface AlertMutationVariables {
  id: string
  changes: AlertUpdate
}

type ChangedField = keyof AlertUpdate

function changedFields(changes: AlertUpdate): ChangedField[] {
  return (Object.keys(changes) as ChangedField[]).filter(
    (field) => changes[field] !== undefined,
  )
}

export function useAlertMutation(
  repository: AlertsRepository = fetchAlertsRepository,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, changes }: AlertMutationVariables) =>
      repository.update(id, changes),
    onMutate: async ({ id, changes }) => {
      await queryClient.cancelQueries({ queryKey: alertKeys.list() })
      const previous = queryClient
        .getQueryData<SecurityAlert[]>(alertKeys.list())
        ?.find((alert) => alert.id === id)
      const optimistic = previous ? { ...previous, ...changes } : undefined
      queryClient.setQueryData<SecurityAlert[]>(alertKeys.list(), (current) =>
        current?.map((alert) =>
          alert.id === id ? (optimistic ?? alert) : alert,
        ),
      )
      return { previous, optimistic, fields: changedFields(changes) }
    },
    onError: (_error, { id }, context) => {
      if (!context?.previous || !context.optimistic) return
      const { fields, optimistic, previous } = context
      queryClient.setQueryData<SecurityAlert[]>(alertKeys.list(), (current) =>
        current?.map((alert) => {
          if (alert.id !== id) return alert
          const rollback = { ...alert }
          for (const field of fields) {
            if (alert[field] === optimistic[field]) {
              Object.assign(rollback, { [field]: previous[field] })
            }
          }
          return rollback
        }),
      )
    },
    onSuccess: (updated, { changes }) => {
      queryClient.setQueryData<SecurityAlert[]>(alertKeys.list(), (current) =>
        current?.map((alert) => {
          if (alert.id !== updated.id) return alert
          const reconciled = { ...alert }
          for (const field of changedFields(changes)) {
            Object.assign(reconciled, { [field]: updated[field] })
          }
          return reconciled
        }),
      )
      void putAlertOverride(updated.id, changes)
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: alertKeys.list() }),
  })
}
