import { toast } from 'react-toastify'
import { useField } from '@/hooks/useField'
import { hackatonService } from '@/services/hackatons'
import type { UserData, Hackaton } from '@/types/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AxiosError } from 'axios'

const HackatonForm = ({ user }: { user: UserData }) => {
  const title = useField('text')
  const description = useField('text')
  const startDate = useField('date')
  const endDate = useField('date')
  const startVotingDate = useField('date')
  const endVotingDate = useField('date')

  if (!user) {
    return <div className="text-center p-8">You must be logged in to create a hackathon.</div>
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const hackaton: Omit<Hackaton, 'id'> = {
      title: title.value,
      description: description.value,
      startDate: new Date(startDate.value),
      endDate: new Date(endDate.value),
      startVotingDate: new Date(startVotingDate.value),
      endVotingDate: new Date(endVotingDate.value),
      votes: 0,
      imageUrl: null,
      host: user.id,
    }

    try {
      await hackatonService.createHackaton({ ...hackaton })
      toast.success(`Hackathon ${title.value} created successfully!`)
      title.reset()
      description.reset()
      startDate.reset()
      endDate.reset()
      startVotingDate.reset()
      endVotingDate.reset()
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
        <Input
          id="startDate"
          type="date"
          value={startDate.value}
          onChange={startDate.onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate.value}
          onChange={endDate.onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startVotingDate">Start Voting Date</Label>
        <Input
          id="startVotingDate"
          type="date"
          value={startVotingDate.value}
          onChange={startVotingDate.onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endVotingDate">End Voting Date</Label>
        <Input
          id="endVotingDate"
          type="date"
          value={endVotingDate.value}
          onChange={endVotingDate.onChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Hackathon
      </Button>
    </form>
  )
}

export { HackatonForm }
