"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Compass, MapPin, Pencil } from "lucide-react";
import type { Activity } from "@/lib/trips";

// Illustration coordinates, not geographic coordinates or walking directions.
const neighborhoods = [
  { match: /santa luzia/i, x: 795, y: 330 },
  { match: /alfama/i, x: 845, y: 240 },
  { match: /comércio|comercio/i, x: 670, y: 450 },
  { match: /baixa/i, x: 640, y: 305 },
  { match: /chiado/i, x: 490, y: 340 },
  { match: /rossio/i, x: 595, y: 170 },
  { match: /belém|belem/i, x: 135, y: 410 },
  { match: /alcântara|alcantara/i, x: 300, y: 335 },
  { match: /sintra/i, x: 155, y: 120 },
  { match: /estrela/i, x: 345, y: 195 },
  { match: /sodré|sodre/i, x: 480, y: 455 },
];

function Townhouse({ x, y, color = "#eed3ab" }: { x: number; y: number; color?: string }) {
  return <g transform={`translate(${x} ${y})`} stroke="#806f59" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M0 0 22 -11 43 0 22 12Z" fill="#bf7050" />
    <path d="M0 0v30l22 12V12Z" fill={color} />
    <path d="M22 12v30l21-12V0Z" fill="#d9b990" />
    <path d="M6 10v7m8-3v7m15-3v7m7-11v7M7 26v7m8-3v7m14-3v-7" stroke="#688784" strokeWidth="4" />
  </g>;
}

