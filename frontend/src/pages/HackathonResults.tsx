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

    // Sumamos cantidad de votos absoluto (suma de todos los votos).
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

        </div>
    )
}



export { HackathonResults }