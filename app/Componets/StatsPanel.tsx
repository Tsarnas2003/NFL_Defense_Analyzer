type Props = {
  stats: {
    predictedCoverage: string
    tendencies: Record<string, { plays: number; percentage: number }>
    qbStats: Record<string, { attempts: number; completions: number; yards: number; touchdowns: number; interceptions: number; completion_pct: number }>
    topWrs: { player: string; targets: number; receptions: number; yards: number; touchdowns: number; yards_per_target: number }[]
  }
  defensiveTeam: string
  offensiveTeam: string
  season: string
}

const COVERAGE_LABELS: Record<string, string> = {
  COVER_1: "Cover 1",
  COVER_2: "Cover 2",
  COVER_3: "Cover 3",
  COVER_4: "Cover 4",
  COVER_0: "Cover 0",
  COVER_6: "Cover 6",
  "2_MAN": "2 Man",
  BLOWN: "Blown",
  COVER_9: "Cover 9"
}

export default function StatsPanel({ stats, defensiveTeam, offensiveTeam, season }: Props) {
  const { tendencies, predictedCoverage, qbStats, topWrs } = stats

  // Sort coverages by percentage
  const sortedCoverages = tendencies ? Object.entries(tendencies)
  .sort((a, b) => b[1].percentage - a[1].percentage) : []

  return (
    <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Defensive Tendencies */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-1">
          {defensiveTeam} Defense — {season}
        </h2>
        <p className="text-gray-400 text-sm mb-4">Coverage Tendencies</p>

        <div className="space-y-3">
          {sortedCoverages.map(([coverage, data]) => (
            <div key={coverage}>
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-semibold ${coverage === predictedCoverage ? "text-red-400" : "text-gray-300"}`}>
                  {COVERAGE_LABELS[coverage] ?? coverage}
                  {coverage === predictedCoverage && " ← predicted"}
                </span>
                <span className="text-gray-400">{data.percentage}% ({data.plays} plays)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${coverage === predictedCoverage ? "bg-red-500" : "bg-gray-500"}`}
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QB Stats + WR Stats */}
      <div className="flex flex-col gap-6">

        {/* Top WRs */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-1">
            Top Receivers vs {COVERAGE_LABELS[predictedCoverage] ?? predictedCoverage}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{season} Season</p>

          <div className="space-y-3">
            {topWrs?.map((wr, i) => (
              <div key={wr.player} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold text-sm">#{i + 1}</span>
                  <span className="text-white font-semibold">{wr.player}</span>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <span>{wr.yards} yds</span>
                  <span className="mx-2">·</span>
                  <span>{wr.touchdowns} TD</span>
                  <span className="mx-2">·</span>
                  <span>{wr.yards_per_target} yds/tgt</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QB Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-1">
            QB Stats vs {COVERAGE_LABELS[predictedCoverage] ?? predictedCoverage}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{season}</p>

          <div className="space-y-3 max-h-48 overflow-y-auto">
                      {qbStats ? Object.entries(qbStats)
                          .sort((a, b) => b[1].attempts - a[1].attempts)
                          .slice(0, 5)
                          .map(([name, s]) => (
                              <div key={name} className="border-b border-gray-700 pb-3 last:border-0">
                                  <p className="text-white font-semibold mb-1">{name}</p>
                                  <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
                                      <div>
                                          <p className="text-white font-bold">{s.completion_pct}%</p>
                                          <p>Comp%</p>
                                      </div>
                                      <div>
                                          <p className="text-white font-bold">{s.yards}</p>
                                          <p>Yards</p>
                                      </div>
                                      <div>
                                          <p className="text-white font-bold">{s.touchdowns}</p>
                                          <p>TDs</p>
                                      </div>
                                      <div>
                                          <p className="text-white font-bold">{s.interceptions}</p>
                                          <p>INTs</p>
                                      </div>
                                  </div>
                              </div>
                          )) : <p className="text-gray-400 text-sm">No QB data available</p>}
          </div>
        </div>

      </div>
    </div>
  )
}