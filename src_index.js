const SOURCE='https://www.casino.org/casinoscores/pt-br/bac-bo/';
const ALLOW_ORIGIN='*';
function normalize(v){
  const s=String(v||'').toUpperCase();
  if(/AZUL|BLUE|PLAYER|JOGADOR/.test(s)) return 'A';
  if(/VERMELHO|RED|BANKER|BANQUEIRO/.test(s)) return 'R';
  if(/EMPATE|TIE/.test(s)) return 'E';
  return null;
}
function parseResults(text){
  const t=String(text||'').replace(/<script[\\s\\S]*?<\\/script>/gi,' ').replace(/<style[\\s\\S]*?<\\/style>/gi,' ').replace(/<[^>]+>/g,' ');
  const clean=t.replace(/\\s+/g,' ');
  const re=/(AZUL|BLUE|PLAYER|JOGADOR|VERMELHO|RED|BANKER|BANQUEIRO|EMPATE|TIE)/gi;
  const out=[]; let m;
  while((m=re.exec(clean))){
    const x=normalize(m[1]);
    if(x) out.push(x);
  }
  // Mantém no máximo os 100 eventos mais recentes encontrados no conteúdo renderizado.
  return out.slice(-100);
}
async function capture(env){
  const r=await env.BROWSER.quickAction('content',{url:SOURCE});
  const html=await r.text();
  return parseResults(html);
}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':ALLOW_ORIGIN}})}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/api'){
      try{
        const results=await capture(env);
        return json({ok:true,source:SOURCE,results,capturedAt:new Date().toISOString()});
      }catch(e){return json({ok:false,error:String(e),source:SOURCE},500)}
    }
    return env.ASSETS.fetch(request);
  }
};
