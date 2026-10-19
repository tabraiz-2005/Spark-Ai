'use client';
import {useEffect,useRef,useState} from 'react';
import {acceptResponse,generateTrials,outcome,WINDOW_MS,type Condition,type Trial} from '@/lib/core';
import {Bell,ArrowRight,RotateCcw} from 'lucide-react';
type Phase='ready'|'countdown'|'running'|'interrupted'|'done';
export default function Experiment({onComplete}:{onComplete:(trials:Trial[])=>void}){
 const [round,setRound]=useState(-1),[order]=useState<Condition[]>(()=>Math.random()<.5?['quiet','distraction']:['distraction','quiet']);
 const [phase,setPhase]=useState<Phase>('ready'),[count,setCount]=useState(3),[index,setIndex]=useState(0),[shape,setShape]=useState<string|null>(null),[feedback,setFeedback]=useState(''),[notice,setNotice]=useState('');
 const trials=useRef<Trial[]>([]),all=useRef<Trial[]>([]),active=useRef(false),started=useRef(0),current=useRef(0),timers=useRef<ReturnType<typeof setTimeout>[]>([]),raf=useRef(0),phaseRef=useRef<Phase>('ready');
 const practice=round===-1,condition=practice?'quiet':order[round];
 function clear(){timers.current.forEach(clearTimeout);timers.current=[];cancelAnimationFrame(raf.current);active.current=false}
 function change(p:Phase){phaseRef.current=p;setPhase(p)}
 function later(fn:()=>void,ms:number){timers.current.push(setTimeout(fn,ms))}
 function respond(repeat=false){const t=trials.current[current.current];if(!t)return;const n=acceptResponse(t,performance.now()-started.current,active.current,repeat);trials.current[current.current]=n;if(n!==t&&practice)setFeedback(outcome(n)==='Hit'?'Correct response':'That was a non-target')}
 function runTrial(i:number){if(i>=trials.current.length){setShape(null);setNotice('');change('done');return}current.current=i;setIndex(i);setFeedback('');setShape(trials.current[i].shape);
  if(condition==='distraction'&&[3,7,11,15,19,23].includes(i)){setNotice(['Group chat · 3 new messages','Reminder · Something to review','Update · A new post is available'][Math.floor(i/4)%3]);later(()=>setNotice(''),1000)}
  // A second frame avoids starting the clock before the React update reaches a paint.
  raf.current=requestAnimationFrame(()=>{raf.current=requestAnimationFrame(()=>{started.current=performance.now();active.current=true;later(()=>{active.current=false;setShape(null);if(practice)setFeedback(outcome(trials.current[i]));later(()=>runTrial(i+1),practice?1000:300+Math.random()*200)},WINDOW_MS)})});
 }
 function start(){clear();trials.current=generateTrials(condition,practice);setIndex(0);setShape(null);setNotice('');setFeedback('');change('countdown');setCount(3);later(()=>setCount(2),1000);later(()=>setCount(1),2000);later(()=>{change('running');runTrial(0)},3000)}
 function interrupt(){if(phaseRef.current==='running'||phaseRef.current==='countdown'){clear();trials.current=[];setShape(null);setNotice('');change('interrupted')}}
 const responseRef=useRef(respond);responseRef.current=respond;
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.code==='Space'&&(phaseRef.current==='running'||phaseRef.current==='countdown')){e.preventDefault();responseRef.current(e.repeat)}};const visibility=()=>{if(document.hidden)interrupt()};window.addEventListener('keydown',key);window.addEventListener('blur',interrupt);document.addEventListener('visibilitychange',visibility);return()=>{clear();window.removeEventListener('keydown',key);window.removeEventListener('blur',interrupt);document.removeEventListener('visibilitychange',visibility)}},[]);
 function next(){if(practice){setRound(0);change('ready')}else{all.current.push(...trials.current);if(round===0){setRound(1);change('ready')}else onComplete(all.current)}}
 return <section className="experiment wrap narrow"><div className="eyebrow">{practice?'GET COMFORTABLE':`ROUND ${round+1} OF 2`} <span>•</span> {condition==='quiet'?'QUIET CONDITION':'SIMULATED NOTIFICATIONS'}</div><h1>{practice?'A little practice.':condition==='quiet'?'Just you and the task.':'Stay with the target.'}</h1><p>Respond only to the <strong>blue circle</strong>. Let every other shape pass.</p><div className="legend"><span className="mini blue-circle"/> Target <kbd>SPACE</kbd> or tap Respond</div>
 <div className="round-progress"><span style={{width:`${phase==='done'?100:phase==='running'?index/(practice?6:24)*100:0}%`}}/></div><div className="arena"><div className="arena-top"><span>{practice?'Practice · not scored':`${condition==='quiet'?'Quiet':'Distraction'} round`}</span><span>{phase==='running'?`${index+1} / ${trials.current.length}`:'Ready when you are'}</span></div><div className="notification-slot">{notice&&<div className="notification"><Bell size={16}/><div><small>SIMULATED</small>{notice}</div></div>}</div><div className="stimulus-area">
 {phase==='ready'&&<div className="center-message"><div className="shape blue-circle"/><h3>{practice?'Learn the rhythm':'Keep this tab in focus'}</h3><p>{practice?'Six practice shapes. You’ll get feedback.':'24 shapes. No feedback until the round ends.'}</p><button className="primary" onClick={start}>{practice?'Start practice':'Start round'} <ArrowRight size={17}/></button></div>}
 {phase==='countdown'&&<div className="countdown" aria-live="polite">{count}</div>}
 {phase==='running'&&shape&&<div className={'shape '+shape} role="img" aria-label={shape.replace('-',' ')}/>}
 {phase==='interrupted'&&<div className="center-message"><h3>Let’s restart this round.</h3><p>The window lost focus. Incomplete results were discarded.</p><button className="primary" onClick={start}><RotateCcw size={16}/> Restart round</button></div>}
 {phase==='done'&&<div className="center-message"><h3>{practice?'You’re ready.':'Round complete.'}</h3><p>{practice?'Now try both scored conditions.':round===0?'Take a moment before the next condition.':'Your comparison is ready.'}</p><button className="primary" onClick={next}>{practice?'Begin experiment':round===0?'Next condition':'See my results'} <ArrowRight size={17}/></button>{practice&&<button className="text-button" onClick={start}>Repeat practice</button>}</div>}
 </div><div className="feedback" aria-live="polite">{practice?feedback:''}</div></div>
 <button className="respond" disabled={phase!=='running'} onPointerDown={e=>{e.preventDefault();respond()}} onClick={e=>{if(e.detail===0)respond()}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();respond(e.repeat)}}}>Respond <kbd>SPACE</kbd></button><p className="fine">One response per shape. Switching tabs interrupts the round. Browser timing is approximate.</p></section>
}
