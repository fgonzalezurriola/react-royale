import { Card, CardDescription, CardTitle } from '@/components/ui/card-hover-effect'
import { useHackatons } from '@/hooks/useHackatons'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { HackatonCards } from '@/components/HackatonCards'
import { SubmissionCards } from '@/components/SubmissionCards'
import { useSubmissions } from '@/hooks/useSubmissions'
import type { UserProp } from '@/types/types'

const ProfilePage = ({ user }: UserProp) => {
  const hackatons = useHackatons()
  const userHackatons = hackatons ? hackatons.filter((hackaton) => hackaton.id === user.id) : []
  const subs = useSubmissions()
  const userSubs = subs ? subs.filter((sub) => sub.hackatonId === user.id) : []
  const anyHackatons = userHackatons && userHackatons.length > 0
  const anySubmissions = userSubs && userSubs.length > 0

  return (
    <Card className="bg-white border-4 p-12 w-4/7 shadow-xl mx-auto text-wrap">
      <div className="flex items-center gap-12">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage
            className="h-24 w-24 md:h-32 md:w-32 rounded-2xl mt-2"
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
          />
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="lg:text-6xl sm:text-3xl">{user.username} Profile</CardTitle>{' '}
          <CardDescription className="lg:text-5xl sm:text-3xl">
            Username: {user.name}
          </CardDescription>
        </div>
      </div>
      {anyHackatons && <h1 className="text-5xl font-bold mt-10 mb-5">Your Hackatons</h1>}
      {anyHackatons && <HackatonCards hackatons={userHackatons} />}
      {anySubmissions && <h1 className="text-5xl font-bold mt-10 mb-5">Your Submissions</h1>}
      {anySubmissions && <SubmissionCards submissions={userSubs} />}
    </Card>
  )
}

export { ProfilePage }
