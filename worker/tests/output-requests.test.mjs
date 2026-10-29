import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{instructions} from '../worker.mjs';
const env={OPENAI_API_KEY:'test-key',APP_TOKEN:'test-token'};
const originalFetch=globalThis.fetch;
const transcript='So Helena sent me another message today and honestly I am confused because we used to have lunch and gossip together but now she barely replies and I just do not know what changed.';
async function summarise(responses,extraInstructions='Leave out names'){
 const calls=[];
 globalThis.fetch=async(url,init)=>{calls.push(JSON.parse(init.body));assert.ok(responses.length,'Unexpected AI call');const value=responses.shift();return Response.json({output:[{content:[{type:'output_text',text:typeof value==='string'?value:JSON.stringify(value)}]}]})};
 try{const response=await worker.fetch(new Request('https://test/summarise',{method:'POST',headers:{'X-App-Token':'test-token','Content-Type':'application/json'},body:JSON.stringify({transcript,settings:{extraInstructions,length:'long',tone:['natural','friendly'],emoji:false}})}),env);return{response,body:await response.json(),calls}}finally{globalThis.fetch=originalFetch}
}
const bad={text:'Helena messaged again and I honestly do not know what changed.',title:'Helena messaged again'};
const good={text:'She messaged again and honestly I am confused. We used to chat, now she barely replies.',title:'Another confusing message'};
const pass={compliant:true,issues:[]},fail={compliant:false,issues:['Remove identifying personal names from both outputs.']};
test('name leak is repaired and checked before returning',async()=>{const r=await summarise([bad,fail,good,pass]);assert.equal(r.response.status,200);assert.equal(r.body.text,good.text);assert.equal(r.calls.length,4);assert.ok(r.calls[2].instructions.includes('MANDATORY OUTPUT REQUEST CORRECTION'));for(const c of r.calls)assert.equal(c.store,false)});
test('repeated failure returns an error instead of leaking the candidate',async()=>{const r=await summarise([bad,fail,bad,fail]);assert.equal(r.response.status,422);assert.equal(r.body.text,undefined);assert.ok(!JSON.stringify(r.body).includes('Helena'))});
test('compliant first result needs no repair',async()=>{const r=await summarise([good,pass]);assert.equal(r.response.status,200);assert.equal(r.calls.length,2)});
test('invalid verification fails closed',async()=>{const r=await summarise([bad,'not JSON']);assert.equal(r.response.status,502);assert.equal(r.body.text,undefined)});
test('without extra instructions no additional verification call',async()=>{const r=await summarise([good],'');assert.equal(r.response.status,200);assert.equal(r.calls.length,1)});
test('different wordings are passed intact to generation and checking',async()=>{for(const request of ["Don't name anyone",'Anonymise it please','No names please','Make this chatty and leave out work']){const r=await summarise([good,pass],request);assert.ok(r.calls[0].instructions.includes(request));assert.equal(JSON.parse(r.calls[1].input).outputRequest,request)}});
test('prompt prioritises exclusions and ongoing conversational voice',()=>{const prompt=instructions({extraInstructions:'No names',tone:['friendly']});assert.ok(prompt.includes('name-removal and other exclusions override detail preservation'));assert.ok(prompt.includes('continuing a chat with a friend'));assert.ok(prompt.includes('Remove repetition and false starts, not personality'));assert.ok(prompt.includes('Extra instructions override tone'))});


test('request receipt identifies the exact checked instruction',async()=>{const r=await summarise([good,pass],'No names please');assert.equal(r.body.appliedRequest,'No names please')});
test('explicit paragraph request is not changed back to selected bullets',async()=>{
 globalThis.fetch=async()=>Response.json({output:[{content:[{type:'output_text',text:JSON.stringify({text:'We had a chat. It was nice.',title:'A conversation'})}]}]});
 let calls=0;globalThis.fetch=async()=>{calls++;return Response.json({output:[{content:[{type:'output_text',text:JSON.stringify(calls===1?{text:'We had a chat. It was nice.',title:'A conversation'}:pass)}]}]})};
 try{const response=await worker.fetch(new Request('https://test/summarise',{method:'POST',headers:{'X-App-Token':'test-token','Content-Type':'application/json'},body:JSON.stringify({transcript,settings:{mode:'bullets',emoji:true,length:'tiny',extraInstructions:'Use a plain paragraph, no emojis, and keep these two sentences.'}})}),env);const result=await response.json();assert.equal(response.status,200);assert.equal(result.text,'We had a chat. It was nice.');assert.equal(calls,2)}finally{globalThis.fetch=originalFetch}
});
