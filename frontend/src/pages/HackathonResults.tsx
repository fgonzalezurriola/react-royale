import { useParams, Link, useNavigate } from 'react-router-dom'
import { LiveProvider, LivePreview } from 'react-live'
import { Button } from '@/components/ui/button'
import { useHackatonStore } from '@/stores/hackatonStore'
import { useSubmissionStore } from '@/stores/submissionStore'
import { useShallow } from 'zustand/react/shallow'

const HackathonResults = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const hackaton = useHackatonStore(useShallow((state) => state.hackatons.find((h) => h.id === id)))
  const submissions = useSubmissionStore(
    useShallow((state) =>
      state.submissions.filter((s) => s.hackatonId === id).sort((a, b) => b.votes - a.votes),
    ),
  )

  if (!hackaton) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-400">Hackathon not found</h1>
      </div>
    )
  }

  const now = new Date()
  const endDate = new Date(hackaton.endDate)
  const startVotingDate = new Date(hackaton.startVotingDate)
  const endVotingDate = new Date(hackaton.endVotingDate)

  const isSubmissionPeriod = now >= new Date(hackaton.startDate) && now <= endDate
  const isVotingPeriod = now > endDate && now >= startVotingDate && now <= endVotingDate
  const isPastCompetition = now > endVotingDate

  let totalVotes = 0
  for (const submission of submissions) {
    totalVotes += submission.votes
  }

  // Aca obtenemos el top 3.
  const topTres = submissions.slice(0, 3)
  // Estos son los mismos de antes pero los meto en otra variable porsiacaso.
  const restSubmissions = submissions // ooH BOY, add useless hack here

  // Aca mostramos resultados
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{hackaton.title} - Results</h1>
        <p className="text-gray-700 mb-4">{hackaton.description}</p>

        <div className="flex gap-6 text-sm text-gray-600 mb-2">
          <div>
            <span className="font-semibold">Periodo de votacion: </span>
            {new Date(hackaton.startVotingDate).toLocaleDateString('en-GB')} -{' '}
            {new Date(hackaton.endVotingDate).toLocaleDateString('en-GB')}
          </div>
        </div>

        <div className="flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Cantidad Subidos:</span> {submissions.length}
          </div>
          <div>
            <span className="font-semibold">Total de votos:</span> {totalVotes}
          </div>
        </div>
        <Button onClick={() => navigate(`/hackaton/${id}`)}> Back to Submissions</Button>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          {isSubmissionPeriod ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No submissions yet</h2>
              <p className="text-slate-600 mb-6">Be the first to participate in this hackathon!</p>
              <Button onClick={() => navigate(`/hackaton/${id}/submit`)}>
                Submit Your Entry
              </Button>
            </>
          ) : isVotingPeriod ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No submissions</h2>
              <p className="text-slate-600">
                Unfortunately, no one participated in this hackathon during the submission period.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No submissions</h2>
              <p className="text-slate-600">
                This hackathon ended without any submissions.
              </p>
            </>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Ranking (total subidos: {submissions.length})
          </h2>

          {/* Los 3 mas votados aqui */}
          <div className="space-y-4 mb-8">
            {topTres.map((submission, index) => {
              const porcentaje = totalVotes > 0 ? (submission.votes / totalVotes) * 100 : 0

              return (
                <div
                  key={submission.id}
                  className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition"
                >
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center justify-center min-w-[60px]">
                      <span className="text-2xl font-bold text-gray-700"> # {index + 1}</span>
                    </div>

                    <div className="flex-shrink-0 w-48">
                      <LiveProvider code={submission.jsxCode}>
                        <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-center h-40">
                          <LivePreview />
                        </div>
                      </LiveProvider>
                    </div>

                    <div className="flex-grow">
                      <Link
                        to={`/hackaton/${id}/submission/${submission.id}`}
                        className="text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {submission.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        by {submission.participantName} •{' '}
                        {new Date(submission.submissionDate).toLocaleDateString('en-GB')}
                      </p>
                      {submission.description && (
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {submission.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-center min-w-[140px]">
                      <div className="text-4xl font-bold text-blue-600">{submission.votes}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {submission.votes === 1 ? 'vote' : 'votos'}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {Math.round(porcentaje * 10) / 10}% of total
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/*Nuevo: tabla, asi en caso de muchos submits no hay problemas al verlos, solo se destacan los primeros 3.*/}
          {restSubmissions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Otros participantes</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full bg-white">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Posicion
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Participante
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Votos
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {restSubmissions.map((submission, index) => {
                      const porcentaje = totalVotes > 0 ? (submission.votes / totalVotes) * 100 : 0
                      const posicion_tabla = index + 1

                      return (
                        <tr key={submission.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            # {posicion_tabla}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/hackaton/${id}/submission/${submission.id}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {' '}
                              {submission.title}{' '}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.participantName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(submission.submissionDate).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600 text-right">
                            {submission.votes}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-right">
                            {Math.round(porcentaje * 10) / 10}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { HackathonResults }
