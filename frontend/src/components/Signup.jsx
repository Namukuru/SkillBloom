import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    proficiency: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "skills") {
      setFormData({ ...formData, skills: [value] }); // Convert string to array
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const requestData = {
      fullName: formData.fullName,
      email: formData.email, // Backend uses email as username
      password: formData.password,
      skills: formData.skills,
      proficiency: formData.proficiency,
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        alert("Registration Successful");
      } else {
        alert(`Error signing up: ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert(`Error signing up: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-300 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 rounded" type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input className="w-full p-2 rounded" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="w-full p-2 rounded" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input className="w-full p-2 rounded" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

          <select className="w-full p-2 rounded" name="skills" value={formData.skills} onChange={handleChange} required>
            <option value="">My Skills</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science">Data Science</option>
          </select>

          <select className="w-full p-2 rounded" name="proficiency" onChange={handleChange} required>
            <option value="">Proficiency</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>

          <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded flex items-center justify-center">
            <span className="mr-2">👤➕</span> Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;