import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { sandpackDependencies } from '@/sandpack/templates'

interface SandpackWorkspaceProps {
  files: SandpackFiles
  entry: string
  readOnly?: boolean
  height?: number
  showConsole?: boolean
  onStateChange?: (files: SandpackFiles) => void
  footer?: ReactNode
}

const layoutStyle = (height?: number): CSSProperties =>
  ({
    '--sp-layout-height': height ? `${height}px` : '520px',
  }) as CSSProperties

export const SandpackWorkspace = ({
  files,
  entry,
  readOnly = false,
  height,
  showConsole = true,
  onStateChange,
  footer,
}: SandpackWorkspaceProps) => {
  return (
    <div className="space-y-4">
      <SandpackProvider
        template="react"
        files={files}
        customSetup={{
          entry,
          dependencies: sandpackDependencies,
        }}
      >
        <SandpackLayout
          style={layoutStyle(height)}
          className="rounded-2xl border border-slate-200 shadow-sm"
        >
          <SandpackFileExplorer autoHiddenFiles />
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            closableTabs={false}
            wrapContent
            readOnly={readOnly}
          />
          <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton={!readOnly} />
        </SandpackLayout>
        {showConsole && <SandpackConsole className="rounded-2xl border border-slate-200" />}
        <SandpackStateBridge onStateChange={readOnly ? undefined : onStateChange} />
      </SandpackProvider>
      {footer}
    </div>
  )
}

const SandpackStateBridge = ({
  onStateChange,
}: {
  onStateChange?: (files: SandpackFiles) => void
}) => {
  const { sandpack } = useSandpack()

  useEffect(() => {
    if (!onStateChange) return
    onStateChange(sandpack.files)
  }, [sandpack.files, onStateChange])

  return null
}
