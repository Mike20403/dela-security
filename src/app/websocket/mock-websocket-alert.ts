import {
  severityPresentation,
  statusPresentation,
} from '../../pages/alerts/alert-presentation'
import type { SecurityAlert } from '../../core/types/alerts'

// Deterministic-enough mock generator; reuses the same severity/status vocab
// as mock-alerts.ts so presentation tokens (severityPresentation/statusPresentation)
// always resolve.
let mockAlertCounter = 0

export function createMockAlert(): SecurityAlert {
  mockAlertCounter += 1
  const severities = Object.keys(
    severityPresentation,
  ) as SecurityAlert['severity'][]
  const statuses = Object.keys(statusPresentation) as SecurityAlert['status'][]
  const severity = severities[mockAlertCounter % severities.length]!
  const status = statuses[mockAlertCounter % statuses.length]!
  return {
    id: `ALT-WS-${String(mockAlertCounter).padStart(3, '0')}`,
    title: 'Live-detected directory anomaly',
    severity,
    status,
    category: 'Live Detection',
    affectedAsset: 'Unknown host',
    domainController: 'DC01.corp.example.com',
    detectedAt: new Date().toISOString(),
    description: 'A new anomaly was detected by the real-time monitoring feed.',
    recommendedAction: 'Triage the alert and confirm scope of impact.',
  }
}
