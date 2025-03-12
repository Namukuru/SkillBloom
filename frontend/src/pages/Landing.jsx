import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center text-white">
      {/* Hero Section */}
      <div className="w-full max-w-5xl text-center p-10">
        <h1 className="text-4xl md:text-6xl font-bold text-purple-500">
          SkillSwap - Learn, Teach, Grow!
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Exchange skills with professionals, hobbyists, and learners worldwide.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <a
            href="/Signup"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-5xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-6 text-purple-500">
          Why Join SkillSwap?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900 shadow-md rounded-lg text-center">
            <h3 className="text-xl font-bold text-purple-400">Teach & Learn</h3>
            <p className="mt-2 text-gray-400">
              Exchange knowledge in various fields from coding to music.
            </p>
          </div>
          <div className="p-6 bg-gray-900 shadow-md rounded-lg text-center">
            <h3 className="text-xl font-bold text-purple-400">
              Build Your Network
            </h3>
            <p className="mt-2 text-gray-400">
              Connect with skilled individuals globally.
            </p>
          </div>
          <div className="p-6 bg-gray-900 shadow-md rounded-lg text-center">
            <h3 className="text-xl font-bold text-purple-400">100% Free</h3>
            <p className="mt-2 text-gray-400">
              A community-driven platform with no hidden costs.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full max-w-5xl text-center mt-12 p-6">
        <h2 className="text-3xl font-semibold text-purple-500">
          Ready to Get Started?
        </h2>
        <p className="mt-2 text-lg text-gray-300">
          Sign up now and start exchanging skills today.
        </p>
        <a
          href="/Signup"
          className="mt-4 inline-block px-8 py-3 bg-purple-500 text-white text-lg rounded-lg hover:bg-purple-600 transition duration-300"
        >
          Join Now
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
