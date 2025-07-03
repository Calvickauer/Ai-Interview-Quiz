import styles from './page.module.css'

export default function Page() {
  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold">AI Interview Prep Quizzer</h1>
      <p className="mt-2 max-w-xl">
        Created by Calvin Moldenhauer, this app generates custom interview quizzes
        so you can practice for technical roles. Select a role, tech stack or
        paste a job listing and the AI will build questions tailored to your
        needs. Our mission is to make focused interview prep quick and
        accessible.
      </p>
    </main>
  )
}
