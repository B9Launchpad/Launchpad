import { useEffect, useRef } from "react";

interface OnboardingProps {
    onNext: () => void;
}

const OnboardingVideo: React.FC<OnboardingProps> = ({onNext}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
    }
  }, []);


  return (
    <video
      ref={videoRef}
      src="/static/Intrograph.mp4"
      className="fullscreen-video"
      autoPlay
      muted
      onEnded={onNext}
      playsInline
    />
  );
};

export default OnboardingVideo;