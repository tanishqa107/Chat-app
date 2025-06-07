import { ContainerTextFlip } from "../ui/text-flip";
import { BackgroundBeams } from "../ui/background";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-8 text-center relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Friendly and easy messaging with
          </h1>
          <div className="h-16 flex items-center justify-center">
            <ContainerTextFlip 
              words={["Friends", "Family", "Anyone", "Someone"]} 
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            />
          </div>
        </div>

        <p className="max-w-2xl text-lg sm:text-xl text-neutral-300">
          Connect instantly with end-to-end encryption and seamless cross-device synchronization.
        </p>

        <div className="px-4 py-2 rounded-full bg-gradient-to-b from-black to-[#0d0d26] border border-[#3f3f60] text-sm sm:text-base font-medium text-[#d5e3f0] shadow-lg backdrop-blur-md">
          Open two windows simultaneously to test the app
        </div>

        <button 
          onClick={() => navigate("/chatpage")} 
          className="px-8 py-3 bg-white hover:bg-gray-100 rounded-xl text-black font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>

      <BackgroundBeams />
    </div>
  );
};

export default Hero;