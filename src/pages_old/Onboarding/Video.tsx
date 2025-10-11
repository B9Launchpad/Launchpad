import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingProps {
    onNext: () => void;
}

const OnboardingVideo: React.FC<OnboardingProps> = ({onNext}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

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