export function IllustratedMap({ activities, destination, day, onEdit, onToggle }: {
  activities: Activity[];
  destination: string;
  day: number;
  onEdit: (activity: Activity) => void;
  onToggle: (activity: Activity) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const current = activities.find(a => a.id === selected) ?? activities.find(a => !a.done) ?? activities[0];
  const lisbon = /lisbon|lisboa/i.test(destination);
  const points = activities.map((activity, index) => {
    const place = lisbon ? neighborhoods.find(n => n.match.test(activity.location)) : undefined;
    const duplicates = place ? activities.slice(0, index).filter(a => neighborhoods.find(n => n.match.test(a.location)) === place).length : 0;
    return { activity, x: place ? place.x + (duplicates % 3) * 24 : 110 + (index % 9) * 95,
      y: place ? place.y + Math.floor(duplicates / 3) * 46 : 565 + Math.floor(index / 9) * 65, placed: !!place };
  });
  const height = Math.max(650, ...points.map(p => p.y + 65));
  return <section className="illustrated-journey" aria-label={`Day ${day + 1} illustrated route`}>
    <div className="map-intro"><span className="map-kicker">A little less planning. A little more wandering.</span>
      <h2>{lisbon ? "Lose yourself in Lisbon." : `Explore ${destination.split(",")[0]}.`}</h2>
      <p>Day {day + 1} <span>／</span> {activities.length} stops <span>／</span> Your own way through the city</p>
    </div>
    <div className="map-scroll">
      <div className="map-canvas" style={{ aspectRatio: `1000 / ${height}` }}>
        <svg className="city-illustration" viewBox={`0 0 1000 ${height}`} aria-hidden="true">
          <defs>
            <pattern id="map-paper" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#9d8863" opacity=".12" /></pattern>
            <pattern id="map-waves" width="42" height="26" patternUnits="userSpaceOnUse"><path d="M2 13q8-5 16 0t16 0" fill="none" stroke="#81b4b4" strokeWidth="1" opacity=".55" /></pattern>
          </defs>
          <rect width="1000" height={height} fill="#f2edda" />
          {lisbon && <>
            <path d="M0 433Q200 500 420 468T730 497Q875 462 1000 365V650H0Z" fill="#bdd9d5" />
            <path d="M0 448Q200 515 420 483T730 512Q875 477 1000 380V650H0Z" fill="url(#map-waves)" />
            <path d="M0 427Q200 494 420 462T730 491Q875 456 1000 359" fill="none" stroke="#fffaf0" strokeWidth="15" />
            <g fill="#d7dfb7" stroke="#bac99e" strokeWidth="2">
              <path d="m250 150 95-57 65 67-49 89-92-25Z" />
              <path d="m695 91 103 16 25 69-65 35-73-38Z" />
              <path d="m48 289 70-31 48 46-51 41Z" />
            </g>
            <g fill="none" stroke="#fffaf0" strokeWidth="14" strokeLinecap="round">
              <path d="M170 80Q310 210 420 267T750 360L950 220M100 370Q335 268 585 319T870 402M455 100 490 340 445 465M595 110 640 305 665 461M800 110 735 230 800 360M255 225 300 335 280 453" />
              <path d="m520 170 183 12m-181 45 177 5m-165 47 182 0M335 300l42 132M870 158l60 166" strokeWidth="8" />
            </g>
            <g opacity=".92">
              {[[205,270],[244,292],[328,290],[365,335],[400,378],[450,260],[500,295],[545,305],[570,358],[600,405],[655,230],[705,302],[751,370],[811,385],[863,308],[892,270],[525,125],[643,130],[678,165],[390,180],[190,384]].map(([x,y], i) => <Townhouse key={i} x={x} y={y} color={i % 3 === 0 ? "#e4bdac" : i % 3 === 1 ? "#e8dcae" : "#bfcfca"} />)}
            </g>
            <g fill="#829b72" stroke="#617d5e" strokeWidth="1.5">
              {[[280,170],[310,145],[355,173],[325,205],[715,133],[750,142],[780,155],[78,305],[111,290],[905,360]].map(([x,y],i) => <g key={i}><path d={`M${x} ${y}v24`} /><ellipse cx={x} cy={y} rx="10" ry="15" /></g>)}
            </g>
            <g transform="translate(720 207)" stroke="#867757" strokeWidth="2" fill="#e4cf9a">
              <path d="M0 15v-30h12v8h12v-8h12v30l-18 11ZM38 15v-40h12v8h12v-8h12v40L56 26Z" />
              <path d="M10 15h54v34H10Z" /><path d="M30 49V30q10-14 20 0v19" fill="#8d8e73" />
            </g>
            <g transform="translate(692 414)" stroke="#987f56" strokeWidth="2" fill="#eddbac"><path d="M0 33V0h12v-12h25V0h12v33H34V16Q24 2 14 16v17Z" /><path d="M-24 33V10H0m49 0h24v23" fill="none" strokeWidth="9" /></g>
            <g transform="translate(405 229) rotate(-12)" stroke="#88704c" strokeWidth="2"><rect width="64" height="32" rx="5" fill="#e4b653" /><path d="M7 6h50v13H7Z" fill="#e9efe2" /><path d="M22 6v13m18-13v13" /><circle cx="13" cy="34" r="4" fill="#615f50" /><circle cx="50" cy="34" r="4" fill="#615f50" /></g>
            <g className="neighborhood-label" textAnchor="middle">
              <text x="340" y="100">ESTRELA</text><text x="471" y="205">BAIRRO ALTO</text>
              <text x="572" y="258">BAIXA</text><text x="870" y="198">ALFAMA</text>
              <text x="483" y="407">CHIADO</text><text x="210" y="350">ALCÂNTARA</text>
              <text x="110" y="385">BELÉM</text><text x="146" y="79">↖ SINTRA · DAY TRIP</text>
            </g>
            <g className="landmark-label"><text x="710" y="283">Castelo de São Jorge</text><text x="688" y="478">Praça do Comércio</text></g>
            <text className="river-label" x="795" y="545" transform="rotate(-9 795 545)">Rio Tejo</text>
            <g transform="translate(906 475)" fill="#fff9e9" stroke="#6f9696" strokeWidth="1.5"><path d="m-18 0 22-43V0ZM9-31 25 0H9ZM-25 5h55l-10 12H-13Z" /></g>
          </>}
          <rect width="1000" height={height} fill="url(#map-paper)" />
          {points.some(p => !p.placed) && <text x="50" y="525" className="landmark-label">{lisbon ? "Unplaced stops · itinerary order" : "Your stops · schematic itinerary"}</text>}
          <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#fff9ee" strokeWidth="9" strokeLinejoin="round" />
          <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#b66445" strokeWidth="3" strokeDasharray="7 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {points.map(({ activity, x, y }, index) => <button key={activity.id}
          className={`map-pin ${current?.id === activity.id ? "is-current" : ""} ${activity.done ? "is-visited" : ""}`}
          style={{ left: `${x / 10}%`, top: `${y / height * 100}%` }}
          aria-label={`Stop ${index + 1}: ${activity.title}, ${activity.time}${activity.done ? ", visited" : ""}`}
          aria-pressed={current?.id === activity.id} onClick={() => setSelected(activity.id)}>
          <span className="pin-number">{activity.done ? <Check size={17} /> : index + 1}</span>
          <span className="pin-caption">{activity.title}</span>
        </button>)}
        <div className="map-compass" aria-hidden="true">N<Compass size={32} strokeWidth={1} /></div>
      </div>
    </div>
    <div className="map-bottom">
      {current ? <article className="current-stop" aria-live="polite">
        <div className="current-stop-heading"><span className="map-kicker">Current stop</span><span>{String(activities.indexOf(current) + 1).padStart(2, "0")} / {String(activities.length).padStart(2, "0")}</span></div>
        <p className="stop-time">{current.time} <span>· {current.category}</span></p>
        <h3>{current.title}</h3>
        <a className="place-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((current.location || current.title) + ", " + destination)}`} target="_blank" rel="noreferrer"><MapPin size={14} />{current.location || destination}<ArrowUpRight size={14} /></a>
        {current.notes && <p className="stop-notes">{current.notes}</p>}
        <div className="stop-actions"><button className="primary" aria-pressed={current.done} onClick={() => { onToggle(current); setSelected(null); }}><Check size={16} />{current.done ? "Visited · undo" : "Mark as visited"}</button><button className="button" onClick={() => onEdit(current)}><Pencil size={14} />Edit stop</button></div>
      </article> : <div className="map-empty"><Compass size={28} /><h3>A day of possibilities.</h3><p>Add an activity below to start your route.</p></div>}
      <p className="map-legend"><span /> Your daily route<br /><small>Illustrated locations are approximate.<br />Route lines show stop order, not directions.</small></p>
    </div>
  </section>;
}
