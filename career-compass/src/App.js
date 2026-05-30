import { useState, useRef } from "react";
 
const COLORS = {
  bg: "#0A0A0F", surface: "#111118", surfaceHigh: "#1A1A24",
  border: "#2A2A3A", accent: "#6C63FF", accentGlow: "#6C63FF33",
  accentSoft: "#6C63FF22", green: "#22C55E", amber: "#F59E0B",
  red: "#EF4444", blue: "#3B82F6", textPrimary: "#F0F0F8",
  textSecondary: "#8888AA", textMuted: "#444466",
};
 
const S = {
  app: { minHeight:"100vh", background:COLORS.bg, color:COLORS.textPrimary, fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex" },
  sidebar: { width:230, background:COLORS.surface, borderRight:`1px solid ${COLORS.border}`, display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, left:0, height:"100vh", zIndex:10, overflowY:"auto" },
  logo: { padding:"0 20px 24px", borderBottom:`1px solid ${COLORS.border}`, marginBottom:12 },
  logoText: { fontSize:16, fontWeight:700, color:COLORS.textPrimary, letterSpacing:"-0.02em" },
  logoDot: { display:"inline-block", width:8, height:8, borderRadius:"50%", background:COLORS.accent, marginRight:8, boxShadow:`0 0 8px ${COLORS.accent}` },
  navItem: (a) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", cursor:"pointer", fontSize:13.5, fontWeight:a?600:400, color:a?COLORS.textPrimary:COLORS.textSecondary, background:a?COLORS.accentSoft:"transparent", borderLeft:a?`2px solid ${COLORS.accent}`:"2px solid transparent", transition:"all 0.15s" }),
  navSection: { fontSize:10, fontWeight:600, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", padding:"16px 20px 6px" },
  main: { marginLeft:230, flex:1, padding:"32px 40px", maxWidth:"calc(100vw - 230px)" },
  pageTitle: { fontSize:26, fontWeight:700, letterSpacing:"-0.03em", marginBottom:4 },
  pageSub: { fontSize:13.5, color:COLORS.textSecondary, marginBottom:28 },
  card: { background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:"22px 24px", marginBottom:16 },
  cardTitle: { fontSize:14, fontWeight:600, marginBottom:14, color:COLORS.textPrimary },
  input: { width:"100%", background:COLORS.surfaceHigh, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"11px 14px", color:COLORS.textPrimary, fontSize:13.5, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" },
  btn: (v="primary", sm=false) => ({ padding:sm?"6px 14px":"10px 20px", borderRadius:8, cursor:"pointer", fontSize:sm?12:13.5, fontWeight:600, transition:"all 0.15s", background:v==="primary"?COLORS.accent:v==="danger"?"#EF444420":v==="ghost"?"transparent":v==="pro"?"linear-gradient(135deg,#F59E0B,#EF4444)":COLORS.surfaceHigh, color:v==="primary"?"#fff":v==="danger"?COLORS.red:v==="ghost"?COLORS.textSecondary:v==="pro"?"#fff":COLORS.textPrimary, border:v==="ghost"?`1px solid ${COLORS.border}`:v==="danger"?`1px solid ${COLORS.red}44`:"none", boxShadow:v==="primary"?`0 0 20px ${COLORS.accentGlow}`:v==="pro"?"0 0 20px #F59E0B44":"none" }),
  badge: (c) => ({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c==="green"?"#22C55E22":c==="amber"?"#F59E0B22":c==="red"?"#EF444422":c==="blue"?"#3B82F622":COLORS.accentSoft, color:c==="green"?COLORS.green:c==="amber"?COLORS.amber:c==="red"?COLORS.red:c==="blue"?COLORS.blue:COLORS.accent }),
  scoreBar: { height:6, borderRadius:3, background:COLORS.border, overflow:"hidden", marginTop:6 },
  scoreFill: (p,c) => ({ height:"100%", width:`${p}%`, background:c, borderRadius:3, transition:"width 0.8s ease" }),
  statGrid: (cols=4) => ({ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:14, marginBottom:20 }),
  statCard: { background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"16px 18px" },
  statVal: { fontSize:28, fontWeight:700, letterSpacing:"-0.03em" },
  statLabel: { fontSize:12, color:COLORS.textSecondary, marginTop:2 },
  th: { padding:"10px 14px", fontSize:11, fontWeight:600, color:COLORS.textSecondary, textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", background:COLORS.surfaceHigh, borderBottom:`1px solid ${COLORS.border}` },
  td: { padding:"11px 14px", fontSize:13, borderBottom:`1px solid ${COLORS.border}`, color:COLORS.textPrimary, verticalAlign:"middle" },
  feedbackBox: { background:"#6C63FF11", border:`1px solid ${COLORS.accentGlow}`, borderRadius:8, padding:"10px 12px", fontSize:12.5, color:COLORS.textSecondary, marginTop:8, lineHeight:1.6 },
  modal: { position:"fixed", inset:0, background:"#000000CC", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" },
  modalBox: { background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:20, padding:"36px", maxWidth:500, width:"90%", position:"relative" },
};
 
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function LoadingDots(){ return <span>{[0,1,2].map(i=><span key={i} style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:COLORS.accent,margin:"0 3px",animation:"bounce 1.2s infinite",animationDelay:`${i*0.2}s`}}/>)}</span>; }
 
// ── USAGE TRACKER ─────────────────────────────────────────────────────────────
const LIMITS = { free:{ scans:3, uploads:90, covers:5, interviews:3, salary:2, roles:3 }, pro:{ scans:999, uploads:500, covers:999, interviews:999, salary:999, roles:999 } };
 
function getToday(){ return new Date().toISOString().split("T")[0]; }
function getMonth(){ return new Date().toISOString().slice(0,7); }
 
function useUsage(isPro){
  const [usage, setUsage] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_usage")||"{}"); } catch { return {}; }
  });
 
  const save = (u) => { setUsage(u); try{ localStorage.setItem("cc_usage",JSON.stringify(u)); }catch{} };
 
  const check = (type) => {
    if(isPro) return true;
    const today = getToday(), month = getMonth();
    const u = usage;
    if(type==="uploads"){
      const monthCount = u[`uploads_${month}`]||0;
      return monthCount < LIMITS.free.uploads;
    }
    const dayCount = u[`${type}_${today}`]||0;
    return dayCount < (LIMITS.free[type]||3);
  };
 
  const consume = (type) => {
    const today = getToday(), month = getMonth();
    const u = {...usage};
    if(type==="uploads"){
      u[`uploads_${month}`] = (u[`uploads_${month}`]||0)+1;
    } else {
      u[`${type}_${today}`] = (u[`${type}_${today}`]||0)+1;
    }
    save(u);
  };
 
  const getCount = (type) => {
    const today = getToday(), month = getMonth();
    if(type==="uploads") return usage[`uploads_${month}`]||0;
    return usage[`${type}_${today}`]||0;
  };
 
  const getRemaining = (type) => {
    if(isPro) return type==="uploads"?LIMITS.pro.uploads:LIMITS.pro.scans;
    const limit = type==="uploads"?LIMITS.free.uploads:(LIMITS.free[type]||3);
    return Math.max(0, limit - getCount(type));
  };
 
  return { check, consume, getCount, getRemaining };
}
 
// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, reason="" }){
  const [email,setEmail]=useState("");
  const [submitted,setSubmitted]=useState(false);
 
  const submit = () => {
    if(!email.includes("@")) return;
    setSubmitted(true);
  };
 
  return(
    <div style={S.modal} onClick={onClose}>
      <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"transparent",border:"none",color:COLORS.textSecondary,fontSize:20,cursor:"pointer"}}>✕</button>
 
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:36,marginBottom:8}}>⚡</div>
          <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Upgrade to Pro</div>
          {reason && <div style={{fontSize:13.5,color:COLORS.red,marginBottom:4}}>{reason}</div>}
          <div style={{fontSize:13.5,color:COLORS.textSecondary}}>Unlock the full CareerCompass experience</div>
        </div>
 
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
          {[
            {label:"Resume Scans",free:"3/day",pro:"Unlimited"},
            {label:"File Uploads",free:"90/month",pro:"500/month"},
            {label:"Cover Letters",free:"5/day",pro:"Unlimited"},
            {label:"Interview Sessions",free:"3/day",pro:"Unlimited"},
            {label:"Salary Analysis",free:"2/day",pro:"Unlimited"},
            {label:"Role Finder",free:"3/day",pro:"Unlimited"},
          ].map(({label,free,pro})=>(
            <div key={label} style={{background:COLORS.surfaceHigh,borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontSize:11,color:COLORS.textMuted,marginBottom:4}}>{label}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:COLORS.textSecondary}}>{free}</span>
                <span style={{fontSize:12,fontWeight:600,color:COLORS.green}}>→ {pro}</span>
              </div>
            </div>
          ))}
        </div>
 
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:28,fontWeight:700,color:COLORS.textPrimary}}>$5<span style={{fontSize:14,fontWeight:400,color:COLORS.textSecondary}}>/month</span></div>
          <div style={{fontSize:12,color:COLORS.textMuted,marginTop:2}}>Cancel anytime · No hidden fees</div>
        </div>
 
        {!submitted ? (
          <div>
            <div style={{fontSize:13,color:COLORS.textSecondary,textAlign:"center",marginBottom:10}}>🚀 Join the waitlist — Pro launching soon!</div>
            <div style={{display:"flex",gap:8}}>
              <input style={{...S.input,flex:1,resize:"none"}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
              <button style={S.btn("pro")} onClick={submit}>Join Waitlist</button>
            </div>
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"16px",background:"#22C55E11",border:"1px solid #22C55E33",borderRadius:10}}>
            <div style={{fontSize:20,marginBottom:6}}>🎉</div>
            <div style={{fontSize:14,fontWeight:600,color:COLORS.green}}>You're on the list!</div>
            <div style={{fontSize:13,color:COLORS.textSecondary,marginTop:4}}>We'll email you the moment Pro launches.</div>
          </div>
        )}
      </div>
    </div>
  );
}
 
