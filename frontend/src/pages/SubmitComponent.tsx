import { useHackatons } from '@/hooks/useHackatons'
import { useState } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { useParams } from 'react-router-dom'

const sampleCode = `() => {

    const style = {
      "background": "#211e28",
      "color": "#ffe6ff",
      "padding": "1em",
      "border-radius": "1rem",
  }

    return (
        <h3 style={style}>Hello World!</h3>
    );
}

`
const scope = {}

const SubmitComponent = () => {
  const [code, setCode] = useState(sampleCode)
  const { id } = useParams()
  const hackatons = useHackatons()
  const hackaton = hackatons.find((hackalike) => hackalike.id == Number(id))

  return (
    <div className="m-8 grid grid-cols-2 p-2 gap-8">
      <div className="col-span-2 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{hackaton?.title}</h2>
          <p className="text-gray-400">{hackaton?.description}</p>
        </div>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
          type="button"
        >
          Submit Component
        </button>
      </div>
      <LiveProvider code={code} scope={scope}>
        <div>
          <h1 className="text-2xl mb-2">Create your component here!</h1>
          <LiveEditor className="bg-[#011627] p-2 rounded-2xl" onChange={setCode} />
          <LiveError />
        </div>
        <div>
          <h1 className="text-white mt-4" id="this is for alignment purposes lmao">
            .
          </h1>
          <LivePreview />
        </div>
      </LiveProvider>
    </div>
  )
}

export default SubmitComponent
