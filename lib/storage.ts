import {z} from 'zod';
const RecordSchema=z.object({id:z.string(),date:z.string(),task:z.string(),type:z.enum(['experiment','reflection']),summary:z.string()});
export type SavedRecord=z.infer<typeof RecordSchema>;
export function readHistory():SavedRecord[]{try{return z.array(RecordSchema).parse(JSON.parse(localStorage.getItem('focuslab-history')||'[]'))}catch{return[]}}
export function writeHistory(records:SavedRecord[]){try{localStorage.setItem('focuslab-history',JSON.stringify(records.slice(-50)));return true}catch{return false}}
export function download(name:string,data:string,type='application/json'){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
