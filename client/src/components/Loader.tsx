import Lottie from 'lottie-react';
import atomAnimation from '@/lottie/atom.json';

export default function Loader() {
  return (
    <Lottie
      animationData={atomAnimation}
      loop
      className="w-16 h-16 m-4"
      data-testid="lottie-loader"
    />
  );
}
