export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="stamp text-leaf-dark border-leaf mb-4">About ReFeedX</p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest mb-6">
        A simple idea: surplus should meet need, not a landfill.
      </h1>
      <div className="space-y-5 text-ink/70 leading-relaxed">
        <p>
          Every day, good food goes to waste while people nearby go without a meal — not for lack
          of food, but for lack of a way to connect the two. ReFeedX is that connection: a place
          for donors to post what they have, requesters to post what they need, and NGOs to step
          in and coordinate when a little help closes the gap.
        </p>
        <p>
          Every post carries real details — food type, quantity, timing, and location — so the
          people on both ends can make a decision fast, because food doesn’t wait. A status stamp
          follows every donation and request from posted to completed, so nothing gets lost in the
          shuffle.
        </p>
        <p>
          We built ReFeedX for the people already doing this work by phone calls and word of
          mouth — just giving them a faster, clearer way to do it.
        </p>
      </div>
    </div>
  )
}
