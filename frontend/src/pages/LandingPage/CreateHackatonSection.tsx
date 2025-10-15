import { Plus } from "lucide-react"
import { Link } from "react-router-dom"



export const CreateHackatonSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Want to Host a Hackathon?
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Host your own tematic hackathon and challenge others to build components around it!
                </p>
                <Link to="/create-hackathon">
                    <button className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-all transform hover:scale-105 shadow-xl">
                        <Plus className="w-6 h-6" />
                        Create Hackathon
                    </button>
                </Link>
            </div>
        </section>
    )
}
