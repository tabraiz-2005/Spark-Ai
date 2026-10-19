import {describe,it,expect} from 'vitest';
import {generateTrials,acceptResponse,score,median,insight,basicPlan,validatePlan,remainingMs,IntakeSchema} from '../lib/core';
import {retrieve} from '../lib/retrieval';
const intake={task:'Study joins',availableMinutes:30,reportedDistractions:['messages'],constraints:[],preferredLanguage:'English' as const,missingInformation:[],searchTerms:'phone messages breaks'};
describe('experiment data and scoring',()=>{
 it('balances both scored rounds',()=>{for(const c of ['quiet','distraction'] as const){const ts=generateTrials(c);expect(ts).toHaveLength(24);expect(ts.filter(t=>t.shape==='blue-circle')).toHaveLength(12);for(const s of ['blue-square','purple-square','purple-circle'])expect(ts.filter(t=>t.shape===s)).toHaveLength(4)}});
 it('keeps practice to six trials',()=>expect(generateTrials('quiet',true)).toHaveLength(6));
 it('calculates odd, even, and missing medians',()=>{expect(median([500,100,300])).toBe(300);expect(median([300,400])).toBe(350);expect(median([])).toBeNull()});
 it('scores no responses without zero reaction time',()=>{const s=score(generateTrials('quiet'));expect(s.medianMs).toBeNull();expect(s.missed).toBe(12);expect(s.accuracy).toBe(50)});
 it('scores perfect detection',()=>{const s=score(generateTrials('quiet').map(t=>({...t,rt:t.shape==='blue-circle'?300:null})));expect(s.accuracy).toBe(100);expect(s.medianMs).toBe(300);expect(s.falseAlarms).toBe(0)});
 it('counts false alarms independently',()=>{const s=score(generateTrials('quiet').map(t=>({...t,rt:300})));expect(s.falseAlarms).toBe(12);expect(s.hits).toBe(12);expect(s.correctRejections).toBe(0)});
 it('rejects held-key, late, blank and duplicate responses',()=>{const t=generateTrials('quiet')[0];expect(acceptResponse(t,400,false)).toBe(t);expect(acceptResponse(t,400,true,true)).toBe(t);expect(acceptResponse(t,901,true)).toBe(t);const n=acceptResponse(t,400,true);expect(n.rt).toBe(400);expect(acceptResponse(n,450,true)).toBe(n)});
 it('reports mixed outcomes honestly',()=>{const q={medianMs:300,hits:10,missed:2,falseAlarms:2,correctRejections:10,accuracy:83};expect(insight(q,{...q,medianMs:200,accuracy:70})).toContain('mixed');expect(insight(q,q)).toContain('unchanged');expect(insight(q,{...q,medianMs:null})).toContain('not enough')});
 it('describes better and worse without diagnosing',()=>{const q=score(generateTrials('quiet').map(t=>({...t,rt:t.shape==='blue-circle'?300:null})));expect(insight(q,{...q,medianMs:400,accuracy:80})).toContain('slower');expect(insight({...q,accuracy:80},{...q,medianMs:200})).toContain('higher')});
});
describe('retrieval and plans',()=>{
 it('retrieves relevant phone evidence',()=>expect(retrieve('phone whatsapp messages breaks').map(e=>e.id)).toContain('phonebreak'));
 it('returns no fabricated match',()=>expect(retrieve('volcanic basalt geology')).toEqual([]));
 it('bounds context',()=>expect(retrieve('task switching phone breaks attention')).toHaveLength(3));
 it('builds a feasible offline schedule',()=>{const p=basicPlan(intake);expect(validatePlan(p,30,[]).valid).toBe(true)});
 it('rejects wrong totals and unknown sources',()=>{const p=basicPlan(intake);expect(validatePlan(p,15,[]).valid).toBe(false);expect(validatePlan({...p,evidence:[{id:'fake',explanation:'claim'}]},30,[]).valid).toBe(false)});
 it('rejects clinical claims and invalid structure',()=>{expect(validatePlan({...basicPlan(intake),rationale:'You have ADHD'},30,[]).valid).toBe(false);expect(validatePlan({},30,[]).valid).toBe(false)});
 it('preserves missing intake values and target languages',()=>{for(const preferredLanguage of ['English','Urdu','Roman Urdu'])expect(IntakeSchema.parse({...intake,task:'',availableMinutes:null,preferredLanguage}).availableMinutes).toBeNull();expect(IntakeSchema.safeParse({...intake,availableMinutes:-1}).success).toBe(false)});
 it('uses timestamps rather than tick counts',()=>{expect(remainingMs(10000,3000)).toBe(7000);expect(remainingMs(10000,13000)).toBe(0)});
});
