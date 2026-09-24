const emoji={A:'🔵',R:'🔴',E:'⚪'};
let patterns=[], history=[], active=null, green=0, red=0, lastRemote=[];
const $=id=>document.getElementById(id);

async function loadPatterns(){
  const r=await fetch('/data/patterns.json',{cache:'no-store'});
  patterns=await r.json();
}
function signatureFromCondition(condition){
  const m=String(condition||'').match(/(?:A|R)(?:\s*,\s*(?:A|R))+/g);
  if(m) return m[m.length-1].replace(/\s+/g,'').replace(/,/g,'');
  const n=String(condition||'').match(/([AR](?:\s*,\s*[AR]){2,})/);
  return n ? n[1].replace(/\s+/g,'').replace(/,/g,'') : '';
}
function findSignal(){
  if(history.length<10 || active) return null;
  const ar=history.filter(x=>x!=='E');
  let best=null;
  for(const p of patterns){
    if(Number(p.strength)<75 || Number(p.window)<=0) continue;
    const sig=signatureFromCondition(p.condition);
    if(!sig || sig.length!==Number(p.window) || ar.length<sig.length) continue;
    if(ar.slice(-sig.length).join('')===sig){
      if(!best || Number(p.strength)>Number(best.strength) || (Number(p.strength)===Number(best.strength)&&Number(p.window)>Number(best.window))) best=p;
    }
  }
  return best;
}
function evaluateNewResult(r){
  history.push(r);
  if(active){
    if(r===active.target || r==='E') green++; else red++;
    active=null;
  }
  // Sem espera de 4 rodadas: reanalisa imediatamente após encerrar o sinal.
  const p=findSignal();
  if(p) active={target:p.target,p};
  render();
}
function mergeRemote(freshNewestFirst){
  const fresh=freshNewestFirst.slice().reverse();
  if(!fresh.length) return;
  if(!history.length){ history=fresh.slice(-100); render(); return; }
  const current=history.slice();
  // Encontra a maior sobreposição entre o final do histórico local e o início do bloco novo.
  let overlap=0, max=Math.min(current.length,fresh.length);
  for(let k=max;k>=1;k--){
    let ok=true;
    for(let i=0;i<k;i++) if(current[current.length-k+i]!==fresh[i]) {ok=false;break;}
    if(ok){overlap=k;break;}
  }
  const additions=fresh.slice(overlap);
  if(!additions.length) return;
  for(const r of additions) evaluateNewResult(r);
}
function render(){
  $('rounds').textContent=history.length;
  $('green').textContent=green;
  $('red').textContent=red;
  $('history').innerHTML=history.slice().reverse().map(r=>`<span class="ball b${r.toLowerCase()}">${emoji[r]}</span>`).join('');
  const box=document.querySelector('.signal');
  box.classList.toggle('active',!!active);
  if(active){
    $('signal').textContent=`ENTRE NO ${emoji[active.target]} ${active.target==='A'?'AZUL':'VERMELHO'}`;
    $('pattern').textContent=`${active.p.id} — ${active.p.name}`;
    $('force').textContent=`Força: ${active.p.strength}%`;
  }else{
    $('signal').textContent=history.length<10?`AGUARDANDO ${10-history.length} RODADAS`:'SEM SINAL NO MOMENTO';
    $('pattern').textContent=''; $('force').textContent='';
  }
}
async function sync(){
  try{
    const d=await (await fetch('/api',{cache:'no-store'})).json();
    if(d.ok){
      mergeRemote(d.results||[]);
      $('status').textContent=`AUTO • ${new Date(d.capturedAt).toLocaleTimeString('pt-BR')} • ${d.results?.length||0} resultados capturados`;
    }else $('status').textContent='Falha na captura automática: '+(d.error||'erro');
  }catch(e){ $('status').textContent='Robô indisponível: '+e.message; }
}
(async()=>{try{await loadPatterns();render();await sync();setInterval(sync,30000)}catch(e){$('status').textContent='Erro ao iniciar: '+e.message}})();
