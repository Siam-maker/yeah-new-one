"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Minus, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotionPreference } from "@/components/motion/preferences";
import type { KnowledgeLink, KnowledgeNode, NodeKind } from "@/lib/content/connections";

const palette: Record<NodeKind,string> = { Discipline:"#a1c4ba", Article:"#dfaa88", Concept:"#c3d8a3", Experiment:"#c4b7da", Source:"#a7b9c8" };
const neutral = { x:0, y:0, zoom:1 };
const viewControls = [
  { label:"Pan left", icon:ArrowLeft, move:{ x:-38,y:0 } },
  { label:"Pan right", icon:ArrowRight, move:{ x:38,y:0 } },
  { label:"Pan up", icon:ArrowUp, move:{ x:0,y:-38 } },
  { label:"Pan down", icon:ArrowDown, move:{ x:0,y:38 } },
];

function NodeLink({ node }: { node:KnowledgeNode }) {
  if (node.href.startsWith("/")) return <Link href={node.href} className="editorial-link">Open {node.kind.toLowerCase()}</Link>;
  return <a href={node.href} className="editorial-link">Open source <ArrowUpRight size={16} aria-hidden="true" /></a>;
}

export function KnowledgeGraph({ nodes, links, initial }: { nodes:KnowledgeNode[]; links:KnowledgeLink[]; initial:string }) {
  const reduced = useReducedMotionPreference();
  const [selection,setSelection] = useState(initial);
  const [query,setQuery] = useState("");
  const [filter,setFilter] = useState("");
  const [limit,setLimit] = useState(8);
  const [view,setView] = useState(neutral);
  const drag = useRef<{ id:number; clientX:number; clientY:number; x:number; y:number; scale:number } | null>(null);
  const selected = nodes.find(({ id })=>id===selection) ?? nodes[0];
  const matches = nodes.filter((node)=>(!filter || filter===node.kind) && `${node.label} ${node.detail}`.toLowerCase().includes(query.toLowerCase().trim()));
  const neighbors = links.flatMap(({ a,b,reason })=>{
    const id = selected.id===a ? b : selected.id===b ? a : "";
    const node = id && nodes.find((item)=>item.id===id);
    return node && (!filter || node.kind===filter) ? [{ node,reason }] : [];
  });
  const visible = neighbors.slice(0,9).map((item,index,all)=>{
    const angle = index/all.length*Math.PI*2 - Math.PI/2;
    const ring = item.node.kind === "Source" ? 1 : .88;
    return { ...item,x:360+Math.cos(angle)*247*ring,y:215+Math.sin(angle)*148*ring };
  });

  function choose(id:string) {
    setSelection(id);
    setView(neutral);
  }
  function zoom(change:number) {
    setView((prior)=>({...prior,zoom:Math.max(.65,Math.min(2.4,prior.zoom+change))}));
  }

  return <div className="knowledge-console">
    <div className="discovery-filters">
      <label>Search nodes<input className="control-field" type="search" value={query} placeholder="Try subduction or light" onChange={(event)=>{setQuery(event.target.value);setLimit(8);}} /></label>
      <label>Node type<select className="control-field" value={filter} onChange={(event)=>{setFilter(event.target.value);setLimit(8);}}><option value="">All types</option>
        {Object.keys(palette).map((kind)=><option key={kind}>{kind}</option>)}</select></label>
    </div>
    <div className="knowledge-layout">
      <figure className="knowledge-figure">
        <div className="knowledge-toolbar" aria-label="Graph view controls">
          <button className="ghost-button" type="button" aria-label="Zoom in" onClick={()=>zoom(.2)}><Plus size={17}/></button>
          <button className="ghost-button" type="button" aria-label="Zoom out" onClick={()=>zoom(-.2)}><Minus size={17}/></button>
          {viewControls.map(({ label,icon:Icon,move })=><button className="ghost-button" type="button" key={label} aria-label={label} onClick={()=>setView((previous)=>({...previous,x:previous.x+move.x,y:previous.y+move.y}))}><Icon size={17} /></button>)}
          <button className="ghost-button" type="button" aria-label="Reset graph view" onClick={()=>setView(neutral)}><RotateCcw size={17}/></button>
          <output className="mono">{Math.round(view.zoom*100)}%</output>
        </div>
        <svg viewBox="0 0 720 430" aria-hidden="true" className="knowledge-map"
          onPointerDown={(event)=>{
            if (event.button !== 0 || (event.target as Element).closest("[data-node]")) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current={ id:event.pointerId,clientX:event.clientX,clientY:event.clientY,x:view.x,y:view.y,scale:Math.max(1,bounds.width)/720 };
          }}
          onPointerMove={(event)=>{
            const initial = drag.current;
            if(initial?.id!==event.pointerId) return;
            const x = initial.x+(event.clientX-initial.clientX)/initial.scale;
            const y = initial.y+(event.clientY-initial.clientY)/initial.scale;
            setView((previous)=>({...previous,x,y}));
          }}
          onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
          <rect width="720" height="430" fill="transparent" />
          <g transform={`translate(${view.x} ${view.y}) translate(360 215) scale(${view.zoom}) translate(-360 -215)`}>
            <path d="M92 215h536M360 37v356" className="graph-axis"/>
            <ellipse cx="360" cy="215" rx="167" ry="100" className="graph-gridline"/>
            <ellipse cx="360" cy="215" rx="84" ry="51" className="graph-axis"/>
            <ellipse cx="360" cy="215" rx="247" ry="148" className="graph-gridline"/>
            {visible.map(({ node,x,y })=><motion.path key={selected.id+node.id} d={`M360 215 Q${(x+360)/2+(y-215)*.12} ${(y+215)/2-(x-360)*.11} ${x} ${y}`}
              fill="none" stroke={palette[node.kind]} strokeOpacity=".59" initial={reduced ? false : { pathLength:0 }} animate={{ pathLength:1 }}
              transition={{duration:.38,ease:"easeOut"}} />)}
            {visible.map(({ node,x,y })=><g key={node.id} data-node="" onClick={()=>choose(node.id)}>
              <circle cx={x} cy={y} r="20" fill="transparent" />
              <circle cx={x} cy={y} r="7" fill={palette[node.kind]} stroke="#192520" strokeWidth="1.6" />
              <title>{node.label}</title>
              <text x={x} y={y+24} textAnchor="middle">{node.label.length>22 ? node.label.slice(0,20)+"…" : node.label}</text>
            </g>)}
            <circle cx="360" cy="215" r="23" fill="#17231e" stroke={palette[selected.kind]} strokeWidth="2" />
            <circle cx="360" cy="215" r="8" fill={palette[selected.kind]} />
            <text x="360" y="254" textAnchor="middle">{selected.label.length>32 ? selected.label.slice(0,30)+"…" : selected.label}</text>
          </g>
        </svg>
        <figcaption className="knowledge-legend">{Object.entries(palette).map(([label,color])=><span key={label}><i style={{ backgroundColor:color }} />{label}</span>)}</figcaption>
      </figure>
      <section aria-live="polite" className="knowledge-reading">
        <p className="mono">{selected.kind}</p><h2 className="subhead">{selected.label}</h2><p>{selected.detail}</p><NodeLink node={selected} />
        <details open className="reference-fold"><summary>Direct connections ({neighbors.length})</summary>
          {neighbors.length ? <ul>{neighbors.map(({ node,reason })=><li key={node.id}><button type="button" onClick={()=>choose(node.id)}>{node.label}<span>{reason}</span></button></li>)}</ul> : <p>Choose another node or change the type filter.</p>}
        </details>
      </section>
    </div>
    <section className="node-index">
      <h2 className="subhead">Node index</h2><p className="mono section-label" role="status">{matches.length} matching nodes</p>
      <ul>{matches.slice(0,limit).map((node)=><li key={node.id}><button className="ghost-button" type="button" aria-pressed={node.id===selected.id} onClick={()=>choose(node.id)}>
        <span className="mono">{node.kind}</span>{node.label}</button></li>)}</ul>
      {matches.length > limit && <button className="ghost-button mt-4" type="button" onClick={()=>setLimit(limit+12)}>Show more nodes</button>}
    </section>
  </div>;
}
