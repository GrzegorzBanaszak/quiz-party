import { Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader'

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#101018] text-[#e4e1ed]">
      <AppHeader />

      <section className="relative flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(69,38,76,0.78)_0%,rgba(35,24,47,0.66)_36%,rgba(16,16,24,0.98)_78%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#271426]/60 to-transparent" />

        <div className="relative z-10 flex w-full max-w-[410px] flex-col items-center text-center">
          <h1 className="text-[52px] leading-none font-extrabold tracking-normal text-[#d9d1ff] italic drop-shadow-[0_12px_22px_rgba(91,81,255,0.22)] sm:text-[60px]">
            Party Quiz
          </h1>

          <p className="mt-10 max-w-[340px] text-[21px] leading-[1.34] font-bold text-[#d4d0e2]">
            Create a room, invite friends, and answer fast. The ultimate live
            trivia showdown.
          </p>

          <div className="mt-9 flex w-full flex-col gap-8">
            <Link
              to="/create"
              className="flex min-h-16 items-center justify-center rounded-full bg-[#bebdff] px-8 text-[16px] font-extrabold text-[#0d00a8] shadow-[0_8px_0_#6b6eff,0_18px_32px_rgba(90,93,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[#d1d0ff] focus:ring-4 focus:ring-[#8083ff]/45 focus:outline-none active:translate-y-1 active:shadow-[0_4px_0_#6b6eff,0_12px_22px_rgba(90,93,255,0.22)]"
            >
              Create Game
            </Link>

            <Link
              to="/join"
              className="flex min-h-15 items-center justify-center rounded-full border-2 border-[#555464] bg-[#11111a]/62 px-8 text-[16px] font-extrabold text-[#e4e1ed] transition hover:border-[#c0c1ff] hover:bg-[#1f1f2a] focus:ring-4 focus:ring-[#c0c1ff]/25 focus:outline-none"
            >
              Join Game
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
