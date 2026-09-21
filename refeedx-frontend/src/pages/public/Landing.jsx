import { Link } from 'react-router-dom'

const STEPS = [
  { n: '01', title: 'Post', body: 'A donor lists surplus food, or a requester posts what they need.' },
  { n: '02', title: 'Connect', body: 'The other side finds the post, or an NGO steps in to coordinate.' },
  { n: '03', title: 'Share', body: 'Food is picked up or delivered, straight from one plate to the next.' },
  { n: '04', title: 'Make an Impact', body: 'Less waste, one more meal served, a status stamped complete.' },
]

const STATS = [
  { value: '12,400+', label: 'Meals Shared' },
  { value: '850+', label: 'Active Donors' },
  { value: '2,100+', label: 'Food Requests Answered' },
  { value: '120+', label: 'NGOs Connected' },
]

const WHY = [
  {
    title: 'Reduce food waste',
    body: 'Surplus food finds a plate instead of a landfill, tracked from AVAILABLE to COMPLETED.',
  },
  {
    title: 'Help communities',
    body: 'Requesters post exactly what they need — food type, quantity, people to feed, by when.',
  },
  {
    title: 'Connect donors and requesters',
    body: 'Direct contact, real locations, and one tap to get directions — no middleman required.',
  },
  {
    title: 'NGO coordination',
    body: 'NGOs see both sides at once and step in to match, deliver, and close the loop.',
  },
]

export default function Landing() {
  return (
    <div>
      {/* HERO — a community board: tilted stamped tags pinned over a dark canopy-green field */}
      <section className="relative overflow-hidden bg-forest text-paper">
        <div className="absolute inset-0 bg-grain bg-grain opacity-40" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="stamp text-marigold border-marigold mb-6">Community-Powered</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight">
              Share Food.
              <br />
              Reduce Waste.
              <br />
              <span className="text-marigold">Feed Hope.</span>
            </h1>
            <p className="mt-6 text-paper/70 text-base sm:text-lg max-w-md leading-relaxed">
              ReFeedX connects donors, requesters, and NGOs so surplus food finds the people who
              need it — before it’s too late to matter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register?role=DONOR" className="btn-secondary">
                Donate Food
              </Link>
              <Link
                to="/register?role=REQUESTER"
                className="btn border-2 border-paper/30 text-paper hover:bg-paper hover:text-forest"
              >
                Request Food
              </Link>
            </div>
          </div>

          {/* Pinned stamp tags representing the donor -> requester journey */}
          <div className="relative h-80 hidden lg:block">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" fill="none">
              <path
                d="M60 60 C 160 20, 220 140, 340 250"
                stroke="#F2C777"
                strokeWidth="2"
                strokeDasharray="6 8"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>

            <div className="absolute top-4 left-2 stamp text-leaf-light border-leaf-light bg-forest-900/80 -rotate-6 shadow-stamp">
              Vegetarian Meals · Serves 30
            </div>
            <div className="absolute top-32 left-24 stamp text-marigold border-marigold bg-forest-900/80 rotate-3 shadow-stamp">
              Reserved
            </div>
            <div className="absolute bottom-10 right-2 stamp text-paper border-paper/70 bg-forest-900/80 -rotate-3 shadow-stamp">
              Requester · MG Road
            </div>
            <div className="absolute bottom-0 right-28 stamp text-forest-100 border-forest-400 bg-forest-900/80 rotate-6 shadow-stamp">
              Completed
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — a real sequence, so numbering carries genuine meaning here */}
      <section className="bg-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="stamp text-leaf-dark border-leaf mb-4">How ReFeedX Works</p>
          <h2 className="font-display text-3xl font-bold text-forest mb-14 max-w-lg">
            From surplus to someone’s table, in four stamped steps.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                <div className="card h-full">
                  <span className="font-stamp text-marigold-dark text-sm font-semibold">{step.n}</span>
                  <h3 className="font-display text-lg font-bold text-forest mt-3 mb-2">{step.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{step.body}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-forest-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-forest-900 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-stamp text-marigold text-3xl sm:text-4xl font-semibold">{stat.value}</p>
              <p className="text-paper/50 text-xs uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY REFEEDX */}
      <section className="bg-forest-50/40 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="stamp text-tomato-dark border-tomato mb-4">Why ReFeedX</p>
          <h2 className="font-display text-3xl font-bold text-forest mb-14 max-w-lg">
            Built for the people doing the actual work of feeding a community.
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {WHY.map((item) => (
              <div key={item.title} className="card">
                <h3 className="font-display text-lg font-bold text-forest mb-2">{item.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-marigold py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
            One meal can make a difference.
          </h2>
          <p className="text-forest-900/70 mb-8 max-w-lg mx-auto">
            Whether you have food to give or a community to feed, ReFeedX makes the connection
            simple — and keeps track of every plate along the way.
          </p>
          <Link to="/register" className="btn bg-forest text-paper hover:bg-forest-600">
            Join ReFeedX
          </Link>
        </div>
      </section>
    </div>
  )
}
