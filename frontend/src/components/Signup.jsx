import { useState, useEffect } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: [],
    proficiency: "",
  });

  // ✅ Log formData whenever it changes
  useEffect(() => {
    console.log("🔄 Updated formData:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    console.log(`🔥 Field Changed: ${name}, New Value: ${value}`);
    console.log("Before Update:", formData);
  
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === "select-one" && name === "skills" ? [value] : value, 
      };
  
      console.log("After Update:", updatedData);
      return updatedData;
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const requestData = {
      fullName: formData.fullName,
      email: formData.email,
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
    console.log("Final formData before submission:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-300 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 rounded" type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input className="w-full p-2 rounded" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="w-full p-2 rounded" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input className="w-full p-2 rounded" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

          <select className="w-full p-2 rounded" name="skills" value={formData.skills[0] || ""} onChange={handleChange} required>
            <option value="">My Skills</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science">Data Science</option>
          </select>

          <select className="w-full p-2 rounded" name="proficiency" value={formData.proficiency || ""} onChange={handleChange} required>
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
