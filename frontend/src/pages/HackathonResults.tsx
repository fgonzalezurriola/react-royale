import { useHackatons } from '@/hooks/useHackatons'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { LiveProvider, LivePreview } from 'react-live'
import { Button } from '@/components/ui/button'


const HackathonResults = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const hackatons = useHackatons()
    const hackaton = hackatons.find((h) => h.id === id)
    const allSubmissions = useSubmissions()

    // Aca obtenemos los submiteados y filtramos por los que son de esta hackathon, ademas de sortear de mayor voto a menor.
    const submissions = allSubmissions.filter((s) => s.hackatonId === id).sort((a, b) => b.votes - a.votes)

    // Inspirado en el caso de ListSumbission para cuadno no se encuentran hackathones
    if (!hackaton) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-400">Hackathon not found</h1>
            </div>
        )
    }

    // Sumamos cantidad de votos absoluto (suma de todos)
    let totalVotes = 0
    for (const submission of submissions) {
        totalVotes += submission.votes
    }

    // Aca mostramos resultados
    return (
        <div className="p-6">

            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">{hackaton.title} - Results</h1>
                <p className="text-gray-700 mb-4">{hackaton.description}</p>

                <div className="flex gap-6 text-sm text-gray-600 mb-2">
                    <div>
                        <span className="font-semibold">Periodo de votacion: </span>
                        {new Date(hackaton.startVotingDate).toLocaleDateString('en-GB')} - {new Date(hackaton.endVotingDate).toLocaleDateString('en-GB')}
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

            {/* Caso donde no hay ningun submiteado */}
            {submissions.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl text-gray-600">No submissions yet</h2>
                </div>
            ) : (
                <div>

                    <h2 className="text-xl font-semibold mb-6">Ranking (total subidos: {submissions.length})</h2>

                    <div className="space-y-4">
                        {submissions.map((submission, index) => {
                            const porcentaje = totalVotes > 0 ? (submission.votes / totalVotes) * 100 : 0

                            return (
                                <div key={submission.id} className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition">
                                    <div className="flex gap-6">
                                        {/* Para listar la posicion */}
                                        <div className="flex flex-col items-center justify-center min-w-[60px]">
                                            <span className="text-2xl font-bold text-gray-700"> # {index + 1}</span>
                                        </div>

                                        {/* Preview usando el estilo dle live */}
                                        <div className="flex-shrink-0 w-48">
                                            <LiveProvider code={submission.jsxCode} scope={{}}>
                                                <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-center h-40">
                                                    <LivePreview />
                                                </div>
                                            </LiveProvider>
                                        </div>

                                        {/* Seleccionar alguno */}
                                        <div className="flex-grow">
                                            <Link to={`/hackaton/${id}/submission/${submission.id}`} className="text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline">
                                                {submission.title}
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-1 mb-3">
                                                by {submission.participantName} •{' '}
                                                {new Date(submission.submissionDate).toLocaleDateString('en-GB')}
                                            </p>
                                            {submission.description && (
                                                <p className="text-gray-700 text-sm line-clamp-2">{submission.description}</p>
                                            )}
                                        </div>

                                        {/* Votos */}
                                        <div className="flex flex-col items-end justify-center min-w-[140px]">
                                            <div className="text-4xl font-bold text-blue-600">
                                                {submission.votes}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                {submission.votes === 1 ? 'vote' : 'votos'}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-2">
                                                {Math.round(porcentaje * 10) / 10}% of total
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${porcentaje}%` }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

        </div>
    )
}



export { HackathonResults }