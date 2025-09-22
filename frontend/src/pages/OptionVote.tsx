import { useState, useEffect } from "react";
import { useHackatons } from "@/hooks/useHackatons";
import { useParams } from "react-router-dom";
import { LiveEditor, LivePreview, LiveProvider } from "react-live";

const sampleCode = `() => {
    const style = {
        background: "#211e28",
        color: "#ffe6ff",
        padding: "1em",
        borderRadius: "1rem",
    };

    return <h3 style={style}>Hello World!</h3>;
   };`
                            

const OptionVote = () => {
    const { id } = useParams(); // ooH boy dirty hack over here
    const hackatons = useHackatons();
    const hackaton = hackatons.find(hackalike => hackalike.id == Number(id));


    const [votes, setVotes] = useState<number>(0);
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [code, setCode] = useState(sampleCode);
    

    useEffect(() => {
        if (hackaton) {
            setVotes(hackaton.votes);
        }
    }, [hackaton]);

    const handleVote =  () => {
        if (!hasVoted && hackaton) {
            const newVotes = votes + 1;
            setVotes(newVotes);
            setHasVoted(true);
        }
    };

    if (!hackaton) {
        return <></>
    }

    // Nota: en la parte de de "Codigo" no esta bien identado pues se desfasa al mostrarlo en el navegador.
    return (
        <LiveProvider code={code} scope={{}}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{hackaton.title}</h1>
                <p className="mb-4">{hackaton.description}</p>

                <div className="grid grid-cols-12 gap-4 mb-6">
                    <div className="col-span-2 bg-gray-100 p-2 rounded-md shadow-sm">
                        <h2 className="font-semibold mb-2">Archivos</h2>
                        <div className="text-sm text-gray-600">Listado de archivos (en caso de ser mas de uno)</div>
                    </div>

                    <div className="col-span-5 bg-gray-100 p-2 rounded-md shadow-sm">
                        <h2 className="font-semibold mb-2">Código</h2>
                            <LiveEditor disabled onChange={setCode}/>
                    </div>

                    <div className="col-span-5 bg-gray-100 p-2 rounded-md shadow-sm">
                        <h2 className="font-semibold mb-2">Preview</h2>
                        <div className="bg-white h-64 flex items-center justify-center">
                            <LivePreview />                           
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <button onClick={handleVote} disabled={hasVoted} className={`px-4 py-2 rounded-lg text-white ${hasVoted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {hasVoted ? "Ya votaste" : "Votar"}
                    </button>
                    <p className="mt-2 text-lg">Votos: {votes}</p>
                </div>
            </div>
        </LiveProvider>
    );
};

export { OptionVote };
