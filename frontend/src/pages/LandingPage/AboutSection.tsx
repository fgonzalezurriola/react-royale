import { Zap, Laugh, Target, Sparkles } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export const AboutInfo = () => {
    return (<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Join Our Silly Hackathons?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Embrace the chaos, laugh at your bugs, and compete in the most absurdly fun coding challenges
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Fast-Paced"
                description="Quick coding sprints where the best terrible ideas win"
            />
            <FeatureCard
                icon={<Laugh className="w-8 h-8" />}
                title="Silly"
                description="Build the worst form component, ugliest UI, or most overengineered solution"
            />
            <FeatureCard
                icon={<Target className="w-8 h-8" />}
                title="Challenging"
                description="Compete in hilariously difficult challenges that test your creativity"
            />
            <FeatureCard
                icon={<Sparkles className="w-8 h-8" />}
                title="Creative"
                description="No boring projects here—only the most wonderfully absurd ideas allowed"
            />
        </div>
    </section>)
}