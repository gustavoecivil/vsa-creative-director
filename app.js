"use strict";
const $ = id => document.getElementById(id);
const SAMPLE = [
 {id:"DEMO-01",block:1,chapter:"Abertura",era:"Escritório de engenharia, década de 1960",wardrobe:"Camisa social clara, gravata discreta, mangas arregaçadas",setting:"Escritório com pranchetas, régua T e desenhos técnicos",movement:"Mão direita traça linhas a nanquim; câmera desliza lateralmente",duration:6,objective:"Mostrar como projetos eram desenhados antes da computação"},
 {id:"DEMO-02",block:2,chapter:"A evolução",era:"Década de 1920",wardrobe:"Terno de tweed compatível com o período",setting:"Instalação industrial histórica com motores e fiação",movement:"Plano geral da instalação, câmera suave e estável",duration:6,objective:"Mostrar como a eletrificação transformou a atividade"},
 {id:"DEMO-03",block:3,chapter:"Projetos digitais",era:"Década de 1980",wardrobe:"Camisa social e gravata de época",setting:"Estação de desenho assistido por computador, monitor CRT",movement:"Detalhe das mãos usando o sistema CAD",duration:7,objective:"Mostrar a transição da prancheta para o CAD"},
 {id:"DEMO-04",block:4,chapter:"Engenharia conectada",era:"Indústria 4.0",wardrobe:"Uniforme técnico e equipamentos de proteção compatíveis com o local",setting:"Canteiro de obras com sensores e coleta de dados",movement:"Travelling acompanhando engenheiro em inspeção",duration:8,objective:"Ilustrar dados operacionais chegando em tempo real"},
 {id:"DEMO-05",block:5,chapter:"Inteligência artificial",era:"Engenharia 5.0",wardrobe:"Camisa preta profissional sem logotipo gerado",setting:"Estúdio técnico moderno com telas de análise e dashboards",movement:"Alternância entre rosto e gráficos de dados",duration:8,objective:"Mostrar o engenheiro definindo o problema antes de escolher a tecnologia"},
 {id:"DEMO-06",block:6,chapter:"Conclusão",era:"Presente",wardrobe:"Traje profissional contemporâneo",setting:"Paisagem de infraestrutura ao pôr do sol",movement:"Plano aberto e movimento lento de câmera",duration:8,objective:"Encerrar com a ideia de engenharia centrada nas pessoas"}
];
const PROVIDERS = [
 {id:"chatgpt",name:"ChatGPT · geração de imagens",kind:"image",mode:"Navegador / assinatura",url:"https://chatgpt.com/",cost:"A geração pode estar incluída na assinatura, sujeita a limites; API cobrada separadamente.",desc:"Imagens-base, figurino e ambientes; requer anexo de referências para identidade fiel."},
 {id:"kairogenimg",name:"Kairogen · Nano Banana",kind:"image",mode:"Portal web / aprovação",url:"https://app.kairogen.ai/",cost:"Consultar custo em créditos no portal antes de cada geração.",desc:"Quadros-base para animação e continuidade."},
 {id:"comfy",name:"ComfyUI · fluxos locais",kind:"image",mode:"Código aberto / instalação local",url:"https://github.com/comfyanonymous/ComfyUI",cost:"Sem créditos de provedor, mas pode exigir GPU e energia.",desc:"Pipelines de imagem configuráveis e reutilizáveis."},
 {id:"runwayimg",name:"Runway · geração de imagens",kind:"image",mode:"Portal / API sob contrato",url:"https://runwayml.com/",cost:"Verificar preço e modelo na conta.",desc:"Criação de quadros e referências de produção."},
 {id:"kairogen",name:"Kairogen · Veo 3.1",kind:"video",mode:"Portal / conexão sob avaliação",url:"https://app.kairogen.ai/",cost:"Consultar créditos e resolução antes de executar.",desc:"Animação de personagem e planos com referência aprovada."},
 {id:"runway",name:"Runway · geradores de vídeo",kind:"video",mode:"Portal / API oficial",url:"https://runwayml.com/",cost:"Cotas, preços e modelos sujeitos a atualização.",desc:"Vídeo cinematográfico e transformações de movimento."},
 {id:"flow",name:"Google Flow · Veo",kind:"video",mode:"Portal Google",url:"https://labs.google/fx/tools/flow",cost:"Limites e créditos dependem da conta.",desc:"Movimentos de câmera e cenas de ambiente."},
 {id:"higgsfield",name:"Higgsfield · Kling / Seedance",kind:"video",mode:"Portal / MCP sob avaliação",url:"https://higgsfield.ai/",cost:"Consultar modelos, durações, créditos e licenças.",desc:"Vídeos orientados por controle de câmera."},
 {id:"ffmpeg",name:"FFmpeg · motion e montagem",kind:"edit",mode:"Ferramenta local",url:"https://ffmpeg.org/",cost:"Sem créditos de IA; consumo computacional próprio.",desc:"Edição e transições locais; não gera imagens fotográficas."}
];
const state={shots:SAMPLE,imported:false,plan:null,plans:loadPlans(),db:null,urls:[]};
const SUGGEST={imagem:"chatgpt",rosto:"chatgpt",ambiente:"flow",grafico:"ffmpeg",cinematica:"runway"};
function opt(id,label){const o=document.createElement("option");o.value=id;o.textContent=label;return o;}
function node(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);return e;}
function loadPlans(){try{const x=JSON.parse(localStorage.getItem("vsa-creative-plans")||"[]");return Array.isArray(x)?x.slice(0,80):[];}catch{return [];}}
function persist(){try{localStorage.setItem("vsa-creative-plans",JSON.stringify(state.plans.slice(0,80)));return true;}catch{return false;}}
function getShot(){return state.shots.find(s=>s.id===$("shot").value);}
function getProvider(){return PROVIDERS.find(p=>p.id===$("provider").value);}
function setNotice(message){$("notice").textContent=message;}
function refreshShots(){
 const select=$("shot");select.replaceChildren();
 for(const s of state.shots){select.add(opt(s.id,s.id+" · "+s.chapter+" · "+s.era.slice(0,48)));}
 $("shotCount").textContent=state.shots.length;
 $("projectInfo").textContent=state.imported?"Plano carregado no navegador · "+state.shots.length+" tomadas":"Modo demonstração · "+SAMPLE.length+" cenas fictícias";
 showShot();
}
function showShot(){
 const s=getShot();if(!s)return;
 $("source").textContent="BLOCO "+s.block+" · "+s.chapter+" · "+s.duration+"s estimados\n"+s.era+"\n"+s.objective;
 renderFrames();
}
function suggest(){
 const choice=SUGGEST[$("kind").value]||"chatgpt";
 $("provider").value=choice;
 $("hint").textContent="Sugestão: "+PROVIDERS.find(p=>p.id===choice).name+". Você pode mudar antes de preparar a ficha.";
}
function sceneData(){
 const shot=getShot(), provider=getProvider(),kind=$("kind").value;
 if(!shot || !provider)throw Error("Escolha uma tomada e um gerador.");
 if(provider.kind==="image" && !["imagem","rosto"].includes(kind))throw Error("Esse gerador produz imagens, não clipes. Altere o tipo da tarefa.");
 return {shot,provider,kind,intent:$("intent").value.trim().slice(0,220),notes:$("notes").value.trim().slice(0,700)};
}

