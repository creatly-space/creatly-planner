import re, sys

# ── hooks.js ─────────────────────────────────────────────────────────────────
with open('src/hooks.js') as f:
    hooks = f.read()

if 'useIdeas' not in hooks:
    hooks += '''
export function useIdeas() {
  const [ideas, setIdeas] = React.useState([]);
  const fetch = async () => {
    const {data} = await supabase.from('ideas').select('*').order('created_at',{ascending:false});
    if(data) setIdeas(data);
  };
  React.useEffect(()=>{ fetch(); const ch=supabase.channel('ideas-rt').on('postgres_changes',{event:'*',schema:'public',table:'ideas'},fetch).subscribe(); return ()=>supabase.removeChannel(ch); },[]);
  const saveIdea = async(idea)=>{ const row={id:idea.id||crypto.randomUUID(),title:idea.title||'',description:idea.description||'',status:idea.status||'inbox',category:idea.category||'other',assigned_to:idea.assigned_to||null,created_by:idea.created_by||null,created_at:idea.created_at||new Date().toISOString(),updated_at:new Date().toISOString()}; await supabase.from('ideas').upsert(row); return row; };
  const deleteIdea = async(id)=>{ await supabase.from('ideas').delete().eq('id',id); };
  return {ideas,saveIdea,deleteIdea};
}
'''
    with open('src/hooks.js','w') as f: f.write(hooks)
    print('hooks.js: useIdeas added')
else:
    print('hooks.js: already has useIdeas')

# ── App.jsx ───────────────────────────────────────────────────────────────────
with open('src/App.jsx') as f:
    app = f.read()

changed = False

# 1) hook call
if 'useIdeas()' not in app:
    app = app.replace(
        'const { services, saveService, deleteService } = useServices();',
        'const { services, saveService, deleteService } = useServices();\n  const { ideas, saveIdea, deleteIdea } = useIdeas();'
    )
    print('App: hook call added'); changed=True

# 2) nav tab
old_nav = '{ key: "home", label: "Home" }, { key: "planner", label: "Planner" }, { key: "docs", label: "Docs" }, { key: "clients", label: "Clients" }, { key: "services", label: "Services" }'
new_nav = '{ key: "home", label: "Home" }, { key: "planner", label: "Planner" }, { key: "ideas", label: "Ideas" }, { key: "docs", label: "Docs" }, { key: "clients", label: "Clients" }, { key: "services", label: "Services" }'
if old_nav in app:
    app = app.replace(old_nav, new_nav)
    print('App: Ideas nav added'); changed=True
elif '"ideas"' in app and 'label: "Ideas"' in app:
    print('App: nav already has Ideas')
else:
    print('WARNING: nav pattern not found')

# 3) IdeasView render block
if '{/* Ideas view */}' not in app:
    app = app.replace(
        '      {/* Service Modals */}',
        '''      {/* Ideas view */}
      {module === "ideas" && (
        <IdeasView ideas={ideas} onSave={saveIdea} onDelete={deleteIdea} currentUser={currentUser} />
      )}

      {/* Service Modals */}'''
    )
    print('App: IdeasView render block added'); changed=True

