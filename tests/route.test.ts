import {afterEach,it,expect,vi} from 'vitest';
import {POST} from '../app/api/coach/route';
afterEach(()=>vi.unstubAllEnvs());
const req=(body:unknown,headers:Record<string,string>={})=>new Request('http://localhost/api/coach',{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});
it('handles missing API key explicitly',async()=>{vi.stubEnv('GEMINI_API_KEY','');vi.stubEnv('VERCEL','');vi.stubEnv('FOCUSLAB_DEMO_CODE','');expect((await POST(req({}))).status).toBe(503)});
it('fails closed for unprotected Vercel AI',async()=>{vi.stubEnv('VERCEL','1');vi.stubEnv('FOCUSLAB_DEMO_CODE','');expect((await POST(req({}))).status).toBe(503)});
it('rejects incorrect demo code',async()=>{vi.stubEnv('FOCUSLAB_DEMO_CODE','private-test-code');expect((await POST(req({}, {'x-demo-code':'wrong'}))).status).toBe(401)});
it('requires explicit consent and bounded input',async()=>{vi.stubEnv('GEMINI_API_KEY','test-not-a-real-key');vi.stubEnv('VERCEL','');vi.stubEnv('FOCUSLAB_DEMO_CODE','');expect((await POST(req({action:'intake',text:'hello',language:'English',consent:false}))).status).toBe(400);expect((await POST(req({action:'intake',text:'x'.repeat(17000),language:'English',consent:true}))).status).toBe(413)});
it('rejects foreign browser origins',async()=>expect((await POST(req({}, {origin:'https://other.example'}))).status).toBe(403));
