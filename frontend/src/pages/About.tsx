import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-neonGreen font-mono flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 border-b border-neonGreen pb-2">About D_CODE</h1>

      <div className="max-w-3xl text-center space-y-6 text-lg">
        <p>
          <span className="text-neonGreen font-semibold">D_CODE</span> is a real-time collaborative coding platform
          built for developers who love to code together from anywhere in the world.
        </p>

        <p>
          Whether you're brainstorming ideas, solving bugs, or doing mock interviews — D_CODE empowers you to
          <span className="text-neonGreen font-semibold"> code. sync. ship.</span> in the most seamless way.
        </p>

        <p>
          Built with ❤️ using <span className="text-neonGreen font-semibold">React</span>,{" "}
          <span className="text-neonGreen font-semibold">Tailwind CSS</span>, and Rust.
        </p>

      </div>
    </div>
  );
};

export default About;
