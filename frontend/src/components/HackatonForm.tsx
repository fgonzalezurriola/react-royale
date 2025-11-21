import { useState } from 'react'
import { toast } from 'react-toastify'
import { useField } from '@/hooks/useField'
import type { UserData } from '@/types/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { AxiosError } from 'axios'
import { useHackatonStore } from '@/stores/hackatonStore'
import { useNavigate } from 'react-router-dom'

const HackatonForm = ({ user }: { user: UserData }) => {
  const navigate = useNavigate()
  const title = useField('text')
  const description = useField('text')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [startVotingDate, setStartVotingDate] = useState<string>('')
  const [endVotingDate, setEndVotingDate] = useState<string>('')

  if (!user) {
    return <div className="text-center p-8">You must be logged in to create a hackathon.</div>
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const hackaton = {
      title: title.value,
      description: description.value,
      startDate,
      endDate,
      startVotingDate,
      endVotingDate,
      host: user.id,
    }

    try {
      await useHackatonStore.getState().createHackaton(hackaton)
      toast.success(`Hackathon ${title.value} created successfully!`)
      navigate('/')
    } catch (error: unknown) {
      let errorMessage = 'Error creating hackathon'
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error
      }
      toast.error(errorMessage)
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title.value}
          onChange={title.onChange}
          placeholder="Hackathon title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description.value}
          onChange={description.onChange}
          placeholder="Describe the hackathon..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <DatePicker value={startDate} onChange={setStartDate} placeholder="Pick start date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <DatePicker value={endDate} onChange={setEndDate} placeholder="Pick end date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startVotingDate">Start Voting Date</Label>
        <DatePicker
          value={startVotingDate}
          onChange={setStartVotingDate}
          placeholder="Pick start voting date"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endVotingDate">End Voting Date</Label>
        <DatePicker
          value={endVotingDate}
          onChange={setEndVotingDate}
          placeholder="Pick end voting date"
        />
      </div>

      <Button type="submit" className="w-full">
        Create Hackathon
      </Button>
    </form>
  )
}

export { HackatonForm }
