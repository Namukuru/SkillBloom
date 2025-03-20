import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const SkillExchange = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [teachingSkill, setTeachingSkill] = useState("");
  const [learningSkill, setLearningSkill] = useState("");
  const [matches, setMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false); // Control visibility

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/skills/");
        setSkills(response.data.skills || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSkills([]);
      }
    };
    fetchSkills();
  }, []);

  const handleFindMatch = async () => {
    if (!teachingSkill || !learningSkill) {
      alert("Please select both skills.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/find_match/", {
        
        learn: learningSkill,
      });

      if (response.data.match) {
        setMatches([response.data.match]);
        setShowMatches(true);
      } else {
        alert(response.data.message || "No match found.");
        setMatches([]);
        setShowMatches(false);
      }
    } catch (error) {
      console.error("Error finding a match:", error);
      alert("An error occurred while finding a match. Please try again.");
      setShowMatches(false);
    }
  };

  const handleConnect = (matchId) => {
    if (!learningSkill) {
      alert("Please select a skill before connecting.");
      return;
    }
    localStorage.setItem("selectedSkill", learningSkill); // Store skill before navigating
    navigate(`/chat/${matchId}`);
  };
  

  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-800 text-white">
        <div className="flex flex-col items-center flex-grow p-5">
          <h1 className="text-3xl font-bold text-purple-400">Skill Exchange Hub</h1>
          <p className="text-sm text-gray-300 mb-5">Get matched with relevant skills using our AI model</p><br></br>

          <Card className="w-full max-w-lg bg-gray-700 p-6 rounded-2xl">
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-center">Find a Skill Exchange</h2>

              <div className="flex justify-between">
                <div className="flex flex-col w-1/2 px-2">
                  <label className="text-sm mb-1">I can teach ...</label>
                  <Select onValueChange={setTeachingSkill}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white border border-gray-600 rounded-md shadow-lg">
                      {skills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.name} className="hover:bg-gray-700">
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col w-1/2 px-2">
                  <label className="text-sm mb-1">I want to learn ...</label>
                  <Select onValueChange={setLearningSkill}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white border border-gray-600 rounded-md shadow-lg">
                      {skills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.name} className="hover:bg-gray-700">
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleFindMatch} className="w-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center gap-2">
    <img src="reload.png" alt="Reload Icon" className="w-5 h-5" />
    <span>Find a match</span>
  </Button>
            </CardContent>
          </Card>

          {/* Available Matches - Only show after clicking Find a Match */}
          {showMatches && (
            <div className="mt-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold">Available Matches</h3>
              {matches.length > 0 ? (
                matches.map((match, index) => (
                  <Card key={index} className="p-3 my-2 bg-gray-700 rounded-lg">
                    <CardContent className="flex justify-between items-center">
                      <span>{match.name} - {match.skill}</span>
                      <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => handleConnect(match.id)}>
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center mt-2">No matches found</p>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <footer className="w-full text-xs text-gray-400 text-center py-3 bg-gray-900 mt-auto">
          © 2025 Copyright: SkillBloom
        </footer>
      </div>
    </div>
  );
};

export default SkillExchange;
