import type { CSSProperties } from 'react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react'
import { sandpackDependencies } from '@/sandpack/templates'

interface SandpackPreviewFrameProps {
  files: SandpackFiles
  entry: string
  height?: number
}

const frameStyle = (height?: number): CSSProperties => ({
  minHeight: height ? `${height}px` : '250px',
})

export const SandpackPreviewFrame = ({ files, entry, height }: SandpackPreviewFrameProps) => {
  return (
    <SandpackProvider
      template="react"
      files={files}
      customSetup={{
        entry,
        dependencies: sandpackDependencies,
      }}
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50">
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          style={frameStyle(height)}
        />
      </div>
    </SandpackProvider>
  )
}
