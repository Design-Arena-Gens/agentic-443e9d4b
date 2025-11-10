import Link from 'next/link';
import { fetchLeaderboard, fetchTrendingMarkets } from '@/lib/polymarket';
import type { WhaleSummary } from '@/lib/polymarket';

export const revalidate = 60;

function formatCurrency(value: number) {
  const prefix = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${prefix}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${prefix}$${(abs / 1_000).toFixed(1)}K`;
  }
  return `${prefix}$${abs.toFixed(0)}`;
}

function WhaleCard({ whale }: { whale: WhaleSummary }) {
  return (
    <Link
      href={`/whale/${whale.proxyWallet}`}
      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-transform hover:-translate-y-1 hover:border-accent"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-slate-800 text-lg font-semibold text-accent">
          #{whale.rank}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-50 group-hover:text-accent">
            {whale.name}
          </h3>
          <p className="text-sm text-slate-400">
            {whale.pseudonym !== whale.name ? whale.pseudonym : whale.proxyWallet}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
            <span>
              <span className="font-medium text-slate-200">Volume:</span>{' '}
              {formatCurrency(whale.volume)}
            </span>
            <span>
              <span className="font-medium text-slate-200">PnL:</span>{' '}
              <span
                className={
                  whale.pnl >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'
                }
              >
                {formatCurrency(whale.pnl)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [whales, markets] = await Promise.all([
    fetchLeaderboard(),
    fetchTrendingMarkets(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 py-12">
      <section className="space-y-4">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            Follow The Sharpest Polymarket Whales
          </h1>
          <p className="text-lg text-slate-300">
            Explore the highest volume traders on Polymarket, monitor their on-chain
            stats, and discover the hottest markets attracting whale capital right now.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">
            Leaderboard
          </h2>
          <span className="text-sm text-slate-400">
            Data refreshes every minute
          </span>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {whales.map((whale) => (
            <WhaleCard key={whale.proxyWallet} whale={whale} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">
            Markets On Whale Watch
          </h2>
          <span className="text-sm text-slate-400">
            Ranked by 24h volume
          </span>
        </header>
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead>
              <tr className="bg-slate-900 text-left text-slate-400">
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">24h Volume</th>
                <th className="px-4 py-3 font-medium">Liquidity</th>
                <th className="px-4 py-3 font-medium">Bid / Ask</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {markets.slice(0, 12).map((market) => (
                <tr key={market.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-200">
                    <div className="max-w-md text-sm font-medium leading-snug">
                      {market.question}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {market.category ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {formatCurrency(market.volume24h)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {formatCurrency(market.liquidity)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {market.bestBid !== null && market.bestAsk !== null
                      ? `${(market.bestBid * 100).toFixed(1)}% / ${(market.bestAsk * 100).toFixed(1)}%`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
