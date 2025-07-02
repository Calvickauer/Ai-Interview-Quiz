import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
      <div className="text-lg font-bold">AI Quizzer</div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/quiz">Quiz</Link>
      </div>
    </nav>
  )
}
