import { assertRequiredEnvVars } from '@/lib/utils/config'

export function register() {
  assertRequiredEnvVars()
}
