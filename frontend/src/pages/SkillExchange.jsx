import axios from "axios";
import { useState } from "react";

const SkillExchange = () => {
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [match, setMatch] = useState(null);

  const handleMatch = async () => {
    if (!teachSkill || !learnSkill) return;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/find_match/", {
        teach_skill: teachSkill,
        learn_skill: learnSkill,
      });

      setMatch(response.data.match);
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  return (
    <div className="bg-gray-700 min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-purple-400 text-xl font-semibold">Skill Exchange Hub</h1>
      <p className="text-gray-300 text-sm mt-1">Get matched with relevant skills using our AI model</p>

      <div className="bg-gray-800 p-6 rounded-lg mt-4 shadow-md w-80">
        <h2 className="text-lg font-semibold text-center">Find a Skill Exchange</h2>
        <div className="flex justify-between mt-4">
          <div className="w-1/2 pr-2">
            <label className="block text-sm">I can teach...</label>
            <select className="w-full bg-gray-600 p-2 rounded" onChange={(e) => setTeachSkill(e.target.value)}>
              <option value="">Select a skill</option>
              <option value="Photography">Photography</option>
              <option value="Coding">Coding</option>
              <option value="Cooking">Cooking</option>
            </select>
          </div>
          <div className="w-1/2 pl-2">
            <label className="block text-sm">I want to learn...</label>
            <select className="w-full bg-gray-600 p-2 rounded" onChange={(e) => setLearnSkill(e.target.value)}>
              <option value="">Select a skill</option>
              <option value="Photography">Photography</option>
              <option value="Coding">Coding</option>
              <option value="Cooking">Cooking</option>
            </select>
          </div>
        </div>

        <button className="bg-purple-500 w-full py-2 mt-4 rounded flex items-center justify-center"
          onClick={handleMatch}>
          🔄 Find a match
        </button>
      </div>

      {match && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4 shadow-md w-80">
          <h3 className="text-lg font-semibold">Available Matches</h3>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="font-semibold">{match.name}</p>
              <p className="text-gray-300">{match.skill}</p>
            </div>
            <button className="bg-purple-500 px-4 py-1 rounded">Connect</button>
          </div>
        </div>
      )}

      <footer className="mt-6 text-gray-400 text-xs">© 2025 Copyright: SkillBloom</footer>
    </div>
  );
};

export default SkillExchange;
