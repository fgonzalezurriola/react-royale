import { Card, CardDescription, CardTitle } from '@/components/ui/card-hover-effect'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { HackatonCards } from '@/components/HackatonCards'
import { SubmissionCards } from '@/components/SubmissionCards'
import type { UserProp } from '@/types/types'
import { useHackatonStore } from '@/stores/hackatonStore'
import { useSubmissionStore } from '@/stores/submissionStore'
import { useShallow } from 'zustand/react/shallow'

const ProfilePage = ({ user }: UserProp) => {
  const userHackatons = useHackatonStore(
    useShallow((state) => state.hackatons.filter((hackaton) => hackaton.host === user.id)),
  )
  const userSubs = useSubmissionStore(
    useShallow((state) => state.submissions.filter((sub) => sub.userId === user.id)),
  )

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
      {anySubmissions || anyHackatons ? (
        <h1 className="lg:text-4xl sm:text-2xl py-12">Past submissions</h1>
      ) : (
        <h1 className="lg:text-4xl sm:text-2xl py-12">No past submissions yet</h1>
      )}
      {anyHackatons && <h1 className="text-5xl font-bold mt-10 mb-5">Your Hackatons</h1>}
      {anyHackatons && <HackatonCards hackatons={userHackatons} />}
      {anySubmissions && <h1 className="text-5xl font-bold mt-10 mb-5">Your Submissions</h1>}
      {anySubmissions && <SubmissionCards submissions={userSubs} />}
    </Card>
  )
}

export { ProfilePage }
