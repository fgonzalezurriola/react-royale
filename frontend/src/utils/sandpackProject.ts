import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { baseFiles } from '@/sandpack/templates'

export interface SandpackProject {
  entry: string
  files: SandpackFiles
}

interface SerializedSandpackFile {
  code: string
  hidden?: boolean
}

interface SerializedSandpackProject {
  version: number
  entry: string
  files: Record<string, SerializedSandpackFile>
}

const DEFAULT_ENTRY = '/App.jsx'
const PROJECT_VERSION = 1

const normalizeFiles = (files: SandpackFiles): Record<string, SerializedSandpackFile> => {
  return Object.entries(files).reduce<Record<string, SerializedSandpackFile>>(
    (acc, [filePath, file]) => {
      if (typeof file === 'string') {
        acc[filePath] = { code: file }
      } else {
        acc[filePath] = { code: file.code, hidden: file.hidden }
      }
      return acc
    },
    {},
  )
}

export const createDefaultProject = (): SandpackProject => {
  const files: SandpackFiles = {}
  for (const [filePath, code] of Object.entries(baseFiles)) {
    files[filePath] = { code }
  }
  return {
    entry: DEFAULT_ENTRY,
    files,
  }
}

export const serializeProject = (project: SandpackProject): string => {
  return JSON.stringify({
    version: PROJECT_VERSION,
    entry: project.entry || DEFAULT_ENTRY,
    files: normalizeFiles(project.files),
  } satisfies SerializedSandpackProject)
}

export const deserializeProject = (payload: string): SandpackProject => {
  try {
    const parsed = JSON.parse(payload) as Partial<SerializedSandpackProject>
    if (!parsed || typeof parsed !== 'object' || !parsed.files) {
      throw new Error('Invalid payload')
    }

    const files: SandpackFiles = {}
    for (const [filePath, file] of Object.entries(parsed.files)) {
      files[filePath] = { code: file.code, hidden: file.hidden }
    }

    if (Object.keys(files).length === 0) {
      throw new Error('No files present')
    }

    return {
      entry: parsed.entry || DEFAULT_ENTRY,
      files,
    }
  } catch {
    return {
      entry: DEFAULT_ENTRY,
      files: {
        '/App.jsx': {
          code: payload,
        },
      },
    }
  }
}

export const filesToPlainRecord = (files: SandpackFiles): Record<string, string> => {
  return Object.entries(files).reduce<Record<string, string>>((acc, [filePath, file]) => {
    acc[filePath] = typeof file === 'string' ? file : file.code
    return acc
  }, {})
}