# 4) IdeasView component - insert before export default
COMPONENT = r'''
/* ═══ IDEAS MODULE ═══════════════════════════════════════════════════════════ */
const IDEA_STATUSES=[{key:'inbox',label:'Inbox',emoji:'💡'},{key:'hot',label:'Hot',emoji:'🔥'},{key:'building',label:'Building',emoji:'🏗️'},{key:'shipped',label:'Shipped',emoji:'✅'}];
const IDEA_CATS=[{key:'campaign',label:'Campaign',color:'#7ACF85'},{key:'content',label:'Content',color:'#60A5FA'},{key:'product',label:'Product',color:'#F472B6'},{key:'tech',label:'Tech',color:'#FBBF24'},{key:'other',label:'Other',color:'#94A3B8'}];

function IdeaCard({idea,onEdit,onDelete}){
  const cat=IDEA_CATS.find(c=>c.key===idea.category)||IDEA_CATS[4];
  const [hov,setHov]=React.useState(false);
  const [conf,setConf]=React.useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setConf(false);}}
      onClick={()=>onEdit(idea)}
      style={{background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:'11px 13px',marginBottom:8,cursor:'pointer',position:'relative',boxShadow:hov?`0 2px 10px ${COLORS.accent}33`:'none',transition:'box-shadow 0.15s'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:600,fontSize:14,color:COLORS.text,marginBottom:4,lineHeight:1.3}}>{idea.title}</div>
          {idea.description&&<div style={{fontSize:12,color:COLORS.textDim,lineHeight:1.4,marginBottom:6,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{idea.description}</div>}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
            <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:20,background:cat.color+'22',color:cat.color,border:`1px solid ${cat.color}44`}}>{cat.label}</span>
            {idea.assigned_to&&<span style={{fontSize:11,color:COLORS.textDim,background:COLORS.surfaceActive,padding:'2px 7px',borderRadius:20}}>{idea.assigned_to==='ludvig'?'🧢 Ludvig':'🎨 Johannes'}</span>}
          </div>
        </div>
        {hov&&<div style={{flexShrink:0}} onClick={e=>e.stopPropagation()}>
          {conf?<><button onClick={()=>onDelete(idea.id)} style={{fontSize:11,padding:'3px 8px',borderRadius:6,border:'none',background:'#ef4444',color:'#fff',cursor:'pointer',fontWeight:600,marginRight:4}}>Delete?</button><button onClick={()=>setConf(false)} style={{fontSize:11,padding:'3px 8px',borderRadius:6,border:`1px solid ${COLORS.border}`,background:'transparent',color:COLORS.textDim,cursor:'pointer'}}>No</button></>:<button onClick={()=>setConf(true)} style={{fontSize:14,padding:'2px 6px',borderRadius:6,border:'none',background:'transparent',color:COLORS.textDim,cursor:'pointer'}}>✕</button>}
        </div>}
      </div>
    </div>
  );
}

function IdeaModal({idea,onSave,onClose,currentUser}){
  const [title,setTitle]=React.useState(idea?.title||'');
  const [desc,setDesc]=React.useState(idea?.description||'');
  const [status,setStatus]=React.useState(idea?.status||'inbox');
  const [cat,setCat]=React.useState(idea?.category||'other');
  const [assignee,setAssignee]=React.useState(idea?.assigned_to||'');
  const [kitLoad,setKitLoad]=React.useState(false);
  const [kitOut,setKitOut]=React.useState('');
  const save=()=>{if(!title.trim())return;onSave({...(idea||{}),title:title.trim(),description:desc.trim(),status,category:cat,assigned_to:assignee||null,created_by:idea?.created_by||currentUser});onClose();};
  const expand=async()=>{
    if(!title.trim())return;setKitLoad(true);setKitOut('');
    try{
      const r=await fetch('/api/claude',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:`Expand this idea into a punchy creative brief (3-5 bullets):\n\nIdea: ${title}\n${desc?'Context: '+desc:''}\n\nFormat:\n• Goal\n• Target audience\n• Key message\n• Format/channel\n• Success metric`}]})});
      const d=await r.json();
      setKitOut(d.content?.filter(b=>b.type==='text').map(b=>b.text).join('')||'');
    }catch(e){setKitOut('Error: '+e.message);}
    setKitLoad(false);
  };
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onClose}>
      <div style={{background:COLORS.surface,borderRadius:14,width:'100%',maxWidth:540,border:`1px solid ${COLORS.border}`,padding:24,maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:700,color:COLORS.text}}>{idea?'Edit Idea':'New Idea'}</h2>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:COLORS.textDim,lineHeight:1}}>×</button>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:COLORS.textDim,display:'block',marginBottom:6}}>TITLE *</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} autoFocus placeholder="What's the idea?" style={{width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${COLORS.border}`,background:COLORS.bg,color:COLORS.text,fontSize:15,fontWeight:500,boxSizing:'border-box'}}/>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:COLORS.textDim,display:'block',marginBottom:6}}>DESCRIPTION</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Context, links, inspiration..." rows={3} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${COLORS.border}`,background:COLORS.bg,color:COLORS.text,fontSize:14,resize:'vertical',boxSizing:'border-box',fontFamily:'inherit'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
          <div><label style={{fontSize:12,fontWeight:600,color:COLORS.textDim,display:'block',marginBottom:6}}>STATUS</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:`1px solid ${COLORS.border}`,background:COLORS.bg,color:COLORS.text,fontSize:14}}>
              {IDEA_STATUSES.map(s=><option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
            </select></div>
          <div><label style={{fontSize:12,fontWeight:600,color:COLORS.textDim,display:'block',marginBottom:6}}>CATEGORY</label>
            <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:`1px solid ${COLORS.border}`,background:COLORS.bg,color:COLORS.text,fontSize:14}}>
              {IDEA_CATS.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
            </select></div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,fontWeight:600,color:COLORS.textDim,display:'block',marginBottom:6}}>ASSIGNED TO</label>
          <select value={assignee} onChange={e=>setAssignee(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:`1px solid ${COLORS.border}`,background:COLORS.bg,color:COLORS.text,fontSize:14}}>
            <option value="">Unassigned</option><option value="ludvig">🧢 Ludvig</option><option value="johannes">🎨 Johannes</option>
          </select>
        </div>
        <div style={{marginBottom:20,padding:'12px 14px',borderRadius:10,border:`1px solid ${COLORS.border}`,background:COLORS.bg}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:kitOut?10:0}}>
            <span style={{fontSize:13,fontWeight:600,color:COLORS.accent}}>✨ Expand with Kit</span>
            <button onClick={expand} disabled={kitLoad||!title.trim()} style={{fontSize:12,padding:'5px 14px',borderRadius:8,border:'none',background:kitLoad?COLORS.surfaceActive:COLORS.accent,color:kitLoad?COLORS.textDim:'#fff',cursor:title.trim()?'pointer':'not-allowed',fontWeight:600}}>{kitLoad?'Thinking...':'Generate Brief'}</button>
          </div>
          {kitOut&&<div style={{fontSize:13,color:COLORS.text,lineHeight:1.6,whiteSpace:'pre-wrap',marginTop:8}}>{kitOut}</div>}
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'9px 18px',borderRadius:8,border:`1px solid ${COLORS.border}`,background:'transparent',color:COLORS.text,cursor:'pointer',fontSize:14}}>Cancel</button>
          <button onClick={save} disabled={!title.trim()} style={{padding:'9px 18px',borderRadius:8,border:'none',background:title.trim()?COLORS.accent:COLORS.surfaceActive,color:title.trim()?'#fff':COLORS.textDim,cursor:title.trim()?'pointer':'not-allowed',fontSize:14,fontWeight:600}}>Save Idea</button>
        </div>
      </div>
    </div>
  );
}

function IdeasView({ideas,onSave,onDelete,currentUser}){
  const [editing,setEditing]=React.useState(null);
  const [showNew,setShowNew]=React.useState(false);
  const [quick,setQuick]=React.useState({});
  const [filter,setFilter]=React.useState('all');
  const filtered=filter==='all'?ideas:ideas.filter(i=>i.category===filter);
  const addQuick=async(status)=>{const t=(quick[status]||'').trim();if(!t)return;await onSave({title:t,status,created_by:currentUser});setQuick(p=>({...p,[status]:''}))}; 
  return(
    <div style={{padding:'24px 28px',maxWidth:1400,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{margin:0,fontSize:24,fontWeight:700,color:COLORS.text}}>Ideas</h1>
          <p style={{margin:'4px 0 0',fontSize:14,color:COLORS.textDim}}>{ideas.length} idea{ideas.length!==1?'s':''} total</p>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:4,background:COLORS.surfaceActive,padding:4,borderRadius:8}}>
            <button onClick={()=>setFilter('all')} style={{fontSize:12,padding:'4px 10px',borderRadius:6,border:'none',cursor:'pointer',background:filter==='all'?COLORS.surface:'transparent',color:filter==='all'?COLORS.text:COLORS.textDim,fontWeight:filter==='all'?600:400}}>All</button>
            {IDEA_CATS.map(c=><button key={c.key} onClick={()=>setFilter(c.key)} style={{fontSize:12,padding:'4px 10px',borderRadius:6,border:'none',cursor:'pointer',background:filter===c.key?c.color:'transparent',color:filter===c.key?'#fff':COLORS.textDim,fontWeight:filter===c.key?600:400}}>{c.label}</button>)}
          </div>
          <button onClick={()=>setShowNew(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:8,border:'none',background:COLORS.accent,color:'#fff',cursor:'pointer',fontSize:14,fontWeight:600}}>+ New Idea</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,alignItems:'start'}}>
        {IDEA_STATUSES.map(col=>{
          const cols=filtered.filter(i=>i.status===col.key);
          return(
            <div key={col.key} style={{background:COLORS.surface,borderRadius:12,padding:14,border:`1px solid ${COLORS.border}`,minHeight:200}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:18}}>{col.emoji}</span><span style={{fontSize:14,fontWeight:700,color:COLORS.text}}>{col.label}</span></div>
                <span style={{fontSize:12,fontWeight:600,background:COLORS.surfaceActive,color:COLORS.textDim,padding:'2px 8px',borderRadius:20}}>{cols.length}</span>
              </div>
              {cols.map(idea=><IdeaCard key={idea.id} idea={idea} onEdit={setEditing} onDelete={onDelete}/>)}
              {cols.length===0&&<div style={{padding:'20px 0',textAlign:'center',color:COLORS.textDim,fontSize:13}}>No ideas here yet</div>}
              <div style={{marginTop:10,display:'flex',gap:6}}>
                <input value={quick[col.key]||''} onChange={e=>setQuick(p=>({...p,[col.key]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addQuick(col.key)} placeholder="Quick add..." style={{flex:1,fontSize:13,padding:'7px 10px',borderRadius:7,border:`1px solid ${COLORS.border}`,background:COLORS.bg,color:COLORS.text}}/>
                <button onClick={()=>addQuick(col.key)} style={{fontSize:18,padding:'4px 10px',borderRadius:7,border:'none',background:COLORS.accent+'22',color:COLORS.accent,cursor:'pointer',lineHeight:1}}>+</button>
              </div>
            </div>
          );
        })}
      </div>
      {showNew&&<IdeaModal idea={null} onSave={onSave} onClose={()=>setShowNew(false)} currentUser={currentUser}/>}
      {editing&&<IdeaModal idea={editing} onSave={onSave} onClose={()=>setEditing(null)} currentUser={currentUser}/>}
    </div>
  );
}

'''

if 'function IdeasView' not in app:
    app = app.replace('export default function App', COMPONENT + 'export default function App')
    print('App: IdeasView component added'); changed=True
else:
    print('App: IdeasView already present')

with open('src/App.jsx','w') as f: f.write(app)
print('Done. Lines in App.jsx:', app.count('\n'))
