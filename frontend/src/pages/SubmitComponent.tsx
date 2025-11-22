import { useField } from '@/hooks/useField'
import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useHackatonStore } from '@/stores/hackatonStore'
import { useSubmissionStore } from '@/stores/submissionStore'
import { useAuthStore } from '@/stores/authStore'
import { SandpackWorkspace } from '@/components/sandpack/SandpackWorkspace'
import { createDefaultProject, serializeProject } from '@/utils/sandpackProject'
import { validateSandpackFiles, type SecurityViolation } from '@/utils/securityValidation'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { useShallow } from 'zustand/react/shallow'

const participantFeatures = [
  '✅ Multiple files & folders',
  '✅ Zustand for global state',
  '✅ Motion animations',
  '✅ Lucide icons',
  '✅ Tailwind-friendly styling',
  '✅ Console integrada para debug',
  '✅ Hot reload instantáneo',
  '✅ TypeScript (opcional)',
]

const SubmitComponent = () => {
  const [project, setProject] = useState(createDefaultProject)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [securityViolations, setSecurityViolations] = useState<SecurityViolation[]>([])
  const { id } = useParams()
  const user = useAuthStore(useShallow((state) => state.user))
  const navigate = useNavigate()
  const hackaton = useHackatonStore(useShallow((state) => state.hackatons.find((h) => h.id === id)))

  const title = useField('text')
  const description = useField('text')

  const handleWorkspaceChange = useCallback((files: SandpackFiles) => {
    setProject((prev) => ({ ...prev, files }))
    setSecurityViolations((prev) => (prev.length > 0 ? [] : prev))
  }, [])

  const runSecurityValidation = useCallback(() => {
    const validation = validateSandpackFiles(project.files)
    setSecurityViolations(validation.violations)

    if (!validation.isValid) {
      toast.error('Security rules detected disallowed APIs. Please remove them before submitting.')
    }

    return validation.isValid
  }, [project.files])

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to submit')
      navigate('/login')
      return
    }

    if (!id) {
      toast.error('Invalid hackathon')
      return
    }

    if (!title.value.trim()) {
      toast.error('Title is required')
      return
    }

    if (!description.value.trim()) {
      toast.error('Description is required')
      return
    }

    if (!runSecurityValidation()) {
      return
    }

    setIsSubmitting(true)
    try {
      const submission = {
        hackatonId: id,
        userId: user.id,
        participantName: user.name,
        title: title.value,
        description: description.value,
        jsxCode: serializeProject(project),
        submissionDate: new Date(),
        votes: 0,
      }
      await useSubmissionStore.getState().createSubmission(submission)
      toast.success('Submission successful!')
      navigate(`/hackaton/${id}`)
    } catch (error: unknown) {
      let errorMessage = 'Submission failed'
      if (error instanceof AxiosError && 'response' in error) {
        errorMessage = error?.response?.data?.error || 'Submission failed'
      }
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hackaton) {
    return (
      <div className="m-8 text-center">
        <h2 className="text-2xl text-gray-400">Hackathon not found</h2>
      </div>
    )
  }

  return (
    <div className="m-8 grid grid-cols-1 lg:grid-cols-2 p-2 gap-8">
      <div className="col-span-full mb-6">
        <Button
          className="mb-4 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          onClick={() => navigate(`/hackaton/${id}`)}
        >
          {' '}
          ← Back to hackathon
        </Button>
        <h2 className="text-3xl font-bold">{hackaton.title}</h2>
        <p className="text-gray-400 mt-2">{hackaton.description}</p>
      </div>

      <div className="col-span-full mb-4 space-y-4">
        <Input placeholder="Title" {...title} required />
        <Textarea placeholder="Description" {...description} rows={3} required />
      </div>

      <div className="col-span-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Build your component</h2>
              <Button variant="outline" type="button" onClick={runSecurityValidation}>
                Run security check
              </Button>
            </div>
            <SandpackWorkspace
              files={project.files}
              entry={project.entry}
              onStateChange={handleWorkspaceChange}
              showConsole
              height={560}
            />
            {securityViolations.length > 0 && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-semibold mb-2">Security validation failed</p>
                <ul className="list-disc list-inside space-y-1">
                  {securityViolations.slice(0, 4).map((violation) => (
                    <li key={`${violation.ruleId}-${violation.file}-${violation.line}`}>
                      {violation.title} at {violation.file}:{violation.line}
                    </li>
                  ))}
                  {securityViolations.length > 4 && (
                    <li>+{securityViolations.length - 4} more issues detected</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="xl:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What you can use</h3>
              <p className="text-sm text-slate-500 mb-4">
                Sandpack ships with the same stack as the main app. Build reusable JSX, share state
                with Zustand, animate with motion, and style quickly.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                {participantFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm mt-6 text-sm text-amber-900">
              <h4 className="font-semibold mb-2">Security reminders</h4>
              <p>
                No DOM APIs, cookies, or network calls are allowed. Use props, hooks, and state
                only.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Submitting...' : 'Submit Component'}
        </Button>
      </div>
    </div>
  )
}

export { SubmitComponent }