// ── LIMIT GATE HOC ────────────────────────────────────────────────────────────
function LimitBanner({ type, remaining, onUpgrade }){
  const isLow = remaining<=1;
  if(remaining>5) return null;
  return(
    <div style={{background:isLow?"#EF444411":"#F59E0B11",border:`1px solid ${isLow?COLORS.red+"44":COLORS.amber+"44"}`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{fontSize:13,color:isLow?COLORS.red:COLORS.amber}}>
        {isLow?`⚠ Last use remaining today for ${type}`:`⚡ ${remaining} ${type} remaining today`}
      </div>
      <button style={S.btn("pro",true)} onClick={onUpgrade}>Upgrade $5/mo</button>
    </div>
  );
}
 
// ── FILE DROP ZONE ────────────────────────────────────────────────────────────
function FileDropZone({ onFileRead, label="Drop your resume here or click to upload", disabled=false }){
  const [dragging,setDragging]=useState(false);
  const [fileName,setFileName]=useState("");
  const inputRef=useRef();
 
  const handleFile=(file)=>{
    if(!file||disabled) return;
    setFileName(file.name);
    const reader=new FileReader();
    reader.onload=(e)=>onFileRead(e.target.result, file.name);
    reader.readAsText(file);
  };
 
  const onDrop=(e)=>{ e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
 
  return(
    <div onClick={()=>!disabled&&inputRef.current.click()} onDragOver={(e)=>{e.preventDefault();if(!disabled)setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={onDrop}
      style={{border:`2px dashed ${dragging?COLORS.accent:disabled?COLORS.border:COLORS.border}`,borderRadius:12,padding:"20px",textAlign:"center",cursor:disabled?"not-allowed":"pointer",background:dragging?COLORS.accentSoft:COLORS.surfaceHigh,transition:"all 0.2s",marginBottom:12,opacity:disabled?0.5:1}}>
      <div style={{fontSize:24,marginBottom:6}}>📄</div>
      <div style={{fontSize:13.5,color:fileName?COLORS.green:COLORS.textSecondary,fontWeight:fileName?600:400}}>
        {fileName?`✓ ${fileName} uploaded`:label}
      </div>
      <div style={{fontSize:11,color:COLORS.textMuted,marginTop:3}}>Supports .txt files</div>
      <input ref={inputRef} type="file" accept=".txt,.pdf" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
    </div>
  );
}
 
// ── SCORE CIRCLE ──────────────────────────────────────────────────────────────
function ScoreCircle({score,label}){
  const r=34,cx=40,cy=40,circ=2*Math.PI*r,dash=(score/100)*circ;
  const color=score>=75?COLORS.green:score>=50?COLORS.amber:COLORS.red;
  return(
    <div style={{textAlign:"center"}}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.border} strokeWidth="5"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:"stroke-dasharray 1s ease"}}/>
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="16" fontWeight="700" fontFamily="DM Sans,sans-serif">{score}</text>
      </svg>
      <div style={{fontSize:11,color:COLORS.textSecondary,marginTop:-4}}>{label}</div>
    </div>
  );
}
 
// ── FUNNEL CHART ──────────────────────────────────────────────────────────────
function FunnelChart({jobs}){
  const stages=[
    {label:"Applied",key:"Applied",color:COLORS.accent},
    {label:"Shortlisted",key:"Shortlisted",color:COLORS.blue},
    {label:"Interview",key:"Interview",color:COLORS.amber},
    {label:"Offer",key:"Offer",color:COLORS.green},
  ];
  const total=jobs.length||1;
  const counts=stages.map(s=>({...s,count:jobs.filter(j=>j.status===s.key||( s.key==="Applied"&&!["Shortlisted","Interview","Offer","Rejected"].includes(j.status))).length}));
  const maxCount=Math.max(...counts.map(c=>c.count),1);
 
  return(
    <div style={{padding:"8px 0"}}>
      <div style={{fontSize:13,fontWeight:600,color:COLORS.textSecondary,marginBottom:16,textTransform:"uppercase",letterSpacing:"0.06em"}}>Application Funnel</div>
      {counts.map((s,i)=>{
        const pct=Math.round((s.count/total)*100);
        const width=Math.max(20,Math.round((s.count/maxCount)*100));
        return(
          <div key={s.key} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,color:COLORS.textSecondary}}>{s.label}</span>
              <span style={{fontSize:13,fontWeight:600,color:s.color}}>{s.count} <span style={{fontSize:11,color:COLORS.textMuted}}>({pct}%)</span></span>
            </div>
            <div style={{height:28,background:COLORS.surfaceHigh,borderRadius:6,overflow:"hidden",position:"relative"}}>
              <div style={{height:"100%",width:`${width}%`,background:s.color+"33",borderRadius:6,border:`1px solid ${s.color}44`,transition:"width 0.8s ease",display:"flex",alignItems:"center",paddingLeft:10}}>
                <span style={{fontSize:11,color:s.color,fontWeight:600}}>{s.count>0?s.count:""}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{marginTop:12,padding:"10px 14px",background:COLORS.surfaceHigh,borderRadius:8}}>
        <div style={{fontSize:12,color:COLORS.textSecondary}}>
          Rejection rate: <strong style={{color:jobs.filter(j=>j.status==="Rejected").length>jobs.length*0.7?COLORS.red:COLORS.textPrimary}}>
            {total>1?Math.round((jobs.filter(j=>j.status==="Rejected").length/total)*100):0}%
          </strong>
          <span style={{marginLeft:16}}>Success rate: <strong style={{color:COLORS.green}}>{total>1?Math.round((jobs.filter(j=>j.status==="Offer").length/total)*100):0}%</strong></span>
        </div>
      </div>
    </div>
  );
}
 
// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_SCAN={
  overallScore:72,atsScore:68,keywordScore:75,formatScore:80,
  matched:["React","JavaScript","Node.js","API","PostgreSQL"],
  missing:["TypeScript","GraphQL","AWS","CI/CD","Agile"],
  improvements:["Add measurable impact — 'reduced load time by 35%' beats 'improved performance'.","Include TypeScript prominently — it appears 4 times in the JD but missing from your skills.","Add a 2-line summary at the top so ATS parsers can categorise your profile immediately."],
  summary:"Strong technical background with solid React and Node experience. Missing several keywords the ATS will screen for — adding TypeScript and AWS could lift your score above 85.",
};
 
const SALARY_DATA={
  "3":{ title:"3–5 LPA", missing:["Basic DSA","SQL fundamentals","One framework (React/Vue)","Git basics"], add:["Complete a frontend project with GitHub link","Get AWS Cloud Practitioner cert (free tier)","Contribute to 1 open source repo"], companies:["TCS","Infosys","Wipro","Capgemini","HCL"], timeline:"2–3 months of upskilling" },
  "10":{ title:"8–12 LPA", missing:["TypeScript","System design basics","REST API design","Testing (Jest/Cypress)","CI/CD basics"], add:["Build 2–3 production-quality projects","Write technical blogs on Medium/Dev.to","Get React certification","Learn Docker basics"], companies:["Razorpay","Zepto","Groww","CRED","PhonePe"], timeline:"4–6 months of focused upskilling" },
  "25":{ title:"20–30 LPA", missing:["System design (HLD/LLD)","Leadership experience","TypeScript advanced","Performance optimization","Microservices"], add:["Lead a project end-to-end","Speak at a tech meetup or write a viral blog","Contribute to major open source (React, Next.js)","Get AWS Solutions Architect cert"], companies:["Google","Microsoft","Amazon","Flipkart","Swiggy"], timeline:"1–2 years of strategic career moves" },
  "50":{ title:"40–60 LPA", missing:["Staff/Principal engineer skills","Deep system design","Cross-team leadership","Patents or publications","OSS maintainer experience"], add:["Become a tech lead or architect","Build a product with 10k+ users","Speak at major conferences (ReactConf, JSConf)","Mentor 5+ junior engineers formally"], companies:["Google L5+","Meta E5+","Amazon L6+","Stripe","Airbnb"], timeline:"3–5 years of deliberate career building" },
};
 
const INTERVIEW_QUESTIONS={
  hr:{
    base:["Tell me about yourself and your career journey.","Where do you see yourself in 5 years?","Why are you looking to change your current role?","What is your expected CTC and notice period?","How do you handle work pressure and tight deadlines?"],
    resume:["I see you worked at {company} — what was your biggest achievement there?","Your resume shows a gap in {year} — can you explain that?","You've worked with {skill} — how have you used it practically?"],
  },
  recruiter:{
    base:["What specific role are you targeting and why?","What are your salary expectations?","Are you open to relocation?","How soon can you join?","What's your current CTC?"],
    resume:["Your profile shows {skill} experience — is that hands-on or theoretical?","How many years of {skill} experience do you have exactly?","You've been at {company} for {years} — why are you leaving?"],
  },
  technical:{
    base:["Explain the virtual DOM and how React reconciliation works.","What is the difference between useMemo and useCallback?","How would you optimize a slow React application?","Explain CORS and how you've handled it.","What is your approach to writing clean, maintainable code?"],
    resume:["Your resume mentions {skill} — can you write a quick implementation?","You built a dashboard for 50k users — how did you handle performance?","Walk me through the architecture of your most complex project."],
  },
  behavioural:{
    base:["Tell me about a time you disagreed with your manager and how you handled it.","Describe a situation where you had to learn something new under pressure.","Give an example of when you failed and what you learned.","Tell me about a time you went above and beyond for a project.","Describe how you handle conflict within a team."],
    resume:["At {company}, what was the most challenging problem you solved?","You mentioned leading a project — how did you manage the team?","Tell me about a time your code caused a production issue and how you fixed it."],
  },
};
 
const MOCK_JOBS=[
  { id:1, title:"Frontend Engineer", company:"Stripe", location:"Remote", salary:"$90k–$130k", match:92, tags:["React","TypeScript","Next.js"], url:"https://stripe.com/jobs", posted:"2 days ago", desc:"Build beautiful, performant UIs for Stripe's growth products." },
  { id:2, title:"React Developer", company:"Vercel", location:"Remote", salary:"$85k–$120k", match:88, tags:["React","Next.js","Performance"], url:"https://vercel.com/careers", posted:"1 day ago", desc:"Work on the platform that powers millions of Next.js deployments." },
  { id:3, title:"UI Engineer", company:"Linear", location:"Remote", salary:"$100k–$140k", match:84, tags:["React","TypeScript","Design Systems"], url:"https://linear.app/careers", posted:"3 days ago", desc:"Help build the best project management tool in the world." },
  { id:4, title:"Frontend Developer", company:"Razorpay", location:"Bangalore", salary:"₹18–28 LPA", match:81, tags:["React","JavaScript","Fintech"], url:"https://razorpay.com/jobs", posted:"Today", desc:"Build payment experiences used by millions of Indian businesses." },
  { id:5, title:"SDE-2 Frontend", company:"Groww", location:"Bangalore", salary:"₹20–32 LPA", match:78, tags:["React","Redux","TypeScript"], url:"https://groww.in/careers", posted:"4 days ago", desc:"Work on India's fastest growing investment platform." },
  { id:6, title:"React Native Developer", company:"PhonePe", location:"Bangalore/Remote", salary:"₹15–25 LPA", match:74, tags:["React Native","JavaScript","Mobile"], url:"https://phonepe.com/careers", posted:"2 days ago", desc:"Build the mobile app used by 500M+ Indians for payments." },
  { id:7, title:"Full Stack Engineer", company:"Postman", location:"Bangalore/Remote", salary:"₹22–35 LPA", match:71, tags:["React","Node.js","APIs"], url:"https://postman.com/careers", posted:"5 days ago", desc:"Build tools that help millions of developers work with APIs." },
  { id:8, title:"Software Engineer", company:"Atlassian", location:"Remote", salary:"$95k–$135k", match:68, tags:["React","TypeScript","Jira"], url:"https://atlassian.com/company/careers", posted:"1 week ago", desc:"Build collaboration tools used by 300,000+ companies worldwide." },
];
 
const COVER_TEMPLATES={
  professional:`I am writing to express my interest in the Senior Frontend Engineer role. With over four years of experience building high-performance React applications — including dashboards serving 50,000+ daily users — I am confident I can contribute meaningfully from day one.\n\nAt TechCorp, I reduced API latency by 40% through strategic Redis caching and led a full migration to hook-based React patterns, cutting bundle size by 22%. I have a strong eye for performance bottlenecks and a habit of instrumenting everything before optimising.\n\nI would welcome the chance to bring my frontend expertise to your team.`,
  confident:`I want to build the interfaces that sit on top of your product — and as a Senior Frontend Engineer with four years of React experience, I am ready to hit the ground running.\n\nI have built dashboards used by 50,000+ users, cut API latency by 40%, and led architecture decisions that shaved 22% off our bundle size. I move fast, write clean code, and obsess over the details.\n\nLet's talk.`,
  enthusiastic:`I have been following your engineering blog for years, so seeing this role open was genuinely exciting. You are one of the few companies where the frontend work is as technically interesting as the backend.\n\nMy background in React, performance optimisation, and large-scale dashboard development maps closely to what you are looking for. I would be thrilled to bring that enthusiasm to your team.`,
  conversational:`Hey — I came across this role and it is pretty much exactly what I have been looking for. I have spent the last few years building React apps at scale and want to work on a product that really matters.\n\nAt my current job I built dashboards with 50k+ users and dropped API latency by 40%. Would love to have a conversation if you think there is a fit.`,
};
 
const STATUS_OPTIONS=["Applied","Shortlisted","Interview","Offer","Rejected"];
const INITIAL_JOBS_TRACKER=[
  {id:1,title:"Frontend Engineer",company:"Stripe",date:"2026-05-28",status:"Interview",notes:"Had phone screen, waiting for technical round",selected:false},
  {id:2,title:"React Developer",company:"Linear",date:"2026-05-25",status:"Applied",notes:"Applied via LinkedIn",selected:false},
  {id:3,title:"UI Engineer",company:"Vercel",date:"2026-05-20",status:"Shortlisted",notes:"HR reached out",selected:false},
  {id:4,title:"SWE",company:"Meta",date:"2026-05-15",status:"Rejected",notes:"Rejected after OA",selected:false},
];
 
// ── RESUME SCANNER ────────────────────────────────────────────────────────────
function ResumeScanner({isPro,onUpgrade}){
  const [resume,setResume]=useState("");
  const [jd,setJd]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const {check,consume,getRemaining}=useUsage(isPro);
 
  const analyze=async()=>{
    if(!check("scans")){ onUpgrade("You've used all 3 free scans today."); return; }
    setLoading(true); setResult(null);
    consume("scans");
    await sleep(2200);
    setResult(MOCK_SCAN);
    setLoading(false);
  };
 
  const onFile=(text)=>{ if(!check("uploads")){ onUpgrade("Monthly upload limit reached."); return; } consume("uploads"); setResume(text); };
 
  return(
    <div>
      <LimitBanner type="scans" remaining={getRemaining("scans")} onUpgrade={()=>onUpgrade()}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={S.card}>
          <div style={S.cardTitle}>Your Resume</div>
          <FileDropZone onFileRead={onFile} label="Drop resume file or click to upload" disabled={!isPro&&!check("uploads")}/>
          <textarea style={{...S.input,minHeight:180,fontSize:12.5}} value={resume} onChange={e=>setResume(e.target.value)} placeholder="Or paste your resume text here..."/>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Job Description</div>
          <textarea style={{...S.input,minHeight:280,fontSize:12.5}} value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste the job description here..."/>
        </div>
      </div>
      <button style={S.btn("primary")} onClick={analyze} disabled={loading}>{loading?"Analyzing…":"⚡ Scan Resume"}</button>
      {loading&&<div style={{textAlign:"center",padding:"32px 0",color:COLORS.textSecondary}}><LoadingDots/><div style={{marginTop:12,fontSize:13}}>Scanning against ATS filters…</div></div>}
      {result&&!loading&&(
        <div style={{...S.card,marginTop:16}}>
          <div style={{display:"flex",gap:28,alignItems:"flex-start",marginBottom:20}}>
            <ScoreCircle score={result.overallScore} label="Overall"/>
            <ScoreCircle score={result.atsScore} label="ATS"/>
            <ScoreCircle score={result.keywordScore} label="Keywords"/>
            <ScoreCircle score={result.formatScore} label="Format"/>
            <div style={{flex:1,fontSize:13.5,color:COLORS.textSecondary,lineHeight:1.7}}>{result.summary}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:COLORS.green,marginBottom:8}}>✓ MATCHED</div>
              {result.matched.map(k=><span key={k} style={{...S.badge("green"),marginRight:6,marginBottom:6,display:"inline-block"}}>{k}</span>)}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:COLORS.red,marginBottom:8}}>✕ MISSING</div>
              {result.missing.map(k=><span key={k} style={{...S.badge("red"),marginRight:6,marginBottom:6,display:"inline-block"}}>{k}</span>)}
            </div>
          </div>
          <div style={{marginTop:16}}>
            <div style={{fontSize:12,fontWeight:600,color:COLORS.amber,marginBottom:8}}>⚠ IMPROVEMENTS</div>
            {result.improvements.map((imp,i)=><div key={i} style={{fontSize:13,color:COLORS.textSecondary,padding:"6px 0",borderBottom:`1px solid ${COLORS.border}`}}>{i+1}. {imp}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
 
// ── SALARY GAP ANALYZER ───────────────────────────────────────────────────────
function SalaryAnalyzer({isPro,onUpgrade}){
  const [resume,setResume]=useState("");
  const [target,setTarget]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const {check,consume,getRemaining}=useUsage(isPro);
 
  const TARGETS=[
    {label:"3–5 LPA",val:"3"},{label:"8–12 LPA",val:"10"},
    {label:"20–30 LPA",val:"25"},{label:"40–60 LPA",val:"50"},
  ];
 
  const analyze=async()=>{
    if(!target){ alert("Please select a target salary first."); return; }
    if(!check("salary")){ onUpgrade("You've used all free salary analyses today."); return; }
    setLoading(true); setResult(null);
    consume("salary");
    await sleep(2000);
    setResult(SALARY_DATA[target]);
    setLoading(false);
  };
 
  const onFile=(text)=>{ if(!check("uploads")){ onUpgrade("Monthly upload limit reached."); return; } consume("uploads"); setResume(text); };
 
  return(
    <div>
      <LimitBanner type="salary" remaining={getRemaining("salary")} onUpgrade={()=>onUpgrade()}/>
      <div style={S.card}>
        <div style={S.cardTitle}>What salary are you targeting?</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {TARGETS.map(t=>(
            <button key={t.val} style={{...S.btn(target===t.val?"primary":"ghost"),padding:"8px 18px"}} onClick={()=>setTarget(t.val)}>{t.label}</button>
          ))}
        </div>
        <FileDropZone onFileRead={onFile} label="Drop your resume to get personalized gap analysis"/>
        <textarea style={{...S.input,minHeight:120,fontSize:12.5}} value={resume} onChange={e=>setResume(e.target.value)} placeholder="Or paste your resume here..."/>
        <button style={{...S.btn("primary"),marginTop:12}} onClick={analyze} disabled={loading||!target}>
          {loading?"Analyzing gap…":"💰 Analyze Salary Gap"}
        </button>
      </div>
 
      {loading&&<div style={{textAlign:"center",padding:"28px 0",color:COLORS.textSecondary}}><LoadingDots/><div style={{marginTop:10,fontSize:13}}>Analyzing what's needed for {TARGETS.find(t=>t.val===target)?.label}…</div></div>}
 
      {result&&!loading&&(
        <div>
          <div style={{...S.card,background:"linear-gradient(135deg,#6C63FF11,#22C55E11)",border:`1px solid ${COLORS.accent}33`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:18,fontWeight:700}}>Target: {result.title}</div>
              <span style={S.badge("amber")}>~{result.timeline}</span>
            </div>
            <div style={{fontSize:13.5,color:COLORS.textSecondary}}>Here's exactly what your resume is missing and what to add:</div>
          </div>
 
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={S.card}>
              <div style={{fontSize:13,fontWeight:600,color:COLORS.red,marginBottom:12}}>❌ What's Missing From Your Resume</div>
              {result.missing.map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                  <span style={{color:COLORS.red,fontSize:16,marginTop:1}}>✕</span>
                  <span style={{fontSize:13.5,color:COLORS.textSecondary}}>{m}</span>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={{fontSize:13,fontWeight:600,color:COLORS.green,marginBottom:12}}>✅ What To Add / Do Next</div>
              {result.add.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                  <span style={{color:COLORS.green,fontSize:16,marginTop:1}}>→</span>
                  <span style={{fontSize:13.5,color:COLORS.textSecondary}}>{a}</span>
                </div>
              ))}
            </div>
          </div>
 
          <div style={S.card}>
            <div style={{fontSize:13,fontWeight:600,color:COLORS.blue,marginBottom:12}}>🏢 Companies Hiring at This Range</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {result.companies.map(c=><span key={c} style={{...S.badge("blue"),fontSize:13,padding:"5px 14px"}}>{c}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ── JOB BROWSER ───────────────────────────────────────────────────────────────
function JobBrowser({isPro,onUpgrade}){
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(false);
  const [jobs,setJobs]=useState(MOCK_JOBS);
  const {check,consume,getRemaining}=useUsage(isPro);
 
  const filtered=jobs.filter(j=>{
    const matchSearch=j.title.toLowerCase().includes(search.toLowerCase())||j.company.toLowerCase().includes(search.toLowerCase())||j.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()));
    if(filter==="remote") return matchSearch&&j.location.toLowerCase().includes("remote");
    if(filter==="india") return matchSearch&&(j.salary.includes("LPA")||j.location.includes("Bangalore")||j.location.includes("India"));
    return matchSearch;
  });
 
  const refresh=async()=>{
    if(!check("roles")){ onUpgrade("You've used all free role searches today."); return; }
    setLoading(true);
    consume("roles");
    await sleep(1500);
    setJobs([...MOCK_JOBS].sort(()=>Math.random()-0.5));
    setLoading(false);
  };
 
  return(
    <div>
      <LimitBanner type="roles" remaining={getRemaining("roles")} onUpgrade={()=>onUpgrade()}/>
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
        <input style={{...S.input,flex:1,resize:"none",minHeight:"unset",padding:"10px 14px"}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by role, company, or skill..."/>
        {["all","remote","india"].map(f=>(
          <button key={f} style={S.btn(filter===f?"primary":"ghost",true)} onClick={()=>setFilter(f)}>{f==="all"?"All":f==="remote"?"🌍 Remote":"🇮🇳 India"}</button>
        ))}
        <button style={S.btn("ghost",true)} onClick={refresh} disabled={loading}>{loading?"...":"↻ Refresh"}</button>
      </div>
 
      <div style={{fontSize:13,color:COLORS.textSecondary,marginBottom:14}}>{filtered.length} jobs found · Sorted by match %</div>
 
      {loading&&<div style={{textAlign:"center",padding:"28px 0",color:COLORS.textSecondary}}><LoadingDots/></div>}
 
      {!loading&&filtered.map(job=>(
        <div key={job.id} style={{...S.card,padding:"18px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:3}}>{job.title}</div>
              <div style={{fontSize:13.5,color:COLORS.textSecondary,marginBottom:6}}>{job.company} · {job.location} · {job.posted}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {job.tags.map(t=><span key={t} style={{...S.badge(""),fontSize:11}}>{t}</span>)}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
              <div style={{fontSize:20,fontWeight:700,color:job.match>=85?COLORS.green:job.match>=75?COLORS.amber:COLORS.textSecondary}}>{job.match}% match</div>
              <div style={{fontSize:13,color:COLORS.accent,fontWeight:600,marginTop:2}}>{job.salary}</div>
            </div>
          </div>
          <div style={{fontSize:13,color:COLORS.textSecondary,lineHeight:1.6,marginBottom:12}}>{job.desc}</div>
          <div style={{...S.scoreBar,marginBottom:12}}>
            <div style={S.scoreFill(job.match,job.match>=85?COLORS.green:job.match>=75?COLORS.amber:COLORS.accent)}/>
          </div>
          <a href={job.url} target="_blank" rel="noreferrer" style={{...S.btn("primary",true),display:"inline-block",textDecoration:"none",textAlign:"center"}}>
            Apply Now ↗
          </a>
        </div>
      ))}
    </div>
  );
}
 
// ── COVER LETTER ──────────────────────────────────────────────────────────────
function CoverLetter({isPro,onUpgrade}){
  const [tone,setTone]=useState("professional");
  const [letter,setLetter]=useState("");
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const {check,consume,getRemaining}=useUsage(isPro);
 
  const generate=async()=>{
    if(!check("covers")){ onUpgrade("You've used all 5 free cover letters today."); return; }
    setLoading(true); setLetter(""); consume("covers");
    await sleep(1800);
    setLetter(COVER_TEMPLATES[tone]);
    setLoading(false);
  };
 
  const copy=()=>{ navigator.clipboard.writeText(letter); setCopied(true); setTimeout(()=>setCopied(false),2000); };
 
  return(
    <div>
      <LimitBanner type="covers" remaining={getRemaining("covers")} onUpgrade={()=>onUpgrade()}/>
      <div style={S.card}>
        <div style={S.cardTitle}>Select tone</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["professional","confident","enthusiastic","conversational"].map(t=>(
            <button key={t} style={S.btn(tone===t?"primary":"ghost",true)} onClick={()=>setTone(t)}>{t}</button>
          ))}
        </div>
        <button style={{...S.btn("primary"),marginTop:14}} onClick={generate} disabled={loading}>{loading?"Writing…":"✍ Generate Cover Letter"}</button>
      </div>
      {loading&&<div style={{textAlign:"center",padding:"28px 0",color:COLORS.textSecondary,fontSize:13}}><LoadingDots/><div style={{marginTop:10}}>Crafting your cover letter…</div></div>}
      {letter&&!loading&&(
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={S.cardTitle}>Generated Cover Letter</div>
            <button style={S.btn("ghost",true)} onClick={copy}>{copied?"✓ Copied!":"Copy"}</button>
          </div>
          <div style={{fontSize:13.5,lineHeight:1.85,color:COLORS.textPrimary,whiteSpace:"pre-wrap"}}>{letter}</div>
        </div>
      )}
    </div>
  );
}
 
// ── JOB TRACKER ───────────────────────────────────────────────────────────────
function JobTracker(){
  const [jobs,setJobs]=useState(INITIAL_JOBS_TRACKER);
  const [adding,setAdding]=useState(false);
  const [view,setView]=useState("table");
  const [form,setForm]=useState({title:"",company:"",date:new Date().toISOString().split("T")[0],status:"Applied",notes:""});
  const [selectAll,setSelectAll]=useState(false);
 
  const total=jobs.length,interviews=jobs.filter(j=>j.status==="Interview"||j.status==="Offer").length,offers=jobs.filter(j=>j.status==="Offer").length;
  const responseRate=total>0?Math.round((jobs.filter(j=>j.status!=="Applied").length/total)*100):0;
 
  const addJob=()=>{ if(!form.title||!form.company)return; setJobs(p=>[{...form,id:Date.now(),selected:false},...p]); setForm({title:"",company:"",date:new Date().toISOString().split("T")[0],status:"Applied",notes:""}); setAdding(false); };
  const updateJob=(id,f,v)=>setJobs(p=>p.map(j=>j.id===id?{...j,[f]:v}:j));
  const deleteJob=(id)=>setJobs(p=>p.filter(j=>j.id!==id));
  const deleteSelected=()=>{ setJobs(p=>p.filter(j=>!j.selected)); setSelectAll(false); };
  const toggleSelect=(id)=>setJobs(p=>p.map(j=>j.id===id?{...j,selected:!j.selected}:j));
  const toggleAll=()=>{ const next=!selectAll; setSelectAll(next); setJobs(p=>p.map(j=>({...j,selected:next}))); };
  const selectedCount=jobs.filter(j=>j.selected).length;
 
  return(
    <div>
      <div style={S.statGrid()}>
        <div style={S.statCard}><div style={S.statVal}>{total}</div><div style={S.statLabel}>Total applications</div></div>
        <div style={S.statCard}><div style={{...S.statVal,color:COLORS.amber}}>{interviews}</div><div style={S.statLabel}>Interviews</div></div>
        <div style={S.statCard}><div style={{...S.statVal,color:COLORS.green}}>{offers}</div><div style={S.statLabel}>Offers</div></div>
        <div style={S.statCard}><div style={{...S.statVal,color:COLORS.textSecondary}}>{responseRate}%</div><div style={S.statLabel}>Response rate</div></div>
      </div>
 
      <div style={S.card}><FunnelChart jobs={jobs}/></div>
 
      <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",gap:8}}>
          <button style={S.btn(view==="table"?"primary":"ghost",true)} onClick={()=>setView("table")}>📋 Table</button>
          {selectedCount>0&&<button style={S.btn("danger",true)} onClick={deleteSelected}>🗑 Delete {selectedCount}</button>}
        </div>
        <button style={S.btn("primary",true)} onClick={()=>setAdding(!adding)}>+ Add Application</button>
      </div>
 
      {adding&&(
        <div style={{...S.card,display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap",marginBottom:14}}>
          {[["Job title","title","e.g. Frontend Engineer"],["Company","company","e.g. Google"]].map(([lbl,key,ph])=>(
            <div key={key} style={{flex:1,minWidth:130}}>
              <div style={{fontSize:12,color:COLORS.textSecondary,marginBottom:5}}>{lbl}</div>
              <input style={{...S.input,resize:"none"}} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph}/>
            </div>
          ))}
          <div style={{minWidth:140}}>
            <div style={{fontSize:12,color:COLORS.textSecondary,marginBottom:5}}>Date applied</div>
            <input type="date" style={{...S.input,resize:"none"}} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
          </div>
          <div style={{minWidth:130}}>
            <div style={{fontSize:12,color:COLORS.textSecondary,marginBottom:5}}>Status</div>
            <select style={{...S.input,padding:"10px 12px",resize:"none"}} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{flex:2,minWidth:160}}>
            <div style={{fontSize:12,color:COLORS.textSecondary,marginBottom:5}}>Notes</div>
            <input style={{...S.input,resize:"none"}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any notes..."/>
          </div>
          <button style={S.btn("primary",true)} onClick={addJob}>Add</button>
          <button style={S.btn("ghost",true)} onClick={()=>setAdding(false)}>Cancel</button>
        </div>
      )}
 
      <div style={{...S.card,padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={{...S.th,width:40}}><input type="checkbox" checked={selectAll} onChange={toggleAll} style={{cursor:"pointer"}}/></th>
              <th style={S.th}>Company</th>
              <th style={S.th}>Role</th>
              <th style={S.th}>Date</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Notes</th>
              <th style={{...S.th,width:50}}>Del</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length===0&&<tr><td colSpan={7} style={{...S.td,textAlign:"center",padding:"32px",color:COLORS.textMuted}}>No applications yet.</td></tr>}
            {jobs.map(job=>(
              <tr key={job.id} style={{background:job.selected?COLORS.accentSoft:"transparent",transition:"background 0.15s"}}>
                <td style={S.td}><input type="checkbox" checked={job.selected} onChange={()=>toggleSelect(job.id)} style={{cursor:"pointer"}}/></td>
                <td style={{...S.td,fontWeight:600}}>{job.company}</td>
                <td style={S.td}>{job.title}</td>
                <td style={{...S.td,color:COLORS.textSecondary,fontSize:12}}>{job.date}</td>
                <td style={S.td}>
                  <select value={job.status} onChange={e=>updateJob(job.id,"status",e.target.value)} style={{background:COLORS.surfaceHigh,border:`1px solid ${COLORS.border}`,borderRadius:6,padding:"4px 8px",color:COLORS.textPrimary,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                    {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={S.td}><input style={{...S.input,minHeight:"unset",padding:"5px 10px",fontSize:12,resize:"none"}} value={job.notes} onChange={e=>updateJob(job.id,"notes",e.target.value)} placeholder="Add notes..."/></td>
                <td style={S.td}><button onClick={()=>deleteJob(job.id)} style={{background:"transparent",border:"none",color:COLORS.red,cursor:"pointer",fontSize:16,padding:"2px 6px"}}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
// ── INTERVIEW PREP 2.0 ────────────────────────────────────────────────────────
function InterviewPrep({isPro,onUpgrade}){
  const [resume,setResume]=useState("");
  const [interviewType,setInterviewType]=useState("");
  const [questions,setQuestions]=useState([]);
  const [answers,setAnswers]=useState({});
  const [feedback,setFeedback]=useState({});
  const [loadingQ,setLoadingQ]=useState(false);
  const [loadingFb,setLoadingFb]=useState({});
  const [currentQ,setCurrentQ]=useState(0);
  const {check,consume,getRemaining}=useUsage(isPro);
 
  const TYPES=[
    {key:"hr",label:"HR Round",icon:"👔",desc:"Culture, salary, notice period"},
    {key:"recruiter",label:"Recruiter Screen",icon:"📞",desc:"Initial fit & availability check"},
    {key:"technical",label:"Technical Round",icon:"💻",desc:"Coding, architecture, problem solving"},
    {key:"behavioural",label:"Behavioural",icon:"🧠",desc:"Situational & cultural fit questions"},
  ];
 
  const onFile=(text)=>setResume(text);
 
  const generateQuestions=async()=>{
    if(!interviewType){ alert("Please select an interview type first."); return; }
    if(!check("interviews")){ onUpgrade("You've used all free interview sessions today."); return; }
    setLoadingQ(true); setQuestions([]); setAnswers({}); setFeedback({}); setCurrentQ(0);
    consume("interviews");
    await sleep(1800);
 
    const pool=INTERVIEW_QUESTIONS[interviewType];
    const hasResume=resume.length>50;
    let qs=[...pool.base];
    if(hasResume){
      const resumeQs=pool.resume.map(q=>
        q.replace("{company}","TechCorp").replace("{skill}","React").replace("{year}","2022").replace("{years}","2")
      );
      qs=[...qs,...resumeQs.slice(0,2)];
    }
    setQuestions(qs.slice(0,hasResume?7:5));
    setLoadingQ(false);
  };
 
  const getFeedback=async(idx)=>{
    if(!answers[idx]?.trim())return;
    setLoadingFb(p=>({...p,[idx]:true}));
    await sleep(1400);
    const fbPool=[
      "Good structure — the STAR format comes through well. Try quantifying the outcome more specifically. Lead with the impact, then explain what you did.",
      "Strong and self-aware. Make the improvement more concrete — name one specific thing you changed. Interviewers remember specifics, not generalities.",
      "Honest and direct, which interviewers respect. Push further on the outcome — end on what you learned, not just what happened.",
      "Great philosophical answer. Ground it in a real example — show you have a framework, not just an instinct.",
      "Clear and concise. Add more context about your decision-making process — interviewers want to see how you think, not just what you did.",
      "Good energy. Back it up with a specific number or result to make it memorable.",
      "Solid foundation. Consider adding what you would do differently now — shows growth mindset.",
    ];
    setFeedback(p=>({...p,[idx]:fbPool[idx%fbPool.length]}));
    setLoadingFb(p=>({...p,[idx]:false}));
  };
 
  return(
    <div>
      <LimitBanner type="interviews" remaining={getRemaining("interviews")} onUpgrade={()=>onUpgrade()}/>
 
      <div style={S.card}>
        <div style={S.cardTitle}>Step 1 — Upload your resume (optional but recommended)</div>
        <FileDropZone onFileRead={onFile} label="Drop resume for personalized questions based on your experience"/>
        {resume&&<div style={{fontSize:12,color:COLORS.green,marginTop:-6,marginBottom:8}}>✓ Resume loaded — questions will be tailored to your background</div>}
      </div>
 
      <div style={S.card}>
        <div style={S.cardTitle}>Step 2 — What type of interview are you preparing for?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {TYPES.map(t=>(
            <div key={t.key} onClick={()=>setInterviewType(t.key)} style={{border:`1px solid ${interviewType===t.key?COLORS.accent:COLORS.border}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",background:interviewType===t.key?COLORS.accentSoft:COLORS.surfaceHigh,transition:"all 0.15s"}}>
              <div style={{fontSize:22,marginBottom:6}}>{t.icon}</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{t.label}</div>
              <div style={{fontSize:12,color:COLORS.textSecondary}}>{t.desc}</div>
            </div>
          ))}
        </div>
        <button style={{...S.btn("primary"),marginTop:16,width:"100%"}} onClick={generateQuestions} disabled={loadingQ||!interviewType}>
          {loadingQ?"Generating questions…":`🎯 Start ${interviewType?TYPES.find(t=>t.key===interviewType)?.label:"Interview"} Prep`}
        </button>
      </div>
 
      {loadingQ&&<div style={{textAlign:"center",padding:"28px 0",color:COLORS.textSecondary}}><LoadingDots/><div style={{marginTop:10,fontSize:13}}>Preparing {resume?"personalized":"role-based"} questions…</div></div>}
 
      {questions.length>0&&!loadingQ&&(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {questions.map((_,i)=>(
              <button key={i} onClick={()=>setCurrentQ(i)} style={{...S.btn(currentQ===i?"primary":"ghost",true),minWidth:36}}>
                {feedback[i]?"✓":i+1}
              </button>
            ))}
          </div>
 
          <div style={{...S.card,background:COLORS.surfaceHigh}}>
            <div style={{fontSize:12,color:COLORS.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Question {currentQ+1} of {questions.length} · {TYPES.find(t=>t.key===interviewType)?.label}</div>
            <div style={{fontSize:16,fontWeight:600,color:COLORS.textPrimary,marginBottom:14,lineHeight:1.5}}>{questions[currentQ]}</div>
            <textarea style={{...S.input,minHeight:100,fontSize:13}} placeholder="Type your answer here… take your time, just like a real interview." value={answers[currentQ]||""} onChange={e=>setAnswers(p=>({...p,[currentQ]:e.target.value}))}/>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button style={S.btn("ghost",true)} onClick={()=>getFeedback(currentQ)} disabled={loadingFb[currentQ]||!answers[currentQ]?.trim()}>
                {loadingFb[currentQ]?"Getting feedback…":"Get AI Feedback"}
              </button>
              {currentQ<questions.length-1&&<button style={S.btn("primary",true)} onClick={()=>setCurrentQ(c=>c+1)}>Next Question →</button>}
            </div>
            {feedback[currentQ]&&(
              <div style={S.feedbackBox}>
                <strong style={{color:COLORS.accent,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Feedback</strong>
                <div style={{marginTop:6}}>{feedback[currentQ]}</div>
              </div>
            )}
          </div>
 
          {Object.keys(feedback).length===questions.length&&(
            <div style={{...S.card,background:"#22C55E11",border:"1px solid #22C55E33",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:8}}>🎉</div>
              <div style={{fontSize:16,fontWeight:700,color:COLORS.green,marginBottom:4}}>Interview complete!</div>
              <div style={{fontSize:13.5,color:COLORS.textSecondary}}>You answered all {questions.length} questions. Review the feedback above and practice again to improve.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 
// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({setPage,isPro,onUpgrade}){
  const {getRemaining}=useUsage(isPro);
  const features=[
    {icon:"⚡",title:"Resume Scanner",desc:"ATS score + keyword gap analysis",page:"resume",color:COLORS.accent,limit:`${getRemaining("scans")} scans left today`},
    {icon:"💰",title:"Salary Gap Analyzer",desc:"What you need to hit your target CTC",page:"salary",color:COLORS.green,limit:`${getRemaining("salary")} analyses left today`},
    {icon:"🌐",title:"Job Browser",desc:"Browse & apply to matched jobs directly",page:"jobs",color:COLORS.blue,limit:`${getRemaining("roles")} searches left today`},
    {icon:"✍",title:"Cover Letter",desc:"Tailored cover letters in 4 tones",page:"cover",color:"#22C55E",limit:`${getRemaining("covers")} left today`},
    {icon:"📋",title:"Job Tracker",desc:"Excel-style tracker with funnel analytics",page:"tracker",color:COLORS.amber,limit:"Unlimited"},
    {icon:"🎯",title:"Interview Prep",desc:"HR / Technical / Behavioural mock rounds",page:"interview",color:COLORS.red,limit:`${getRemaining("interviews")} sessions left today`},
  ];
 
  return(
    <div>
      {!isPro&&(
        <div style={{...S.card,background:"linear-gradient(135deg,#6C63FF11,#F59E0B11)",border:`1px solid ${COLORS.accent}33`,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>⚡ You're on the Free Plan</div>
              <div style={{fontSize:13,color:COLORS.textSecondary}}>3 scans/day · 90 uploads/month · Limited features</div>
            </div>
            <button style={S.btn("pro")} onClick={()=>onUpgrade()}>Upgrade to Pro — $5/mo</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        {features.map(({icon,title,desc,page,color,limit})=>(
          <div key={page} style={{...S.card,cursor:"pointer",transition:"border-color 0.2s"}} onClick={()=>setPage(page)} onMouseEnter={e=>e.currentTarget.style.borderColor=color} onMouseLeave={e=>e.currentTarget.style.borderColor=COLORS.border}>
            <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
            <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>{title}</div>
            <div style={{fontSize:13,color:COLORS.textSecondary,marginBottom:8}}>{desc}</div>
            <div style={{fontSize:11,color:limit==="Unlimited"?COLORS.green:COLORS.textMuted}}>{limit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [isPro,setIsPro]=useState(false);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const [upgradeReason,setUpgradeReason]=useState("");
 
  const onUpgrade=(reason="")=>{ setUpgradeReason(reason); setShowUpgrade(true); };
 
  const nav=[
    {section:"Analyze"},
    {key:"resume",label:"Resume Scanner",icon:"⚡"},
    {key:"salary",label:"Salary Analyzer",icon:"💰"},
    {section:"Apply"},
    {key:"jobs",label:"Job Browser",icon:"🌐"},
    {key:"cover",label:"Cover Letter",icon:"✍"},
    {section:"Manage"},
    {key:"tracker",label:"Job Tracker",icon:"📋"},
    {key:"interview",label:"Interview Prep",icon:"🎯"},
  ];
 
  const titles={
    home:{title:"Dashboard",sub:"Your complete job search operating system"},
    resume:{title:"Resume Scanner",sub:"ATS score + keyword gap analysis"},
    salary:{title:"Salary Gap Analyzer",sub:"Exactly what you need to hit your target CTC"},
    jobs:{title:"Job Browser",sub:"Browse matched jobs and apply directly"},
    cover:{title:"Cover Letter",sub:"Tailored to every job, generated instantly"},
    tracker:{title:"Job Tracker",sub:"Track every application with funnel analytics"},
    interview:{title:"Interview Prep 2.0",sub:"Mock rounds by interview type — HR, Technical, Behavioural"},
  };
 
  const sharedProps={isPro,onUpgrade};
 
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${COLORS.bg};}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:0.5;}50%{transform:translateY(-5px);opacity:1;}}
        textarea:focus,input[type="text"]:focus,input[type="email"]:focus,input[type="date"]:focus,select:focus{border-color:${COLORS.accent}!important;outline:none;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:${COLORS.bg};}
        ::-webkit-scrollbar-thumb{background:${COLORS.border};border-radius:3px;}
        select option{background:${COLORS.surfaceHigh};}
        tr:hover td{background:${COLORS.surfaceHigh};}
        a{text-decoration:none;}
      `}</style>
 
      {showUpgrade&&<UpgradeModal onClose={()=>setShowUpgrade(false)} reason={upgradeReason}/>}
 
      <div style={S.app}>
        <div style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoText}><span style={S.logoDot}/>CareerCompass</div>
            <div style={{fontSize:11,color:COLORS.textMuted,marginTop:4}}>AI Job Search OS</div>
          </div>
 
          <div style={{...S.navItem(page==="home"),marginBottom:4}} onClick={()=>setPage("home")}>
            <span>🏠</span>Dashboard
          </div>
 
          {nav.map((item,i)=>
            item.section
              ? <div key={i} style={S.navSection}>{item.section}</div>
              : <div key={item.key} style={S.navItem(page===item.key)} onClick={()=>setPage(item.key)}><span>{item.icon}</span>{item.label}</div>
          )}
 
          <div style={{marginTop:"auto",padding:"16px 20px",borderTop:`1px solid ${COLORS.border}`}}>
            {isPro?(
              <div style={{textAlign:"center"}}>
                <div style={{...S.badge("green"),fontSize:12,padding:"4px 12px",marginBottom:8}}>⚡ Pro Plan Active</div>
                <div style={{fontSize:11,color:COLORS.textMuted}}>Unlimited everything</div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontSize:11,color:COLORS.textMuted}}>Free plan</div>
                  <div style={{fontSize:11,color:COLORS.textMuted}}>3 scans/day</div>
                </div>
                <button style={{...S.btn("pro"),width:"100%",padding:"8px",fontSize:12}} onClick={()=>onUpgrade()}>Upgrade — $5/mo</button>
                <button style={{fontSize:10,color:COLORS.textMuted,background:"transparent",border:"none",cursor:"pointer",marginTop:6,width:"100%"}} onClick={()=>setIsPro(true)}>Try Pro (demo)</button>
              </div>
            )}
          </div>
        </div>
 
        <div style={S.main}>
          <div style={S.pageTitle}>{titles[page].title}</div>
          <div style={S.pageSub}>{titles[page].sub}</div>
          {page==="home"&&<Dashboard setPage={setPage} {...sharedProps}/>}
          {page==="resume"&&<ResumeScanner {...sharedProps}/>}
          {page==="salary"&&<SalaryAnalyzer {...sharedProps}/>}
          {page==="jobs"&&<JobBrowser {...sharedProps}/>}
          {page==="cover"&&<CoverLetter {...sharedProps}/>}
          {page==="tracker"&&<JobTracker/>}
          {page==="interview"&&<InterviewPrep {...sharedProps}/>}
        </div>
      </div>
    </>
  );
}
