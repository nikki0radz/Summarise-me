import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{lengthBudget,wordCount} from '../worker.mjs';
test('short sits between tiny and the previous short, now medium',()=>{
 const transcript=Array(400).fill('word').join(' ');
 const tiny=lengthBudget(transcript,'tiny'),short=lengthBudget(transcript,'short'),medium=lengthBudget(transcript,'medium');
 assert.equal(short.target,60);assert.equal(short.max,72);
 assert.equal(medium.target,92);assert.equal(medium.max,112);
 assert.ok(tiny.target<short.target&&short.target<medium.target);
});
test('revised short budget applies to summary, transcript and bullets',async()=>{
 const original=globalThis.fetch;
 try{for(const mode of ['summary','tidy','bullets']){
  const calls=[];globalThis.fetch=async(url,init)=>{calls.push(JSON.parse(init.body));return Response.json({output:[{content:[{type:'output_text',text:JSON.stringify({text:Array(100).fill('word').join(' ')+'.',title:'A quick update'})}]}]})};
  const response=await worker.fetch(new Request('https://test/summarise',{method:'POST',headers:{'X-App-Token':'test','Content-Type':'application/json'},body:JSON.stringify({transcript:Array(400).fill('word').join(' '),settings:{mode,length:'short',emoji:false}})}),{OPENAI_API_KEY:'test',APP_TOKEN:'test'});
  const result=await response.json();assert.equal(response.status,200);assert.ok(wordCount(result.text)<=72);assert.equal(result.lengthBudget.target,60);assert.equal(calls.length,2);assert.ok(calls[1].instructions.includes('Correct the LENGTH'));
 }}finally{globalThis.fetch=original}
});
