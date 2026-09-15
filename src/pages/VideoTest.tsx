import React from "react";

const VideoTest = () => {
  return (
    <div className="min-h-screen relative bg-black">
      {/* Direct Video Test */}
      <video
        src="https://vz-8af39f0e-519.b-cdn.net/5c0c8c84-eb47-47c4-bcb5-484792933da7/play_480p.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
        }}
        onLoadStart={() => console.log("Video loading started")}
        onCanPlay={() => console.log("Video can play")}
        onPlay={() => console.log("Video is playing")}
        onError={(e) => console.error("Video error:", e)}
      />
      
      {/* Test Content */}
      <div 
        className="relative p-8 text-white text-center"
        style={{ zIndex: 10 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-black/50 p-4 rounded">
          Video Background Test
        </h1>
        <p className="text-xl bg-black/50 p-4 rounded">
          If you can see this text clearly over a video, it's working!
        </p>
      </div>
    </div>
  );
};

export default VideoTest;