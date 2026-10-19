import data from '@/data/evidence.json';
export const evidence=data;
const stop=new Set(['the','and','with','what','this','that','have','from','your','about','for','are','but','how','can','not','was','were','into']);
const tokens=(s:string)=>s.toLowerCase().match(/[a-z]{3,}/g)?.filter(t=>!stop.has(t))??[];
export function retrieve(query:string){const docs=data.map(e=>tokens(e.topicTags.join(' ')+' '+e.title+' '+e.evidence+' '+e.application));const avg=docs.reduce((a,d)=>a+d.length,0)/docs.length;const terms=[...new Set(tokens(query))];return data.map((e,i)=>({ ...e,score:terms.reduce((sum,t)=>{const tf=docs[i].filter(x=>x===t).length;const df=docs.filter(d=>d.includes(t)).length;return sum+Math.log(1+(docs.length-df+.5)/(df+.5))*tf*2.2/(tf+1.2*(.25+.75*docs[i].length/avg))},0)})).filter(e=>e.score>0).sort((a,b)=>b.score-a.score).slice(0,3)}
