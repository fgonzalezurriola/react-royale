import { useState } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

const sampleCode = `() => {
  const [volume, setVolume] = React.useState(50);
  const [isMuted, setIsMuted] = React.useState(false);

  const handleVolumeChange = (e) => setVolume(Number(e.target.value));
  const toggleMute = () => setIsMuted((m) => !m);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#211e28",
      color: "#ffe6ff",
      padding: "1em",
      borderRadius: "1rem",
      width: 300,
      margin: "0 auto",
      textAlign: "center"
    }}>
      <div style={{ width: "100%" }}>
        <h3>Awful Sound Controller 2025</h3>
        <button
          style={{
            background: isMuted ? "#ff4d4f" : "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5em 1em",
            marginBottom: "1em",
            cursor: "pointer"
          }}
          onClick={toggleMute}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <div>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={isMuted}
            style={{ width: "80%" }}
          />
          <div style={{ marginTop: "0.5em" }}>
            Volume: {isMuted ? 0 : volume}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
const scope = {};

const SubmitComponent = () => {
  const [code, setCode] = useState(sampleCode);

  return (
    <div className="m-8 grid grid-cols-2 p-2 gap-8">
      <div className="col-span-2 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Awful sound controller 2025</h2>
          <p className="text-gray-600">The ultimate "terrible" sound ui controller competition. </p>
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
          <h1
            className="text-white mt-4"
            id="this is for alignment purposes lmao"
          >
            .
          </h1>
          <LivePreview />
        </div>
      </LiveProvider>
    </div>
  );
};

export default SubmitComponent;
