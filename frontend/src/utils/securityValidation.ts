import type { SandpackFiles } from '@codesandbox/sandpack-react'
import securityRulesJson from '../../../security-rules.json'
import { filesToPlainRecord } from './sandpackProject'

interface SecurityRule {
  id: string
  title: string
  message: string
  pattern: string
}

export interface SecurityViolation {
  ruleId: string
  title: string
  message: string
  file: string
  line: number
  snippet: string
}

export interface ValidationResult {
  isValid: boolean
  violations: SecurityViolation[]
}

const securityRules = securityRulesJson as SecurityRule[]

const buildRegex = (pattern: string) => new RegExp(pattern, 'i')

export const validateSandpackFiles = (files: SandpackFiles): ValidationResult => {
  const plainFiles = filesToPlainRecord(files)
  const violations: SecurityViolation[] = []

  for (const [filePath, code] of Object.entries(plainFiles)) {
    for (const rule of securityRules) {
      const regex = buildRegex(rule.pattern)
      const match = regex.exec(code)

      if (match) {
        const snippetStart = Math.max(0, match.index - 20)
        const snippetEnd = Math.min(code.length, match.index + 80)
        const snippet = code.slice(snippetStart, snippetEnd).replace(/\s+/g, ' ').trim()
        const line = code.slice(0, match.index).split('\n').length

        violations.push({
          ruleId: rule.id,
          title: rule.title,
          message: rule.message,
          file: filePath,
          line,
          snippet,
        })
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  }
}

export const formatViolations = (violations: SecurityViolation[]): string => {
  return violations
    .slice(0, 3)
    .map((violation) => `${violation.title} in ${violation.file}:${violation.line}`)
    .join('\n')
}