function createPrompt(x){
 const s=x.shot, image=x.provider.kind==="image", goal=x.intent||s.objective;
 const lines=[
  image?"Crie UMA imagem estática de alta qualidade, composição horizontal 16:9, para um filme documental.":"Planeje um clipe cinematográfico SEM SOM, formato horizontal 16:9, para um filme documental.",
  "ID DA TOMADA: "+s.id+" | BLOCO: "+s.block+" | CAPÍTULO: "+s.chapter,
  "ÉPOCA E CONTEXTO: "+s.era,
  "FIGURINO: "+s.wardrobe,
  "CENÁRIO: "+s.setting,
  "AÇÃO E CÂMERA: "+s.movement,
  "OBJETIVO NARRATIVO: "+goal,
  "CONTINUIDADE: preservar o mesmo personagem, objetos, mãos, acessórios, ambiente e iluminação em relação ao quadro previamente aprovado.",
  "REFERÊNCIAS: peça ao usuário a foto autorizada do personagem e a imagem de figurino; não declare que a identidade está preservada sem ver as referências.",
  "SEM logotipos inventados, textos artificiais, objetos anacrônicos ou mudanças de rosto.",
  "INSTRUÇÕES ADICIONAIS: "+(x.notes||"Nenhuma."),
  image?"Este pedido é APENAS para gerar o quadro-base. O vídeo será animado em uma etapa separada após aprovação.":"Não gerar diálogo ou voz. A narração aprovada será adicionada na montagem posterior.",
  "VALIDAÇÃO: submeter resultado à revisão humana antes de utilizar como referência ou publicar."
 ];
 return lines.join("\n\n");
}
function makePlan(data){
 return {
  id:"VSA-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6),
  shot_id:data.shot.id,block:data.shot.block,chapter:data.shot.chapter,
  provider_id:data.provider.id,provider_name:data.provider.name,
  type:data.kind,notes:data.notes,objective:data.intent||data.shot.objective,
  prompt:createPrompt(data),cost:data.provider.cost,duration:data.shot.duration,
  created:new Date().toISOString(),status:"rascunho_sem_autorizacao_de_geracao"
 };
}
function displayPlan(p){
 state.plan=p;
 $("noPlan").hidden=true;$("planResult").hidden=false;
 $("planTitle").textContent=p.shot_id+" · "+p.chapter;
 $("planProvider").textContent=p.provider_name;
 $("planCost").textContent=p.cost;
 $("planDuration").textContent=(Number(p.duration)||0)+"s (estimado)";
 $("prompt").value=p.prompt;
 setNotice("Ficha preparada. Nenhuma geração executada.");
}
function buildCatalog(){
 const holder=$("models");holder.replaceChildren();
 for(const p of PROVIDERS){
  const card=node("article","model");
  const a=node("a","","Abrir site / documentação ↗");
  a.href=p.url;a.target="_blank";a.rel="noopener noreferrer";
  card.append(node("b","",p.name),node("small","",p.mode),node("p","",p.desc),node("small","",p.cost),a);
  holder.append(card);
 }
}
function refreshHistory(){
 const area=$("history");area.replaceChildren();
 if(!state.plans.length){area.append(node("p","muted","Nenhuma ficha salva neste navegador."));return;}
 for(const p of state.plans.slice(0,25)){
  const card=node("div","history-row");
  const button=node("button","secondary","Abrir ficha");
  button.type="button";button.addEventListener("click",()=>{
   displayPlan(p);window.scrollTo({top:0,behavior:"smooth"});
  });
  card.append(node("strong","",p.shot_id+" · "+p.provider_name),node("small","",p.created+" · rascunho (sem autorização para gerar)"),button);
  area.append(card);
 }
}
async function copyPrompt(p){
 try{await navigator.clipboard.writeText(p);return true;}
 catch{$("prompt").focus();$("prompt").select();return false;}
}
function downloadJSON(){
 const publicPayload={app:"VSA Creative Director",version:1,exported:new Date().toISOString(),plans:state.plans};
 const blob=new Blob([JSON.stringify(publicPayload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");
 a.href=url;a.download="VSA_Creative_Director_Fichas.json";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function importShots(obj){
 const list=Array.isArray(obj)?obj:Array.isArray(obj.takes_planned)?obj.takes_planned:Array.isArray(obj.shots)?obj.shots:null;
 if(!list || !list.length || list.length>2000)throw Error("JSON deve conter um array de tomadas com até 2000 registros.");
 return list.map((t,i)=>{
  const id=String(t.shot_id||t.id||"CENA-"+(i+1)).slice(0,60);
  if(!/^[\p{L}\p{N}_ .-]{1,60}$/u.test(id))throw Error("Identificador de tomada inválido no JSON.");
  return {id,block:t.source_block||t.block||i+1,
   chapter:String(t.chapter||"Produção").slice(0,100),
   era:String(t.visual_era||t.era||"A definir").slice(0,200),
   wardrobe:String(t.wardrobe||"Definir figurino aprovado").slice(0,250),
   setting:String(t.setting||"Definir cenário").slice(0,300),
   movement:String(t.movement||"Definir câmera e movimento").slice(0,300),
   duration:Number(t.duration_target_s??t.duration??6)||6,
   objective:String(t.reason||t.objective||"Descrever visualmente a tomada").slice(0,320)};
 });
}
$("shot").addEventListener("change",showShot);
$("kind").addEventListener("change",suggest);
$("prepare").addEventListener("click",()=>{
 try{displayPlan(makePlan(sceneData()));}catch(e){setNotice(e.message);}
});
$("save").addEventListener("click",()=>{
 try{const p=makePlan(sceneData());displayPlan(p);state.plans.unshift(p);
  const persisted=persist();refreshHistory();
  setNotice(persisted?"Ficha salva somente neste navegador.":"Ficha preparada, mas armazenamento local indisponível. Exporte as fichas.");
 }catch(e){setNotice(e.message);}
});
$("copy").addEventListener("click",async()=>{
 if(!state.plan)return;setNotice(await copyPrompt(state.plan.prompt)?"Prompt copiado.":"Selecionei o texto para cópia manual.");
});
$("openProvider").addEventListener("click",()=>{
 const p=PROVIDERS.find(x=>x.id===state.plan?.provider_id);
 if(p)window.open(p.url,"_blank","noopener,noreferrer");
});
$("export").addEventListener("click",downloadJSON);

function openFrameDB(){
 return new Promise((resolve,reject)=>{
  if(!("indexedDB" in window)){reject(Error("Navegador sem IndexedDB"));return;}
  const request=indexedDB.open("vsa-creative-frames",1);
  request.onupgradeneeded=()=>request.result.createObjectStore("frames",{keyPath:"id"});
  request.onerror=()=>reject(request.error||Error("Banco de imagens indisponível"));
  request.onsuccess=()=>resolve(request.result);
 });
}
function txFrames(mode,callback){
 return new Promise((resolve,reject)=>{
  if(!state.db){reject(Error("Armazenamento de imagens indisponível"));return;}
  const t=state.db.transaction("frames",mode);
  const store=t.objectStore("frames");
  let value;
  try{value=callback(store);}catch(err){reject(err);return;}
  t.oncomplete=()=>resolve(value);
  t.onerror=()=>reject(t.error||Error("Falha de armazenamento"));
 });
}
async function getFrames(){
 return new Promise((resolve,reject)=>{
  if(!state.db){resolve([]);return;}
  const r=state.db.transaction("frames","readonly").objectStore("frames").getAll();
  r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);
 });
}
async function renderFrames(){
 const parent=$("frames");parent.replaceChildren();
 for(const url of state.urls)URL.revokeObjectURL(url);
 state.urls=[];
 const shot=getShot();
 if(!shot)return;
 let frames;
 try{frames=(await getFrames()).filter(f=>f.shot===shot.id).sort((a,b)=>b.date.localeCompare(a.date));}
 catch(e){$("frameNotice").textContent=e.message;return;}
 if(!frames.length){parent.append(node("p","hint","Nenhuma imagem vinculada a esta tomada."));return;}
 for(const frame of frames){
  const card=node("article","frame"),image=document.createElement("img");
  const imageUrl=URL.createObjectURL(frame.blob);state.urls.push(imageUrl);
  image.src=imageUrl;image.alt="Quadro da tomada "+shot.id;
  const link=node("a","","Baixar quadro ↗");link.href=imageUrl;link.download=frame.filename;
  const actions=node("div","actions");
  for(const [decision,label] of [["aprovado","Aprovar"],["reprovado","Reprovar"]]){
   const btn=node("button","secondary",label);btn.type="button";
   btn.addEventListener("click",async()=>{
    frame.review=decision;frame.reviewDate=new Date().toISOString();
    try{await txFrames("readwrite",store=>store.put(frame));await renderFrames();
      $("frameNotice").textContent="Quadro "+decision+". Nenhum gerador de vídeo foi acionado.";
    }catch(e){$("frameNotice").textContent=e.message;}
   });actions.append(btn);
  }
  card.append(image,node("strong","",frame.shot+" · "+frame.review),node("p","caption","Arquivo local · "+frame.filename),link,actions);
  parent.append(card);
 }
}
async function validateImage(file){
 if(!file||!["image/png","image/jpeg","image/webp"].includes(file.type))throw Error("Escolha PNG, JPEG ou WEBP.");
 if(file.size<100||file.size>8*1024*1024)throw Error("Imagem deve ter até 8 MB.");
 const bytes=new Uint8Array(await file.slice(0,16).arrayBuffer());
 const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const webp=String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
 if(!(png||jpg||webp))throw Error("O conteúdo do arquivo não parece uma imagem compatível.");
 return file;
}
$("importFrame").addEventListener("click",async()=>{
 try{
  const file=await validateImage($("frameUpload").files[0]);
  const shot=getShot();if(!shot)throw Error("Selecione uma tomada.");
  const id="Q-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
  const frame={id,shot:shot.id,filename:shot.id+"_"+file.name.slice(0,90),blob:file,
   review:"pendente",date:new Date().toISOString(),origin:"Arquivo selecionado pelo usuário"};
  await txFrames("readwrite",s=>s.put(frame));
  $("frameUpload").value="";await renderFrames();
  $("frameNotice").textContent="Quadro importado para "+shot.id+". Revise e aprove antes de animar.";
 }catch(e){$("frameNotice").textContent="Importação: "+e.message;}
});
$("askChatGPT").addEventListener("click",async()=>{
 $("kind").value="imagem";$("provider").value="chatgpt";
 let p;
 try{p=makePlan(sceneData());displayPlan(p);}
 catch(e){$("frameNotice").textContent=e.message;return;}
 const ok=await copyPrompt(p.prompt);
 window.open("https://chatgpt.com/","_blank","noopener,noreferrer");
 $("frameNotice").textContent=ok?
 "Prompt copiado. No ChatGPT, cole o texto e anexe as fotos autorizadas. Depois salve e importe aqui a imagem.":
 "O prompt foi selecionado. Copie o texto, abra o ChatGPT e anexe as referências.";
});
$("projectFile").addEventListener("change",async event=>{
 const file=event.target.files[0];if(!file)return;
 try{
  if(file.size>8*1024*1024)throw Error("Plano JSON muito grande.");
  const data=JSON.parse(await file.text());
  state.shots=importShots(data);state.imported=true;
  refreshShots();$("kind").value="imagem";suggest();
  setNotice("Plano carregado APENAS nesta aba. Não foi enviado ao GitHub.");
 }catch(e){setNotice("Importação: "+e.message);}
 event.target.value="";
});
$("resetProject").addEventListener("click",()=>{
 state.shots=SAMPLE;state.imported=false;refreshShots();suggest();setNotice("Modo de demonstração restaurado.");
});
async function boot(){
 $("provider").replaceChildren();
 for(const p of PROVIDERS)$("provider").add(opt(p.id,p.name+" · "+(p.kind==="image"?"imagem":p.kind==="video"?"vídeo":"edição")));
 refreshShots();suggest();buildCatalog();refreshHistory();
 try{state.db=await openFrameDB();await renderFrames();}
 catch(e){$("frameNotice").textContent="Imagens poderão não ser persistidas: "+e.message;}
}
boot();
