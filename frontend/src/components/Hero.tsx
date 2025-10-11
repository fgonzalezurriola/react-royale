import { HeroHighlight, Highlight } from './ui/hero-highlight'

function Hero() {
  return (
    <HeroHighlight>
      <h1 className="text-8xl font-bold text-center py-12 ">
        Welcome to{' '}
        <Highlight className="bg-gradient-to-tr from-yellow-200 to-pink-400">
          React Royale
        </Highlight>
      </h1>
      <p className="text-2xl text-center">A website where you can participate in UI battles</p>
    </HeroHighlight>
  )
}

export { Hero }
