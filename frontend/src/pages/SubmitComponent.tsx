import { useHackatons } from '@/hooks/useHackatons'
import { useLogin } from '@/hooks/useLogin'
import { useField } from '@/hooks/useField'
import { useState } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { useParams, useNavigate } from 'react-router-dom'
import { submissionService } from '@/services/submissions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

const sampleCode = `() => {
  const style = {
    background: "#211e28",
    color: "#ffe6ff",
    padding: "1em",
    borderRadius: "1rem",
  }

  return (
    <h3 style={style}>Hello World!</h3>
  );
}`

const scope = {}

const SubmitComponent = () => {
  const [code, setCode] = useState(sampleCode)
  const title = useField('text')
  const description = useField('text')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const hackatons = useHackatons()
  const { user } = useLogin()
  const hackaton = hackatons.find((hackalike) => hackalike.id == id)

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

    setIsSubmitting(true)
    try {
      await submissionService.createSubmission({
        hackatonId: id,
        participantName: user.name,
        title: title.value,
        description: description.value,
        jsxCode: code,
      })
      toast.success('Submission successful!')
      navigate(`/hackaton/${id}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'Submission failed'
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
        <h2 className="text-3xl font-bold">{hackaton.title}</h2>
        <p className="text-gray-400 mt-2">{hackaton.description}</p>
      </div>

      <div className="col-span-full mb-4 space-y-4">
        <Input placeholder="Title" {...title} required />
        <Textarea placeholder="Description" {...description} rows={3} required />
      </div>

      <LiveProvider code={code} scope={scope}>
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Code Editor</h2>
          <LiveEditor
            className="bg-[#011627] p-4 rounded-2xl font-mono text-sm min-h-[400px]"
            onChange={setCode}
          />
          <LiveError className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mt-4" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="border border-gray-700 rounded-2xl p-4 min-h-[400px] bg-gray-900/50">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>

      <div className="col-span-full flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Submitting...' : 'Submit Component'}
        </Button>
      </div>
    </div>
  )
}

export { SubmitComponent }
