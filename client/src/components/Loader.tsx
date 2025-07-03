// Loader.tsx
export default function Loader() {
  return (
    <div className="
      m-4 w-10 aspect-square rounded-full border-2 border-current text-black
      box-border relative origin-left animate-l2
      before:content-[''] before:absolute before:inset-0_0_auto before:m-auto
      before:w-1/2 before:aspect-square before:rounded-full before:border-2
      before:border-current before:box-content
      before:origin-[50%_calc(100%_-_4px)] before:animate-l2
      after:content-[''] after:absolute after:inset-auto_0_calc(100%_+_2px)
      after:m-auto after:w-1/2 after:aspect-square after:rounded-full
      after:border-2 after:border-current after:box-content
      after:origin-[50%_calc(200%_-_2px)] after:animate-l2-reverse
    " />
  );
}
