import {NextResponse} from 'next/server';
import {timingSafeEqual} from 'node:crypto';
import {z} from 'zod';
import {IntakeSchema} from '@/lib/core';
import {coach,extract,generator} from '@/lib/agent';
export const runtime='nodejs';
export const maxDuration=60;
const metric=z.object({medianMs:z.number().min(0).max(900).nullable(),hits:z.number().int().min(0).max(12),missed:z.number().int().min(0).max(12),falseAlarms:z.number().int().min(0).max(12),correctRejections:z.number().int().min(0).max(12),accuracy:z.number().int().min(0).max(100)}).refine(m=>m.hits+m.missed===12&&m.falseAlarms+m.correctRejections===12&&m.accuracy===Math.round(100*(m.hits+m.correctRejections)/24)&&((m.hits===0)===(m.medianMs===null)));
const schema=z.discriminatedUnion('action',[
 z.object({action:z.literal('intake'),consent:z.literal(true),text:z.string().min(1).max(2000),language:z.enum(['English','Urdu','Roman Urdu'])}),
 z.object({action:z.literal('plan'),consent:z.literal(true),intake:IntakeSchema,metrics:z.object({quiet:metric,distraction:metric})})
]);
export async function GET(){return NextResponse.json({configured:!!process.env.GEMINI_API_KEY,requiresCode:!!process.env.FOCUSLAB_DEMO_CODE||!!process.env.VERCEL})}
export async function POST(req:Request){
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:'Origin not permitted'},{status:403});
 const code=process.env.FOCUSLAB_DEMO_CODE;
 if(process.env.VERCEL&&!code)return NextResponse.json({error:'AI is disabled until the owner configures a private demo code.'},{status:503});
 if(code){const supplied=Buffer.from(req.headers.get('x-demo-code')||''),expected=Buffer.from(code);if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return NextResponse.json({error:'Enter the private demo access code.'},{status:401})}
 if(!process.env.GEMINI_API_KEY)return NextResponse.json({error:'AI coach unavailable: no API key configured. Use basic guidance.'},{status:503});
 if(Number(req.headers.get('content-length')||0)>16000)return NextResponse.json({error:'Request too large'},{status:413});
 let raw='';const reader=req.body?.getReader();if(!reader)return NextResponse.json({error:'Empty request'},{status:400});let bytes=0;const decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>16000){await reader.cancel();return NextResponse.json({error:'Request too large'},{status:413})}raw+=decoder.decode(value,{stream:true})}raw+=decoder.decode();
 let data;try{data=schema.parse(JSON.parse(raw))}catch{return NextResponse.json({error:'Please check your input.'},{status:400})}
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);
 try{const generate=generator(controller.signal);return NextResponse.json(data.action==='intake'?{intake:await extract(data.text,data.language,generate),mode:'ai'}:await coach(data.intake,data.metrics,generate))}
 catch(e){const status=typeof e==='object'&&e&&'status'in e?Number(e.status):0;return NextResponse.json({error:status===429?'AI quota reached. Basic guidance is still available.':controller.signal.aborted?'AI request timed out. Try basic guidance.':'AI could not return a verified response. Use basic guidance or retry.'},{status:status===429?429:503})}
 finally{clearTimeout(timeout)}
}
