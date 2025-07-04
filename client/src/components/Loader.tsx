import Lottie from 'lottie-react';
import atomAnimation from '@/lottie/atom.json';

export default function Loader() {
  return (
    <Lottie
      animationData={atomAnimation}
      loop
      className="w-24 h-24 m-4 mx-auto"
      data-testid="lottie-loader"
    />
  );
}
