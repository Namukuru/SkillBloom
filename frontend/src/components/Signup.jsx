import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    proficiency: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔄 Updated formData:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`🔥 Field Changed: ${name}, New Value: ${value}`);
    console.log("Before Update:", formData);

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      console.log("After Update:", updatedData);
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    const requestData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      skills: [formData.skills], 
      proficiency: formData.proficiency,
    };

    try {
      // Step 1: Signup Request
      const signupResponse = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!signupResponse.ok) {
        throw new Error("Signup failed. Please try again.");
      }

      // Step 2: Auto Login after Signup
      const loginResponse = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error("Auto-login failed. Please login manually.");
      }

      // Step 3: Store token & redirect
      sessionStorage.setItem("token", loginData.token.access);

      // Show success message instantly
      Promise.resolve().then(() => {
        alert("✅ Signup successful! Redirecting...");
      });

      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-300 p-6 rounded-lg w-96 shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Create an Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 rounded border border-gray-400" type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input className="w-full p-2 rounded border border-gray-400" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="w-full p-2 rounded border border-gray-400" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input className="w-full p-2 rounded border border-gray-400" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

          <select className="w-full p-2 rounded border border-gray-400" name="skills" value={formData.skills} onChange={handleChange} required>
            <option value="">Select a skill</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science">Data Science</option>
          </select>

          <select className="w-full p-2 rounded border border-gray-400" name="proficiency" value={formData.proficiency} onChange={handleChange} required>
            <option value="">Select proficiency</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>

          <button 
            type="submit" 
            className={`w-full p-2 rounded flex items-center justify-center transition duration-300 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
            disabled={loading}
          >
            {loading ? "🔄 Signing Up..." : <><span className="mr-2">👤➕</span> Sign Up</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
