import {
  REPORT_DATE,
  PRODUCT_NAME,
  CATEGORY,
  EXECUTIVE_SUMMARY,
  COMPETITORS,
  FEATURES,
  WHITE_SPACE,
  ACTION_PLAN,
  SOURCES,
} from "@/data/report";

const COLS = ["Play", "YouTube", "VLC", "MX Player", "Infuse", "nPlayer", "Plex"];

function cell(val: "✓" | "~" | "✗") {
  if (val === "✓") return <span className="text-green-400 text-lg font-bold">✓</span>;
  if (val === "~") return <span className="text-yellow-400 text-lg">~</span>;
  return <span className="text-red-500 text-lg font-bold">✗</span>;
}

function ThreatBadge({ level }: { level: "high" | "medium" | "low" }) {
  const cls =
    level === "high"
      ? "bg-red-500/20 text-red-400 border border-red-500/30"
      : level === "medium"
      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      : "bg-green-500/20 text-green-400 border border-green-500/30";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cls}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

export default function Report() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111] sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF2D55] flex items-center justify-center text-white font-bold text-sm">P</div>
            <div>
              <span className="font-bold text-white">Play</span>
              <span className="text-white/40 mx-2">·</span>
              <span className="text-white/50 text-sm">Competitive Analysis</span>
            </div>
          </div>
          <span className="text-white/40 text-sm">{REPORT_DATE}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">

        {/* Page 1: Executive Summary */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Page 1</div>
          <h1 className="text-4xl font-bold text-white mb-2">{PRODUCT_NAME}</h1>
          <p className="text-white/40 text-lg mb-8">{CATEGORY} · {REPORT_DATE}</p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Positioning Statement (Dunford)</div>
            <p className="text-white/80 text-lg leading-relaxed">{EXECUTIVE_SUMMARY.positioning}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {EXECUTIVE_SUMMARY.recommendations.map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-7 h-7 rounded-full bg-[#FF2D55]/20 flex items-center justify-center text-[#FF2D55] font-bold text-sm mb-3">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{r.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Wins / Gaps snapshot */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Where We Stand</div>
          <h2 className="text-2xl font-bold text-white mb-2">What Play wins — and what's still missing</h2>
          <p className="text-white/40 text-sm mb-6">
            Every row is a feature that matters to buyers. Green = Play ships it. Red = still a gap.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Wins */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-green-500/15 flex items-center gap-2">
                <span className="text-green-400 text-lg font-bold">✓</span>
                <span className="font-bold text-white">What Play is ahead on</span>
                <span className="ml-auto text-xs text-green-400/70 font-semibold">
                  {FEATURES.filter((f) => f.play === "✓").length} of {FEATURES.length} features
                </span>
              </div>
              <div className="divide-y divide-green-500/10">
                {FEATURES.filter((f) => f.play === "✓").map((f, i) => {
                  const others = [f.youtube, f.vlc, f.mx, f.infuse, f.nplayer, f.plex];
                  const competitors = ["YouTube", "VLC", "MX Player", "Infuse", "nPlayer", "Plex"];
                  const losing = competitors.filter((_, j) => others[j] === "✗");
                  const partial = competitors.filter((_, j) => others[j] === "~");
                  return (
                    <div key={i} className="px-5 py-3 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-sm text-white font-medium">{f.feature}</span>
                        {(losing.length > 0 || partial.length > 0) && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {losing.map((c) => (
                              <span key={c} className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded">
                                {c} ✗
                              </span>
                            ))}
                            {partial.map((c) => (
                              <span key={c} className="text-[10px] bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded">
                                {c} ~
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white/30 shrink-0 mt-1">wt {f.weight}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gaps */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-red-500/15 flex items-center gap-2">
                <span className="text-red-400 text-lg font-bold">✗</span>
                <span className="font-bold text-white">What we're still missing</span>
                <span className="ml-auto text-xs text-red-400/70 font-semibold">
                  {FEATURES.filter((f) => f.play === "✗").length} gaps remaining
                </span>
              </div>
              <div className="divide-y divide-red-500/10">
                {FEATURES.filter((f) => f.play === "✗").map((f, i) => {
                  const others = [f.youtube, f.vlc, f.mx, f.infuse, f.nplayer, f.plex];
                  const competitors = ["YouTube", "VLC", "MX Player", "Infuse", "nPlayer", "Plex"];
                  const hasIt = competitors.filter((_, j) => others[j] === "✓");
                  return (
                    <div key={i} className="px-5 py-3 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-sm text-white font-medium">{f.feature}</span>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {hasIt.map((c) => (
                            <span key={c} className="text-[10px] bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded">
                              {c} ✓
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-white/30 shrink-0 mt-1">wt {f.weight}</span>
                    </div>
                  );
                })}
              </div>

              {/* Partial */}
              <div className="border-t border-yellow-500/15">
                <div className="px-5 py-3 flex items-center gap-2 bg-yellow-500/5">
                  <span className="text-yellow-400 font-bold">~</span>
                  <span className="text-sm font-semibold text-white/70">Partial / in progress</span>
                  <span className="ml-auto text-xs text-yellow-400/70 font-semibold">
                    {FEATURES.filter((f) => f.play === "~").length}
                  </span>
                </div>
                {FEATURES.filter((f) => f.play === "~").map((f, i) => (
                  <div key={i} className="px-5 py-3 border-t border-yellow-500/10">
                    <span className="text-sm text-white/70">{f.feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Page 2: Competitive Landscape */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Page 2</div>
          <h2 className="text-2xl font-bold text-white mb-6">Competitive Landscape</h2>

          <div className="space-y-4">
            {COMPETITORS.map((c) => (
              <div key={c.name} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">{c.name}</h3>
                      <ThreatBadge level={c.threat} />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/40 flex-wrap">
                      <span>{c.stage}</span>
                      <span>·</span>
                      <span>{c.pricing}</span>
                      <span>·</span>
                      <span>{c.rating}</span>
                      <span>·</span>
                      <span>{c.installs}</span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Strengths</div>
                    <ul className="space-y-1">
                      {[c.strength1, c.strength2, c.strength3].map((s, i) => (
                        <li key={i} className="text-sm text-white/60 flex gap-2">
                          <span className="text-green-400 shrink-0">+</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Weaknesses</div>
                    <ul className="space-y-1">
                      {[c.weakness1, c.weakness2, c.weakness3].map((w, i) => (
                        <li key={i} className="text-sm text-white/60 flex gap-2">
                          <span className="text-red-400 shrink-0">−</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Page 3: Feature Matrix */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Page 3</div>
          <h2 className="text-2xl font-bold text-white mb-2">Feature Matrix</h2>
          <p className="text-white/40 text-sm mb-6">Weight 1–5 based on buyer conversation frequency. Green = Play wins, Red = Play loses, Yellow = partial.</p>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-white/60 font-semibold">Feature</th>
                  <th className="px-3 py-3 text-white/40 font-medium text-center w-12">Wt</th>
                  {COLS.map((col) => (
                    <th
                      key={col}
                      className={`px-3 py-3 text-center font-semibold text-xs ${
                        col === "Play" ? "text-[#FF2D55]" : "text-white/50"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row, i) => {
                  const vals = [row.play, row.youtube, row.vlc, row.mx, row.infuse, row.nplayer, row.plex];
                  const playWins = row.play === "✓";
                  const playLoses = row.play === "✗";
                  return (
                    <tr
                      key={i}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        playWins ? "bg-green-500/5" : playLoses ? "bg-red-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-white/80">{row.feature}</td>
                      <td className="px-3 py-3 text-center text-white/30 text-xs">{row.weight}</td>
                      {vals.map((v, j) => (
                        <td key={j} className="px-3 py-3 text-center">
                          {cell(v)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Score summary */}
          <div className="mt-4 grid grid-cols-7 gap-2">
            {COLS.map((col) => {
              const vals =
                col === "Play"
                  ? FEATURES.map((r) => r.play)
                  : col === "YouTube"
                  ? FEATURES.map((r) => r.youtube)
                  : col === "VLC"
                  ? FEATURES.map((r) => r.vlc)
                  : col === "MX Player"
                  ? FEATURES.map((r) => r.mx)
                  : col === "Infuse"
                  ? FEATURES.map((r) => r.infuse)
                  : col === "nPlayer"
                  ? FEATURES.map((r) => r.nplayer)
                  : FEATURES.map((r) => r.plex);
              const score = vals.filter((v) => v === "✓").length;
              const partial = vals.filter((v) => v === "~").length;
              return (
                <div
                  key={col}
                  className={`rounded-lg p-3 text-center border ${
                    col === "Play"
                      ? "border-[#FF2D55]/40 bg-[#FF2D55]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 ${col === "Play" ? "text-[#FF2D55]" : "text-white/50"}`}>
                    {col}
                  </div>
                  <div className="text-lg font-bold text-white">{score}</div>
                  <div className="text-xs text-white/30">{partial} partial</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Page 4: Positioning Map */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Page 4</div>
          <h2 className="text-2xl font-bold text-white mb-2">Positioning Map</h2>
          <p className="text-white/40 text-sm mb-6">Axes: what buyers actually decide on — Privacy vs UI Quality, and Cost vs Feature Depth.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Map 1: Privacy vs UI */}
            <PositioningMap
              xLabel="UI Quality"
              yLabel="Privacy"
              xAxis={["Cluttered/Dated", "Modern/Premium"]}
              yAxis={["Tracks users", "Zero tracking"]}
              items={[
                { name: "Play", x: 92, y: 92, highlight: true },
                { name: "VLC", x: 15, y: 90 },
                { name: "Infuse", x: 88, y: 88 },
                { name: "YouTube", x: 72, y: 8 },
                { name: "MX Player", x: 40, y: 5 },
                { name: "nPlayer", x: 18, y: 82 },
                { name: "Plex", x: 58, y: 28 },
              ]}
            />

            {/* Map 2: Cost vs Feature Depth */}
            <PositioningMap
              xLabel="Feature Depth"
              yLabel="Accessibility (Free)"
              xAxis={["Basic", "Power-user"]}
              yAxis={["Paid/Complex", "Free/Simple"]}
              items={[
                { name: "Play", x: 68, y: 92, highlight: true },
                { name: "VLC", x: 72, y: 90 },
                { name: "Infuse", x: 90, y: 20 },
                { name: "YouTube", x: 45, y: 85 },
                { name: "MX Player", x: 60, y: 80 },
                { name: "nPlayer", x: 82, y: 40 },
                { name: "Plex", x: 88, y: 35 },
              ]}
            />
          </div>
        </section>

        {/* Page 5: White Space */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Page 5</div>
          <h2 className="text-2xl font-bold text-white mb-6">White Space & Opportunities</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {WHITE_SPACE.map((ws, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-white mb-3">{ws.gap}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{ws.detail}</p>
                <div className="bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-[#FF2D55]">Kano: </span>
                  <span className="text-xs text-white/60">{ws.kano}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Page 6: Action Plan */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Page 6</div>
          <h2 className="text-2xl font-bold text-white mb-6">Action Plan</h2>

          <div className="space-y-4">
            {ACTION_PLAN.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF2D55] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">{item.action}</h3>
                    <p className="text-white/55 text-sm leading-relaxed mb-4">{item.rationale}</p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">
                        Battlecard Trap Question
                      </div>
                      <p className="text-white/70 text-sm italic">"{item.trapQuestion}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section>
          <div className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Sources</div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <ol className="space-y-2">
              {SOURCES.map((src, i) => {
                const [url, label] = src.split(" — ");
                return (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-white/30 w-5 shrink-0">{i + 1}.</span>
                    <span>
                      <a
                        href={url.startsWith("http") ? url : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF2D55] hover:underline"
                      >
                        {url}
                      </a>
                      {label && <span className="text-white/40"> — {label}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-white/30 text-xs">
          <span>Play — Competitive Analysis Report</span>
          <span>{REPORT_DATE} · Confidential</span>
        </div>
      </div>
    </div>
  );
}

function PositioningMap({
  xLabel,
  yLabel,
  xAxis,
  yAxis,
  items,
}: {
  xLabel: string;
  yLabel: string;
  xAxis: [string, string];
  yAxis: [string, string];
  items: { name: string; x: number; y: number; highlight?: boolean }[];
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="text-sm font-semibold text-white/60 mb-4 text-center">
        <span className="text-white/40">{yLabel}</span> vs <span className="text-white/40">{xLabel}</span>
      </div>
      <div className="relative" style={{ paddingBottom: "100%" }}>
        <div className="absolute inset-0">
          {/* Axes */}
          <div className="absolute inset-0 border-l border-b border-white/15" />
          {/* Center lines */}
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div className="w-full border-t border-dashed border-white/10" />
          </div>
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="h-full border-l border-dashed border-white/10" />
          </div>

          {/* Axis labels */}
          <span className="absolute bottom-0 left-0 text-[10px] text-white/25 translate-y-5 -translate-x-1">{xAxis[0]}</span>
          <span className="absolute bottom-0 right-0 text-[10px] text-white/25 translate-y-5">{xAxis[1]}</span>
          <span
            className="absolute left-0 top-0 text-[10px] text-white/25 -translate-x-1"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg) translateX(4px)" }}
          >
            {yAxis[1]}
          </span>
          <span
            className="absolute left-0 bottom-0 text-[10px] text-white/25"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg) translateX(4px) translateY(-4px)" }}
          >
            {yAxis[0]}
          </span>

          {/* Data points */}
          {items.map((item) => (
            <div
              key={item.name}
              className="absolute"
              style={{ left: `${item.x}%`, bottom: `${item.y}%`, transform: "translate(-50%, 50%)" }}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  item.highlight
                    ? "bg-[#FF2D55] border-[#FF2D55]"
                    : "bg-white/30 border-white/50"
                }`}
              />
              <span
                className={`absolute text-[10px] font-semibold whitespace-nowrap ${
                  item.highlight ? "text-[#FF2D55]" : "text-white/60"
                }`}
                style={{ top: "14px", left: "50%", transform: "translateX(-50%)" }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
