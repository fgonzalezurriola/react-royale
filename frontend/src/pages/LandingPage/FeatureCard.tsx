import type { JSX } from "react"

type FeatureCardProps = {
    icon: JSX.Element
    title: string
    description: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    )
}