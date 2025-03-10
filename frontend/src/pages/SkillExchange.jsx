import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const SkillExchange = () => {
  const [skills, setSkills] = useState([]);
  const [teachingSkill, setTeachingSkill] = useState("");
  const [learningSkill, setLearningSkill] = useState("");
  const [matches, setMatches] = useState([]);

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/skills/");
        console.log("API Response:", response.data); // Debugging
        setSkills(response.data.skills || []); // Extract skills array
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSkills([]); // Fallback to an empty array
      }
    };
  
    fetchSkills();
  }, []);
  // Handle match search
  const handleFindMatch = async () => {
    if (!teachingSkill || !learningSkill) {
      alert("Please select both skills.");
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/find_match/", {
        teach_skill: teachingSkill, 
        learn_skill: learningSkill,
      });
      console.log("Response Data:", response.data);
  
      if (response.data.match) {
        setMatches(response.data.match); // Store match details
      } else {
        alert(response.data.message || "No match found.");
        setMatches(null);
      }
    } catch (error) {
      console.error("Error finding a match:", error);
      alert("An error occurred while finding a match. Please try again.");
    }
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-5">
      <h1 className="text-3xl font-bold text-purple-400">Skill Exchange Hub</h1>
      <p className="text-sm text-gray-300 mb-5">Get matched with relevant skills using our AI model</p>

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
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.name}>
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
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.name}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleFindMatch} className="w-full bg-purple-500 hover:bg-purple-600">
            🔄 Find a match
          </Button>
        </CardContent>
      </Card>

      {/* Available Matches */}
      <div className="mt-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold">Available Matches</h3>
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <Card key={index} className="p-3 my-2 bg-gray-700 rounded-lg">
              <CardContent className="flex justify-between items-center">
                <span>{match.name} - {match.skill}</span>
                <Button className="bg-purple-500 hover:bg-purple-600">Connect</Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-2">No matches found</p>
        )}
      </div>

      <footer className="mt-6 text-xs text-gray-400">© 2025 Copyright: SkillBloom</footer>
    </div>
  );
};

export default SkillExchange;
