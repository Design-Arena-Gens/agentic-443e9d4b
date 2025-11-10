import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchTrendingMarkets,
  fetchWhaleDetail,
} from '@/lib/polymarket';
import FollowToggle from './follow-toggle';

export const revalidate = 120;

function formatCurrency(value: number) {
  const prefix = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${prefix}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${prefix}$${(abs / 1_000).toFixed(1)}K`;
  return `${prefix}$${abs.toFixed(0)}`;
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default async function WhalePage({
  params,
}: {
  params: { address: string };
}) {
  const [detail, markets] = await Promise.all([
    fetchWhaleDetail(params.address),
    fetchTrendingMarkets(),
  ]);

  if (!detail) {
    notFound();
  }

  const { summary, profile } = detail;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-12">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-accent hover:text-accent"
      >
        ← Back to leaderboard
      </Link>

      <section className="grid gap-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-lg font-semibold text-accent">
              #{summary.rank || '—'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">
                {profile?.name || summary.name}
              </h1>
              <p className="text-sm text-slate-400">
                {profile?.pseudonym && profile.pseudonym !== profile.name
                  ? profile.pseudonym
                  : shortenAddress(summary.proxyWallet)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Lifetime Volume
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-50">
                {formatCurrency(summary.volume)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Net PnL
              </p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  summary.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(summary.pnl)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Wallet
              </p>
              <p className="mt-1 text-base font-mono text-slate-200">
                {shortenAddress(summary.proxyWallet)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Monitor this address to stay in sync with whale positioning.
              Keep an eye on the hottest markets below—they&apos;re the ones absorbing
              the deepest liquidity right now.
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <FollowToggle
            address={summary.proxyWallet}
            name={profile?.name || summary.name}
          />
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Quick Links
            </h2>
            <div className="flex flex-col gap-2 text-sm text-accent">
              <a
                href={`https://polymarket.com/portfolio?address=${summary.proxyWallet}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                View on Polymarket →
              </a>
              <a
                href={`https://polygonscan.com/address/${summary.proxyWallet}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                View on Polygonscan →
              </a>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">
            Liquidity Magnets
          </h2>
          <span className="text-sm text-slate-400">
            Whales are sizing into markets with the heaviest 24h flows.
          </span>
        </header>
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">24h Volume</th>
                <th className="px-4 py-3 font-medium">Liquidity</th>
                <th className="px-4 py-3 font-medium">Bid / Ask</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {markets.slice(0, 15).map((market) => (
                <tr key={market.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-sm font-medium text-slate-200">
                    {market.question}
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
