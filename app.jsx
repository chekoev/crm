const { useState, useEffect, useCallback, useMemo } = React;

const PRODUCTS = [
  { id: "plat", name: "PLAT", price: 9900 },{ id: "silver", name: "Silver", price: 11500 },
  { id: "plat_mini", name: "Plat mini", price: 12500 },{ id: "silver_mini", name: "Silver mini", price: 13800 },
  { id: "flash", name: "Flash", price: 15900 },{ id: "flash_mini", name: "Flash mini", price: 18500 },
  { id: "flash_77", name: "Flash 77", price: 26000 },{ id: "nano_7", name: "Nano 7", price: 32000 },
  { id: "flash_2026", name: "Flash новинка 2026", price: 39700 },{ id: "flash_mag_2026", name: "Flash новинка Магнит 2026", price: 42500 },
  { id: "knopki_std", name: "Кнопки — Стандарт", price: 2500 },{ id: "knopki_yant", name: "Кнопки — ЯНТ", price: 3500 },
  { id: "knopki_mini", name: "Кнопки — Мини", price: 5000 },{ id: "iphone_app", name: "Установка на iPhone", price: 15000 },
];
const RENTAL_PRODUCTS = [
  { id: "r_plat", name: "Plat", price: 1900 },{ id: "r_silver", name: "Silver", price: 2200 },
  { id: "r_plat_mini", name: "Plat mini", price: 2200 },{ id: "r_silver_mini", name: "Silver mini", price: 2700 },
  { id: "r_flash", name: "Flash", price: 3900 },{ id: "r_flash_mini", name: "Flash mini", price: 4800 },
  { id: "r_flash_77", name: "Flash 77", price: 6500 },{ id: "r_nano_7", name: "Nano 7", price: 8000 },
  { id: "r_flash_2026", name: "Flash новинка 2026", price: 10000 },{ id: "r_flash_mag_2026", name: "Flash новинка Магнит 2026", price: 11000 },
  { id: "r_short_prov", name: "Короткая: Проводной магнит/капсула", price: 700 },{ id: "r_short_bt", name: "Короткая: Bluetooth", price: 1000 },
  { id: "r_short_prem", name: "Короткая: Premium", price: 1500 },
];

const YEAR_PLAN = 7000000;
const CUTOFF = "2026-03-14";
const PREV_YEARS = { 2025: 5776400, 2024: 4630750, 2023: 3730250 };
function isAppItem(it) { return it.id === "iphone_app" || (it.name && it.name.toLowerCase().indexOf("iphone") >= 0); }
function appProfit(it) { return Math.max(0, it.price - (it.cost || (it.price >= 15000 ? 10000 : 8000))); }
const MR = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const MS = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
const pad = n => String(n).padStart(2,"0");
const fmtD = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtM = n => n.toLocaleString("ru-RU")+" \u20BD";
const dim = (y,m) => new Date(y,m+1,0).getDate();

function formatPhone(raw) {
  let d = raw.replace(/\D/g,"");
  if (d.startsWith("8")&&d.length>1) d="7"+d.slice(1);
  if (d.startsWith("7")) d=d.slice(1);
  if (!d.length) return "+7";
  let o="+7("+d.slice(0,3);
  if (d.length>=3) o+=")";
  if (d.length>3) o+=d.slice(3,6);
  if (d.length>6) o+="-"+d.slice(6,8);
  if (d.length>8) o+="-"+d.slice(8,10);
  return o;
}
function PhoneInput({value,onChange,style:s}){
  return <input type="tel" value={value} onFocus={()=>{if(!value)onChange("+7")}} onChange={e=>onChange(formatPhone(e.target.value))} placeholder="+7(___)___-__-__" style={s}/>;
}

const SEED=[
  {date:"2026-01-07",items:[{name:"Продажа",price:4000}],amount:4000,phone:"",name:""},
  {date:"2026-01-09",items:[{name:"Продажа",price:1000}],amount:1000,phone:"",name:""},
  {date:"2026-01-16",items:[{name:"Продажа",price:5200}],amount:5200,phone:"",name:""},
  {date:"2026-01-18",items:[{name:"Продажа",price:3400}],amount:3400,phone:"",name:""},
  {date:"2026-01-19",items:[{name:"Продажа",price:700}],amount:700,phone:"",name:""},
  {date:"2026-01-20",items:[{name:"Продажа",price:1500}],amount:1500,phone:"",name:""},
  {date:"2026-01-24",items:[{name:"Продажа",price:15900}],amount:15900,phone:"",name:""},
  {date:"2026-01-25",items:[{name:"Продажа",price:1500}],amount:1500,phone:"",name:""},
  {date:"2026-01-26",items:[{name:"Продажа",price:400}],amount:400,phone:"",name:""},
  {date:"2026-01-28",items:[{name:"Продажа",price:1500}],amount:1500,phone:"",name:""},
  {date:"2026-01-29",items:[{name:"Продажа",price:8000}],amount:8000,phone:"",name:""},
  {date:"2026-02-02",items:[{name:"Продажа",price:1500}],amount:1500,phone:"",name:""},
  {date:"2026-02-03",items:[{name:"Продажа",price:400}],amount:400,phone:"",name:""},
  {date:"2026-02-07",items:[{name:"Продажа",price:26500}],amount:26500,phone:"",name:""},
  {date:"2026-02-12",items:[{name:"Продажа",price:1500}],amount:1500,phone:"",name:""},
  {date:"2026-02-17",items:[{name:"Продажа",price:4000}],amount:4000,phone:"",name:""},
  {date:"2026-02-19",items:[{name:"Продажа",price:32000}],amount:32000,phone:"",name:""},
  {date:"2026-02-22",items:[{name:"Продажа",price:62860}],amount:62860,phone:"",name:""},
  {date:"2026-02-23",items:[{name:"Продажа",price:32000}],amount:32000,phone:"",name:""},
  {date:"2026-02-26",items:[{name:"Продажа",price:48700}],amount:48700,phone:"",name:""},
  {date:"2026-02-27",items:[{name:"Продажа",price:1500}],amount:1500,phone:"",name:""},
  {date:"2026-03-04",items:[{name:"Продажа",price:25500}],amount:25500,phone:"",name:""},
  {date:"2026-03-11",items:[{name:"Продажа",price:5300}],amount:5300,phone:"",name:""},
];
const initStock = () => {
  const ss = {}; PRODUCTS.forEach(p => { ss[p.id] = 0; });
  const sr = {}; RENTAL_PRODUCTS.forEach(p => { sr[p.id] = 0; });
  return { sale: ss, rental: sr };
};
function restoreStockFromSale(data, saleIdx) {
  const sale = data.sales[saleIdx];
  if (!sale) return data.stock || initStock();
  const newStock = { ...(data.stock || initStock()) };
  const ss = { ...(newStock.sale || {}) };
  if (sale.items) sale.items.forEach(it => { if (it.id && ss[it.id] !== undefined) ss[it.id] = (ss[it.id] || 0) + 1; });
  newStock.sale = ss;
  return newStock;
}
const APP_PRICE = 15000;
const APP_COST = 10000;

const SEED_APP_BOOKINGS = [
  { date: "2025-11-02", phone: "+7(918)838-93-95", name: "", qty: 1, amount: 15000, cost: 10000, note: "", status: "pending" },
  { date: "2026-01-29", phone: "+7(928)685-17-03", name: "", qty: 2, amount: 30000, cost: 20000, note: "", status: "pending" },
  { date: "2026-02-07", phone: "+7(988)834-11-25", name: "", qty: 1, amount: 15000, cost: 10000, note: "", status: "pending" },
  { date: "2026-02-14", phone: "+7(918)828-25-58", name: "", qty: 1, amount: 15000, cost: 10000, note: "", status: "pending" },
  { date: "2026-02-22", phone: "+7(989)741-59-67", name: "", qty: 1, amount: 15000, cost: 10000, note: "", status: "pending" },
  { date: "2026-02-26", phone: "+7(918)831-98-65", name: "", qty: 1, amount: 15000, cost: 10000, note: "", status: "pending" },
];

const init = () => ({ sales: SEED, rentals: [], appBookings: SEED_APP_BOOKINGS, appointments: [], products: PRODUCTS, rentalProducts: RENTAL_PRODUCTS, stock: initStock() });

function checkCreds(u, p) {
  return u === "chiko" && p === "Alanchiko!!";
}

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (checkCreds(user, pass)) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',-apple-system,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 360, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #00ff87, #00b85e)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 22, color: "#000", marginBottom: 16 }}>M15</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>mikro_15 CRM</h1>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#555" }}>Вход в панель управления</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", marginBottom: 6, display: "block" }}>Логин</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Введите логин"
              autoComplete="username"
              style={{ background: "#111118", border: error ? "1px solid #ff4444" : "1px solid #2a2a3a", borderRadius: 12, color: "#e0e0e0", padding: "14px 16px", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box", transition: "border 0.3s" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", marginBottom: 6, display: "block" }}>Пароль</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Введите пароль"
                autoComplete="current-password"
                style={{ background: "#111118", border: error ? "1px solid #ff4444" : "1px solid #2a2a3a", borderRadius: 12, color: "#e0e0e0", padding: "14px 16px", paddingRight: 48, fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box", transition: "border 0.3s" }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer", padding: 4 }}
              >{showPass ? "🙈" : "👁"}</button>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "#ff4444", textAlign: "center", padding: "4px 0", animation: "shake 0.3s" }}>
              Неверный логин или пароль
            </div>
          )}

          <button
            onClick={handleLogin}
            style={{ background: "linear-gradient(135deg, #00ff87, #00cc6a)", border: "none", borderRadius: 12, color: "#000", padding: "15px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 8, transition: "opacity 0.2s" }}
          >Войти</button>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

function App(){
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem("m15_auth") === "ok"; } catch(e) { return false; }
  });

  const handleLogin = () => {
    setAuthed(true);
    try { localStorage.setItem("m15_auth", "ok"); } catch(e) {}
  };

  const handleLogout = () => {
    setAuthed(false);
    try { localStorage.removeItem("m15_auth"); } catch(e) {}
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return <MainApp onLogout={handleLogout} />;
}

function MainApp({ onLogout }){
  const [data,setData]=useState(init());
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [selMonth,setSelMonth]=useState(new Date().getMonth());
  const [detailDay,setDetailDay]=useState(null);
  const [prodModal,setProdModal]=useState(false);
  const savingRef = React.useRef(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("crm-data");if(r&&r.value){const p=JSON.parse(r.value);setData({...init(),...p,products:p.products||PRODUCTS,rentalProducts:p.rentalProducts||RENTAL_PRODUCTS,stock:p.stock||initStock()})}else{await window.storage.set("crm-data",JSON.stringify(init()))}}catch(e){}setLoading(false)})()},[]);

  useEffect(() => {
    if (!window.storage.onValue) return;
    window.storage.onValue("crm-data", (val) => {
      if (savingRef.current) return;
      try {
        const p = JSON.parse(val);
        setData({ ...init(), ...p, products: p.products || PRODUCTS, rentalProducts: p.rentalProducts || RENTAL_PRODUCTS, stock: p.stock || initStock() });
      } catch(e) {}
    });
    return () => { if (window.storage.offValue) window.storage.offValue("crm-data"); };
  }, []);

  const save = useCallback(async nd => {
    setData(nd);
    savingRef.current = true;
    try { await window.storage.set("crm-data", JSON.stringify(nd)); } catch(e) {}
    setTimeout(() => { savingRef.current = false; }, 1000);
  }, []);


  const stats=useMemo(()=>{
    const mo=Array(12).fill(0).map(()=>({s:0,r:0,t:0,sc:0,rc:0}));let yt=0;
    data.sales.forEach(s=>{
      const d=new Date(s.date);if(d.getFullYear()!==2026)return;
      let profit;
      if(s.date < CUTOFF){profit=s.amount}
      else{profit=s.items?s.items.reduce((a,it)=>a+(isAppItem(it)?appProfit(it):it.price),0):s.amount}
      mo[d.getMonth()].s+=profit;mo[d.getMonth()].t+=profit;mo[d.getMonth()].sc++;yt+=profit;
    });
    data.rentals.forEach(r=>{const d=new Date(r.date);if(d.getFullYear()===2026){const paid=Math.max(0,(r.amount||0)-(r.debt||0));mo[d.getMonth()].r+=paid;mo[d.getMonth()].t+=paid;mo[d.getMonth()].rc++;yt+=paid}});
    return {monthly:mo,yearTotal:yt,remaining:YEAR_PLAN-yt,progress:(yt/YEAR_PLAN)*100};
  },[data]);

  const dayData=useMemo(()=>{
    if(!detailDay)return null;
    const ds=data.sales.filter(s=>s.date===detailDay),dr=data.rentals.filter(r=>r.date===detailDay);
    const da=(data.appointments||[]).filter(a=>a.date===detailDay);
    return {sales:ds,rentals:dr,appointments:da,totalSales:ds.reduce((a,s)=>{if(s.date<CUTOFF)return a+s.amount;if(!s.items)return a+s.amount;return a+s.items.reduce((b,it)=>b+(isAppItem(it)?appProfit(it):it.price),0)},0),totalRentals:dr.reduce((a,r)=>a+Math.max(0,(r.amount||0)-(r.debt||0)),0)};
  },[data,detailDay]);

  const clients=useMemo(()=>{
    const map={};
    const add=(key,name,phone,amt,type)=>{if(!key)return;if(!map[key])map[key]={name:"",phone:"",totalSpent:0,purchases:0,rentals:0};map[key].totalSpent+=amt;if(type==="sale")map[key].purchases++;else map[key].rentals++;if(name&&!map[key].name)map[key].name=name;if(phone&&!map[key].phone)map[key].phone=phone};
    data.sales.forEach(s=>add(s.phone||s.name,s.name,s.phone,s.amount,"sale"));
    data.rentals.forEach(r=>add(r.phone||r.lastName,r.lastName,r.phone,r.amount||0,"rental"));
    return Object.values(map).sort((a,b)=>b.totalSpent-a.totalSpent);
  },[data]);

  const maxMo=useMemo(()=>Math.max(...stats.monthly.map(m=>m.t),1),[stats]);
  const selDate=fmtD(new Date());

  if(loading)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0f",color:"#fff"}}><p>Загрузка...</p></div>;

  const openModal=(type,params={})=>setModal({type,...params});
  const closeModal=()=>setModal(null);

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e0e0e0",fontFamily:"'Segoe UI',-apple-system,sans-serif",paddingBottom:80}}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={{background:"linear-gradient(135deg,#0f0f1a,#1a1a2e)",borderBottom:"1px solid #222",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#00ff87,#00b85e)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:"#000"}}>M15</div>
          <span style={{fontWeight:700,fontSize:18,letterSpacing:1}}>mikro_15 CRM</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setProdModal(true)} style={{background:"transparent",border:"1px solid #333",borderRadius:8,color:"#888",padding:"6px 12px",fontSize:12,cursor:"pointer"}}>⚙ Товары</button>
          <button onClick={onLogout} style={{background:"transparent",border:"1px solid #ff444444",borderRadius:8,color:"#ff4444",padding:"6px 12px",fontSize:12,cursor:"pointer"}}>Выйти</button>
        </div>
      </div>
      <div style={{display:"flex",gap:0,borderBottom:"1px solid #222",background:"#0d0d15",overflowX:"auto"}}>
        {[{id:"dashboard",l:"📊 Дашборд"},{id:"calendar",l:"📅 Календарь"},{id:"sales",l:"💰 Продажи"},{id:"rentals",l:"📦 Аренда"},{id:"appointments",l:"📋 Записи"},{id:"apps",l:"📱 Прилож."},{id:"stock",l:"🏪 Склад"},{id:"clients",l:"👥 Клиенты"}].map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)} style={{flex:"0 0 auto",padding:"12px 10px",background:"transparent",border:"none",borderBottom:view===t.id?"2px solid #00ff87":"2px solid transparent",color:view===t.id?"#00ff87":"#666",fontSize:12,fontWeight:view===t.id?700:400,cursor:"pointer",whiteSpace:"nowrap"}}>{t.l}</button>
        ))}
      </div>
      <div style={{padding:"16px 16px 0"}}>
        {view==="dashboard"&&<Dashboard stats={stats} data={data} maxMo={maxMo} />}
        {view==="calendar"&&<CalendarView data={data} selMonth={selMonth} setSelMonth={setSelMonth} onDayClick={setDetailDay} onBook={(day)=>{setModal({type:"bookingDate",date:day})}} />}
        {detailDay&&<DayDetail day={detailDay} dayData={dayData} onClose={()=>setDetailDay(null)} onAddSale={()=>{setDetailDay(null);openModal("sale")}} onAddRental={()=>{setDetailDay(null);openModal("booking")}} onAddAppointment={()=>{const d=detailDay;setDetailDay(null);openModal("appointmentDate",{date:d})}} />}
        {view==="sales"&&<SalesList data={data} save={save} onEdit={(idx)=>openModal("editSale",{idx})}/>}
        {view==="rentals"&&<RentalsList data={data} save={save} onEdit={(idx)=>openModal("editRental",{idx})}/>}
        {view==="apps"&&<AppBookingsView data={data} save={save} openModal={openModal} />}
        {view==="appointments"&&<AppointmentsView data={data} save={save} openModal={openModal} />}
        {view==="clients"&&<ClientsView clients={clients} data={data} save={save}/>}
        {view==="stock"&&<StockView data={data} save={save}/>}
      </div>

      <button onClick={()=>openModal("choose")} style={{position:"fixed",bottom:24,right:24,width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#00ff87,#00cc6a)",border:"none",color:"#000",fontSize:28,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,255,135,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>+</button>

      {/* MODALS */}
      {modal?.type==="choose"&&<Modal onClose={closeModal} title="Новая запись"><div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        <button onClick={()=>openModal("sale")} style={{flex:"1 1 45%",padding:"20px 16px",background:"#00ff8715",border:"1px solid #00ff8740",borderRadius:12,color:"#00ff87",fontSize:14,fontWeight:600,cursor:"pointer"}}>💰 Продажа</button>
        <button onClick={()=>openModal("rental")} style={{flex:"1 1 45%",padding:"20px 16px",background:"#00aaff15",border:"1px solid #00aaff40",borderRadius:12,color:"#00aaff",fontSize:14,fontWeight:600,cursor:"pointer"}}>📦 Аренда</button>
        <button onClick={()=>openModal("booking")} style={{flex:"1 1 45%",padding:"20px 16px",background:"#ffaa0015",border:"1px solid #ffaa0040",borderRadius:12,color:"#ffaa00",fontSize:14,fontWeight:600,cursor:"pointer"}}>🔖 Бронь аренды</button>
        <button onClick={()=>openModal("appBooking")} style={{flex:"1 1 45%",padding:"20px 16px",background:"#ff6bff15",border:"1px solid #ff6bff40",borderRadius:12,color:"#ff6bff",fontSize:14,fontWeight:600,cursor:"pointer"}}>📱 Бронь прилож.</button>
        <button onClick={()=>openModal("appointment")} style={{flex:"1 1 95%",padding:"20px 16px",background:"#66ccff15",border:"1px solid #66ccff40",borderRadius:12,color:"#66ccff",fontSize:14,fontWeight:600,cursor:"pointer"}}>📋 Запись клиента</button>
      </div></Modal>}

      {modal?.type==="sale"&&<SaleForm products={data.products} stock={data.stock?.sale||{}} selDate={selDate} onClose={closeModal} onSave={s=>{
        const newStock = {...(data.stock||initStock())};
        const ss = {...(newStock.sale||{})};
        if (s.items) s.items.forEach(it => { if (it.id && ss[it.id] !== undefined && ss[it.id] > 0) ss[it.id] = Math.max(0, ss[it.id] - 1); });
        newStock.sale = ss;
        save({...data, sales:[...data.sales, s], stock: newStock});
        closeModal();
      }}/>}
      {modal?.type==="rental"&&<RentalForm kind="active" selDate={selDate} rp={data.rentalProducts} onClose={closeModal} onSave={r=>{save({...data,rentals:[...data.rentals,r]});closeModal()}}/>}
      {modal?.type==="booking"&&<RentalForm kind="booking" selDate={selDate} rp={data.rentalProducts} onClose={closeModal} onSave={r=>{save({...data,rentals:[...data.rentals,r]});closeModal()}}/>}

      {modal?.type==="editSale"&&<EditSaleModal idx={modal.idx} data={data} save={save} onClose={closeModal}/>}
      {modal?.type==="editRental"&&<EditRentalModal idx={modal.idx} data={data} save={save} rp={data.rentalProducts} onClose={closeModal}/>}
      {modal?.type==="confirm"&&<ConfirmModal msg={modal.msg} onConfirm={()=>{modal.onConfirm();closeModal()}} onClose={closeModal}/>}
      {modal?.type==="editClient"&&<EditClientModal client={modal.client} data={data} save={save} onClose={closeModal}/>}
      {modal?.type==="appBooking"&&<AppBookingForm onClose={closeModal} onSave={b => { save({...data, appBookings: [...(data.appBookings||[]), b]}); closeModal(); }} />}
      {modal?.type==="appointment"&&<AppointmentForm selDate={modal.date||selDate} onClose={closeModal} onSave={a => { save({...data, appointments: [...(data.appointments||[]), a]}); closeModal(); }} />}
      {modal?.type==="appointmentDate"&&<AppointmentForm selDate={modal.date} onClose={closeModal} onSave={a => { save({...data, appointments: [...(data.appointments||[]), a]}); closeModal(); }} />}
      {modal?.type==="bookingDate"&&<RentalForm kind="booking" selDate={modal.date} rp={data.rentalProducts} onClose={closeModal} onSave={r => { save({...data, rentals:[...data.rentals, r]}); closeModal(); }} />}

      {prodModal&&<ProductManager products={data.products} rp={data.rentalProducts} onClose={()=>setProdModal(false)} onSave={(p,rp)=>{save({...data,products:p,rentalProducts:rp});setProdModal(false)}}/>}
    </div>
  );
}

// ====== SHARED ======
function Modal({onClose,title,children}){
  return (<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#111118",borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto",border:"1px solid #222"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{margin:0,fontSize:17,fontWeight:700}}>{title}</h3>
        <button onClick={onClose} style={{background:"#222",border:"none",color:"#888",width:32,height:32,borderRadius:"50%",fontSize:16,cursor:"pointer"}}>✕</button>
      </div>{children}
    </div></div>);
}

function ConfirmModal({msg,onConfirm,onClose,confirmText,confirmColor}){
  return (<Modal onClose={onClose} title="Подтверждение">
    <p style={{fontSize:14,color:"#ccc",marginBottom:20}}>{msg}</p>
    <div style={{display:"flex",gap:12}}>
      <button onClick={onClose} style={{flex:1,padding:"12px",background:"#222",border:"1px solid #333",borderRadius:10,color:"#aaa",fontSize:14,cursor:"pointer"}}>Отмена</button>
      <button onClick={onConfirm} style={{flex:1,padding:"12px",background:confirmColor||"linear-gradient(135deg,#ff4444,#cc2222)",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{confirmText||"Удалить"}</button>
    </div>
  </Modal>);
}

// ====== DASHBOARD ======
function Dashboard({stats,data,maxMo}){
  // Category breakdown — apps counted as PROFIT (amount - cost)
  const cats = useMemo(() => {
    let earphones = 0, rentals = 0, apps = 0, buttons = 0;
    const earIds = new Set(["plat","silver","plat_mini","silver_mini","flash","flash_mini","flash_77","nano_7","flash_2026","flash_mag_2026"]);
    const btnIds = new Set(["knopki_std","knopki_yant","knopki_mini"]);
    function isBtn(it) { return btnIds.has(it.id) || (it.name && it.name.toLowerCase().indexOf("кнопк") >= 0); }
    data.sales.forEach(s => {
      if (new Date(s.date).getFullYear() !== 2026) return;
      if (s.date < CUTOFF) { earphones += s.amount; return; }
      if (s.items) s.items.forEach(it => {
        if (isAppItem(it)) apps += appProfit(it);
        else if (isBtn(it)) buttons += it.price;
        else earphones += it.price;
      }); else earphones += s.amount;
    });
    data.rentals.filter(r => new Date(r.date).getFullYear() === 2026).forEach(r => { rentals += Math.max(0, (r.amount || 0) - (r.debt || 0)); });
    (data.appBookings || []).filter(b => (b.status === "done" || b.status === "installed") && new Date(b.date).getFullYear() === 2026).forEach(b => {
      apps += Math.max(0, (b.amount || 0) - (b.cost || APP_COST * (b.qty || 1)));
    });
    const total = earphones + rentals + apps + buttons;
    const pct = v => total > 0 ? ((v / total) * 100).toFixed(1) : "0.0";
    return { earphones, rentals, apps, buttons, total, pct };
  }, [data]);

  return (<div>
    <div style={{background:"#111118",borderRadius:16,padding:20,border:"1px solid #1a1a2a",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"#888"}}>Годовой план 2026</span><span style={{fontSize:13,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{stats.progress.toFixed(1)}%</span></div>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}><span style={{fontSize:28,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#fff"}}>{fmtM(stats.yearTotal)}</span><span style={{fontSize:14,color:"#555"}}>/ {fmtM(YEAR_PLAN)}</span></div>
      <div style={{height:8,background:"#1a1a2a",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${Math.min(stats.progress,100)}%`,background:stats.progress<30?"linear-gradient(90deg,#ff4444,#ff6b6b)":stats.progress<70?"linear-gradient(90deg,#ffaa00,#ffcc00)":"linear-gradient(90deg,#00ff87,#00cc6a)",transition:"width 0.5s"}}/></div>
      <div style={{marginTop:10,fontSize:13,color:"#888"}}>Осталось: <span style={{color:"#ff6b6b",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(Math.max(0,stats.remaining))}</span></div>
    </div>

    <div style={{background:"#111118",borderRadius:16,padding:20,border:"1px solid #1a1a2a",marginBottom:16}}>
      <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600}}>Доход по месяцам</h3>
      <div style={{display:"flex",alignItems:"flex-end",gap:4,height:160}}>
        {stats.monthly.map((m,i)=>{const h=m.t>0?(m.t/maxMo)*120:2;const c=i===new Date().getMonth();const pct=stats.yearTotal>0?((m.t/stats.yearTotal)*100).toFixed(0):"0";return (
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:8,color:"#888",fontFamily:"'JetBrains Mono',monospace"}}>{m.t>0?pct+"%":""}</span>
            <span style={{fontSize:9,color:"#555",fontFamily:"'JetBrains Mono',monospace"}}>{m.t>0?(m.t/1000).toFixed(0)+"к":""}</span>
            <div style={{width:"100%",height:h,borderRadius:4,background:c?"linear-gradient(180deg,#00ff87,#00995a)":m.t>0?"linear-gradient(180deg,#2a2a4a,#1a1a3a)":"#1a1a2a"}}/>
            <span style={{fontSize:10,color:c?"#00ff87":"#555",fontWeight:c?700:400}}>{MS[i]}</span>
          </div>)})}
      </div>
    </div>

    {/* Category breakdown */}
    <div style={{background:"#111118",borderRadius:16,padding:20,border:"1px solid #1a1a2a",marginBottom:16}}>
      <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:600}}>Структура дохода</h3>
      {[
        {l:"Наушники (продажа)",v:cats.earphones,c:"#00ff87"},
        {l:"Аренда",v:cats.rentals,c:"#00aaff"},
        {l:"Приложения (прибыль)",v:cats.apps,c:"#ff6bff"},
        {l:"Кнопки",v:cats.buttons,c:"#ffaa00"},
      ].map((c,i) => (
        <div key={i} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
            <span style={{color:"#aaa"}}>{c.l}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",color:c.c}}>{cats.pct(c.v)}% · {fmtM(c.v)}</span>
          </div>
          <div style={{height:6,background:"#1a1a2a",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:3,width:`${cats.total>0?(c.v/cats.total)*100:0}%`,background:c.c,transition:"width 0.5s"}}/>
          </div>
        </div>
      ))}
    </div>

    {/* Year over Year */}
    <div style={{background:"#111118",borderRadius:16,padding:20,border:"1px solid #1a1a2a",marginBottom:16}}>
      <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:600}}>Сравнение с прошлыми годами</h3>
      {Object.entries(PREV_YEARS).sort((a,b)=>Number(b[0])-Number(a[0])).map(([yr,total])=>{
        const diff = stats.yearTotal - total;
        const pct = total > 0 ? ((stats.yearTotal / total) * 100).toFixed(0) : "—";
        const ahead = diff >= 0;
        return (
          <div key={yr} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1a1a2a"}}>
            <div>
              <div style={{fontSize:14,fontWeight:600}}>{yr} год</div>
              <div style={{fontSize:12,color:"#666"}}>{fmtM(total)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:ahead?"#00ff87":"#ff6b6b",fontFamily:"'JetBrains Mono',monospace"}}>{pct}%</div>
              <div style={{fontSize:11,color:ahead?"#00ff87":"#ff6b6b"}}>{ahead?"+":"−"}{fmtM(Math.abs(diff))}</div>
            </div>
          </div>
        );
      })}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      {[{l:"Продаж",v:data.sales.length,c:"#00ff87"},{l:"Аренд",v:data.rentals.filter(r=>r.status!=="booking").length,c:"#00aaff"},{l:"Бронь",v:data.rentals.filter(r=>r.status==="booking").length,c:"#ffaa00"},{l:"Этот месяц",v:fmtM(stats.monthly[new Date().getMonth()]?.t||0),c:"#ff6bff"}].map((c,i)=>(
        <div key={i} style={{background:"#111118",borderRadius:12,padding:"14px 16px",border:"1px solid #1a1a2a"}}><div style={{fontSize:12,color:"#666",marginBottom:4}}>{c.l}</div><div style={{fontSize:20,fontWeight:700,color:c.c,fontFamily:"'JetBrains Mono',monospace"}}>{c.v}</div></div>
      ))}
    </div>
  </div>);
}

// ====== SALE FORM (new) ======
function SaleForm({products,stock,selDate,onClose,onSave}){
  const [items,setItems]=useState([]);const [cp,setCp]=useState("");const [cpr,setCpr]=useState("");
  const [phone,setPhone]=useState("");const [name,setName]=useState("");const [date,setDate]=useState(selDate);
  const add=()=>{
    const p=products.find(x=>x.id===cp);if(!p)return;
    const pr=cpr?Number(cpr):p.price;
    const item={id:p.id,name:p.name,price:pr};
    if(p.id==="iphone_app"){item.cost=pr>=15000?10000:8000}
    setItems([...items,item]);setCp("");setCpr("");
  };
  const total=items.reduce((a,it)=>a+it.price,0);
  const cartCount = {};
  items.forEach(it => { if (it.id) cartCount[it.id] = (cartCount[it.id]||0) + 1; });
  const selProduct = products.find(x=>x.id===cp);

  return (<Modal onClose={onClose} title="💰 Новая продажа"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
    {items.length>0&&<ItemsList items={items} onRemove={i=>setItems(items.filter((_,j)=>j!==i))} total={total}/>}
    <label style={lbl}>Добавить товар</label>
    <select value={cp} onChange={e=>{setCp(e.target.value);const p=products.find(x=>x.id===e.target.value);if(p)setCpr(String(p.price))}} style={inp}>
      <option value="">Выберите...</option>
      {products.map(p => {
        const qty = stock[p.id] || 0;
        const inCart = cartCount[p.id] || 0;
        const avail = qty - inCart;
        return <option key={p.id} value={p.id}>{p.name} — {fmtM(p.price)} {qty > 0 ? "[" + avail + " шт]" : "[нет]"}</option>;
      })}
    </select>
    {cp&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",gap:8}}>
        <input type="number" placeholder="Сумма" value={cpr} onChange={e=>setCpr(e.target.value)} style={{...inp,flex:1}}/>
        <button onClick={()=>{
          const p=products.find(x=>x.id===cp);
          if(!p)return;
          const qty=stock[p.id]||0;
          const inCart=cartCount[p.id]||0;
          if(qty>0 && inCart>=qty){alert("На складе не хватает: "+p.name);return;}
          add();
        }} style={{background:"#00ff8722",border:"1px solid #00ff8744",borderRadius:10,color:"#00ff87",padding:"0 20px",fontSize:18,cursor:"pointer",fontWeight:700}}>+</button>
      </div>
      {selProduct&&selProduct.id==="iphone_app"&&<div style={{fontSize:12,color:"#888"}}>Себестоимость авто: {fmtM((cpr?Number(cpr):selProduct.price)>=15000?10000:8000)} · Прибыль: {fmtM((cpr?Number(cpr):selProduct.price)-((cpr?Number(cpr):selProduct.price)>=15000?10000:8000))}</div>}
    </div>}
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e=>setName(e.target.value)} style={inp}/>
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp}/>
    <button onClick={()=>{if(!items.length)return alert("Добавьте товар");onSave({items,amount:total,phone,name,date})}} style={btnG}>Сохранить · {fmtM(total)}</button>
  </div></Modal>);
}

// ====== EDIT SALE ======
function EditSaleModal({idx,data,save,onClose}){
  const sale=data.sales[idx];
  const [items,setItems]=useState(sale.items?[...sale.items]:[{name:sale.productName||"Продажа",price:sale.amount}]);
  const [phone,setPhone]=useState(sale.phone||"");const [name,setName]=useState(sale.name||"");const [date,setDate]=useState(sale.date);
  const [cp,setCp]=useState("");const [cpr,setCpr]=useState("");
  const products=data.products;
  const add=()=>{const p=products.find(x=>x.id===cp);if(!p)return;const pr=cpr?Number(cpr):p.price;const item={id:p.id,name:p.name,price:pr};if(p.id==="iphone_app"){item.cost=pr>=15000?10000:8000}setItems([...items,item]);setCp("");setCpr("")};
  const total=items.reduce((a,it)=>a+it.price,0);
  const [confirmDel,setConfirmDel]=useState(false);

  if(confirmDel)return <ConfirmModal msg="Удалить эту продажу?" onConfirm={()=>{const ns=restoreStockFromSale(data,idx);save({...data,sales:data.sales.filter((_,i)=>i!==idx),stock:ns});onClose()}} onClose={()=>setConfirmDel(false)}/>;

  return (<Modal onClose={onClose} title="✏️ Редактировать продажу"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
    <ItemsList items={items} onRemove={i=>setItems(items.filter((_,j)=>j!==i))} total={total} editable onPriceChange={(i,p)=>{const n=[...items];n[i]={...n[i],price:Number(p)};setItems(n)}}/>
    <label style={lbl}>Добавить товар</label>
    <select value={cp} onChange={e=>{setCp(e.target.value);const p=products.find(x=>x.id===e.target.value);if(p)setCpr(String(p.price))}} style={inp}><option value="">Выберите...</option>{products.map(p=><option key={p.id} value={p.id}>{p.name} — {fmtM(p.price)}</option>)}</select>
    {cp&&<div style={{display:"flex",gap:8}}><input type="number" value={cpr} onChange={e=>setCpr(e.target.value)} style={{...inp,flex:1}}/><button onClick={add} style={{background:"#00ff8722",border:"1px solid #00ff8744",borderRadius:10,color:"#00ff87",padding:"0 20px",fontSize:18,cursor:"pointer",fontWeight:700}}>+</button></div>}
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e=>setName(e.target.value)} style={inp}/>
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp}/>
    <button onClick={()=>{if(!items.length)return alert("Добавьте товар");const ns=[...data.sales];ns[idx]={items,amount:total,phone,name,date};save({...data,sales:ns});onClose()}} style={btnG}>Сохранить · {fmtM(total)}</button>
    <button onClick={()=>setConfirmDel(true)} style={{...btnR,marginTop:4}}>🗑 Удалить продажу</button>
  </div></Modal>);
}

// ====== EDIT RENTAL ======
function EditRentalModal({idx,data,save,rp,onClose}){
  const r=data.rentals[idx];
  const [phone,setPhone]=useState(r.phone||"");const [lastName,setLastName]=useState(r.lastName||"");
  const [note,setNote]=useState(r.note||"");const [amount,setAmount]=useState(String(r.amount||""));
  const [date,setDate]=useState(r.date);const [status,setStatus]=useState(r.status);
  const [productId,setProductId]=useState("");const [prodName,setProdName]=useState(r.productName||"");
  const [confirmDel,setConfirmDel]=useState(false);

  if(confirmDel)return <ConfirmModal msg="Удалить эту запись аренды?" onConfirm={()=>{save({...data,rentals:data.rentals.filter((_,i)=>i!==idx)});onClose()}} onClose={()=>setConfirmDel(false)}/>;

  return (<Modal onClose={onClose} title="✏️ Редактировать аренду"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Статус</label>
    <select value={status} onChange={e=>setStatus(e.target.value)} style={inp}><option value="booking">Ожидает</option><option value="active">Активная</option><option value="done">Завершена</option></select>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
    <label style={lbl}>Модель</label>
    <select value={productId} onChange={e=>{setProductId(e.target.value);const p=rp.find(x=>x.id===e.target.value);if(p){setAmount(String(p.price));setProdName(p.name)}}} style={inp}>
      <option value="">{prodName||"Не выбрана"}</option>
      <optgroup label="На сутки">{rp.filter(p=>!p.id.startsWith("r_short")).map(p=><option key={p.id} value={p.id}>{p.name} — {fmtM(p.price)}</option>)}</optgroup>
      <optgroup label="Короткая">{rp.filter(p=>p.id.startsWith("r_short")).map(p=><option key={p.id} value={p.id}>{p.name} — {fmtM(p.price)}</option>)}</optgroup>
    </select>
    <label style={lbl}>Фамилия</label><input value={lastName} onChange={e=>setLastName(e.target.value)} style={inp}/>
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp}/>
    <label style={lbl}>Сумма</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={inp}/>
    <label style={lbl}>Примечание</label><input value={note} onChange={e=>setNote(e.target.value)} style={inp}/>
    <button onClick={()=>{const nr=[...data.rentals];nr[idx]={...nr[idx],phone,lastName,note,date,amount:Number(amount)||0,status,productName:prodName};save({...data,rentals:nr});onClose()}} style={btnB}>Сохранить</button>
    <button onClick={()=>setConfirmDel(true)} style={{...btnR,marginTop:4}}>🗑 Удалить</button>
  </div></Modal>);
}

// ====== EDIT CLIENT ======
function EditClientModal({client,data,save,onClose}){
  const [name,setName]=useState(client.name);const [phone,setPhone]=useState(client.phone);
  const oldName=client.name,oldPhone=client.phone;
  const doSave=()=>{
    const ns=data.sales.map(s=>{
      if((oldPhone&&s.phone===oldPhone)||(oldName&&s.name===oldName))return {...s,name:name,phone:phone};return s;
    });
    const nr=data.rentals.map(r=>{
      if((oldPhone&&r.phone===oldPhone)||(oldName&&r.lastName===oldName))return {...r,lastName:name,phone:phone};return r;
    });
    save({...data,sales:ns,rentals:nr});onClose();
  };
  return (<Modal onClose={onClose} title="✏️ Редактировать клиента"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e=>setName(e.target.value)} style={inp}/>
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp}/>
    <p style={{fontSize:11,color:"#666"}}>Изменения применятся ко всем записям этого клиента</p>
    <button onClick={doSave} style={btnG}>Сохранить</button>
  </div></Modal>);
}

// ====== ITEMS LIST (in sale form) ======
function ItemsList({items,onRemove,total,editable,onPriceChange}){
  return (<div style={{background:"#0a0a12",borderRadius:10,padding:12,border:"1px solid #1a1a2a"}}>
    <div style={{fontSize:11,color:"#888",marginBottom:8}}>Позиции в чеке:</div>
    {items.map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<items.length-1?"1px solid #1a1a2a":"none"}}>
      <span style={{fontSize:13,flex:1}}>{it.name}</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {editable?<input type="number" value={it.price} onChange={e=>onPriceChange(i,e.target.value)} style={{...inp,width:80,padding:"4px 8px",fontSize:12,textAlign:"right"}}/>
        :<span style={{fontSize:13,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(it.price)}</span>}
        <button onClick={()=>onRemove(i)} style={{background:"none",border:"none",color:"#ff4444",fontSize:14,cursor:"pointer",padding:0}}>✕</button>
      </div>
    </div>))}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid #2a2a3a"}}>
      <span style={{fontSize:14,fontWeight:700}}>Итого</span>
      <span style={{fontSize:16,fontWeight:700,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(total)}</span>
    </div>
  </div>);
}

function waLink(phone) {  const digits = (phone || "").replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}
function tomorrow(dateStr) {
  const d = new Date(dateStr); d.setDate(d.getDate() + 1);
  return fmtD(d);
}
function rentalStatus(r) {
  if (!r.returnDate) return null;
  const today = fmtD(new Date());
  const ret = r.returnDate;
  const tom = tomorrow(today);
  if (r.status === "done") return null;
  if (r.status !== "active") return null;
  if (ret > tom) return {text: "Аренда до " + ret, color: "#00aaff"};
  if (ret === tom) return {text: "Аренда до завтра", color: "#00aaff"};
  if (ret === today) return {text: "Сегодня вернут", color: "#ffaa00"};
  return {text: "Просрочка аренды!", color: "#ff4444"};
}

// ====== RENTAL FORM (new) ======
function RentalForm({kind,selDate,rp,onClose,onSave}){
  const [phone,setPhone]=useState("");const [lastName,setLastName]=useState("");const [note,setNote]=useState("");
  const [amount,setAmount]=useState("");const [date,setDate]=useState(selDate);const [pid,setPid]=useState("");
  const [returnDate,setReturnDate]=useState(tomorrow(selDate));
  const [debt,setDebt]=useState("0");
  return (<Modal onClose={onClose} title={kind==="booking"?"🔖 Бронь":"📦 Аренда"}><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e=>{setDate(e.target.value);setReturnDate(tomorrow(e.target.value))}} style={inp}/>
    <label style={lbl}>Вернуть до</label><input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} style={inp}/>
    <label style={lbl}>Модель</label>
    <select value={pid} onChange={e=>{setPid(e.target.value);const p=rp.find(x=>x.id===e.target.value);if(p)setAmount(String(p.price))}} style={inp}>
      <option value="">Выберите...</option>
      <optgroup label="На сутки">{rp.filter(p=>!p.id.startsWith("r_short")).map(p=><option key={p.id} value={p.id}>{p.name} — {fmtM(p.price)}</option>)}</optgroup>
      <optgroup label="Короткая">{rp.filter(p=>p.id.startsWith("r_short")).map(p=><option key={p.id} value={p.id}>{p.name} — {fmtM(p.price)}</option>)}</optgroup>
    </select>
    <label style={lbl}>Фамилия</label><input value={lastName} onChange={e=>setLastName(e.target.value)} style={inp}/>
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp}/>
    <label style={lbl}>Сумма</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={inp}/>
    <label style={lbl}>Долг</label><input type="number" value={debt} onChange={e=>setDebt(e.target.value)} style={inp} placeholder="0"/>
    <label style={lbl}>Примечание</label><input value={note} onChange={e=>setNote(e.target.value)} style={inp}/>
    <button onClick={()=>{const sel=rp.find(x=>x.id===pid);onSave({phone,lastName,note,date,returnDate,debt:Number(debt)||0,productName:sel?sel.name:"—",amount:Number(amount)||0,status:kind==="booking"?"booking":"active"})}} style={kind==="booking"?btnY:btnB}>{kind==="booking"?"Сохранить бронь":"Сохранить аренду"}</button>
  </div></Modal>);
}

// ====== SALES LIST (grouped by date) ======
function SalesList({data,save,onEdit}){
  const [confirmIdx,setConfirmIdx]=useState(null);
  const [toRentalIdx,setToRentalIdx]=useState(null);

  const grouped = useMemo(() => {
    const map = {};
    data.sales.forEach((s, idx) => {
      if (!map[s.date]) map[s.date] = {sales:[],rentals:[],apps:[]};
      map[s.date].sales.push({ ...s, _idx: idx });
    });
    // Add rentals and bookings to date groups
    data.rentals.forEach(r => {
      if (!map[r.date]) map[r.date] = {sales:[],rentals:[],apps:[]};
      map[r.date].rentals.push(r);
    });
    (data.appBookings||[]).forEach(b => {
      if (!map[b.date]) map[b.date] = {sales:[],rentals:[],apps:[]};
      map[b.date].apps.push(b);
    });
    // Only show dates that have sales
    return Object.entries(map).filter(([_,v])=>v.sales.length>0).sort((a, b) => b[0].localeCompare(a[0]));
  }, [data.sales, data.rentals, data.appBookings]);

  const doConvertToRental = () => {
    if (toRentalIdx === null) return;
    const sale = data.sales[toRentalIdx];
    if (!sale) return;
    const prodName = sale.items ? sale.items.map(it => it.name).join(", ") : (sale.productName || "Продажа");
    const newRental = { phone: sale.phone || "", lastName: sale.name || "", note: "Переведено из продажи", date: sale.date, productName: prodName, amount: sale.amount, debt: 0, status: "active", returnDate: tomorrow(sale.date) };
    const newStock = restoreStockFromSale(data, toRentalIdx);
    save({ ...data, sales: data.sales.filter((_, j) => j !== toRentalIdx), rentals: [...data.rentals, newRental], stock: newStock });
    setToRentalIdx(null);
  };

  return (<div>
    <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:600}}>Продажи</h3>
    {confirmIdx!==null&&<ConfirmModal msg="Удалить эту продажу?" onConfirm={()=>{const ns=restoreStockFromSale(data,confirmIdx);save({...data,sales:data.sales.filter((_,j)=>j!==confirmIdx),stock:ns});setConfirmIdx(null)}} onClose={()=>setConfirmIdx(null)}/>}
    {toRentalIdx!==null&&<ConfirmModal msg="Перевести эту продажу в аренду?" confirmText="Перевести" confirmColor="linear-gradient(135deg,#00aaff,#0088cc)" onConfirm={doConvertToRental} onClose={()=>setToRentalIdx(null)}/>}
    {!data.sales.length ? <div style={{color:"#555",padding:40,textAlign:"center"}}>Пока нет продаж</div> :
    grouped.map(([date, group]) => {
      const d = new Date(date);
      const dayLabel = d.getDate() + " " + MR[d.getMonth()];
      const salesProfit = group.sales.reduce((a, s) => {
        if (date < CUTOFF) return a + s.amount;
        if (!s.items) return a + s.amount;
        return a + s.items.reduce((b, it) => b + (isAppItem(it) ? 0 : it.price), 0);
      }, 0);
      const salesAppProfit = date < CUTOFF ? 0 : group.sales.reduce((a, s) => {
        if (!s.items) return a;
        return a + s.items.reduce((b, it) => b + (isAppItem(it) ? appProfit(it) : 0), 0);
      }, 0);
      const rentalsTotal = group.rentals.reduce((a, r) => a + Math.max(0, (r.amount||0) - (r.debt||0)), 0);
      const appsTotal = group.apps.reduce((a, b) => a + Math.max(0, (b.amount||0) - (b.cost || APP_COST * (b.qty||1))), 0) + salesAppProfit;
      const dayGrand = salesProfit + rentalsTotal + appsTotal;
      return (
        <div key={date} style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8,padding:"0 4px"}}>
            <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>{dayLabel}</span>
            <span style={{fontSize:13,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(salesProfit)}</span>
          </div>
          {group.sales.map((s, i) => {
            const label = s.items ? s.items.map(it => it.name).join(", ") : (s.productName || "Продажа");
            return (<div key={i} style={{background:"#111118",borderRadius:12,padding:"12px 16px",border:"1px solid #1a1a2a",marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>onEdit(s._idx)}>
                  <div style={{fontSize:14,fontWeight:600}}>{label}</div>
                  <div style={{fontSize:12,color:"#666",marginTop:2}}>{s.name||""} {s.phone||"—"}</div>
                  {s.items&&s.items.length>1&&<div style={{marginTop:4}}>{s.items.map((it,j)=>(<div key={j} style={{fontSize:11,color:"#888",display:"flex",justifyContent:"space-between",padding:"1px 0"}}><span>{it.name}</span><span style={{color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(it.price)}</span></div>))}</div>}
                </div>
                <div style={{textAlign:"right",marginLeft:12,flexShrink:0}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(s.amount)}</div>
                  <div style={{display:"flex",gap:6,marginTop:4,justifyContent:"flex-end",flexWrap:"wrap"}}>
                    <button onClick={()=>setToRentalIdx(s._idx)} style={{background:"none",border:"none",color:"#00aaff",fontSize:10,cursor:"pointer"}}>→ аренда</button>
                    <button onClick={()=>onEdit(s._idx)} style={{background:"none",border:"none",color:"#00aaff",fontSize:11,cursor:"pointer"}}>✏️</button>
                    <button onClick={()=>setConfirmIdx(s._idx)} style={{background:"none",border:"none",color:"#ff4444",fontSize:11,cursor:"pointer"}}>🗑</button>
                  </div>
                </div>
              </div>
            </div>);
          })}
          {/* Day grand total */}
          <div style={{background:"#0d0d15",borderRadius:10,padding:"10px 14px",marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#888"}}>ИТОГ:</div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(dayGrand)}</div>
              {(rentalsTotal > 0 || appsTotal > 0) && <div style={{fontSize:10,color:"#666",marginTop:2}}>
                {salesProfit > 0 && <span>Продажи {fmtM(salesProfit)}</span>}
                {rentalsTotal > 0 && <span>{salesProfit > 0 ? " + " : ""}Аренда {fmtM(rentalsTotal)}</span>}
                {appsTotal > 0 && <span>{(salesProfit > 0 || rentalsTotal > 0) ? " + " : ""}Прилож. {fmtM(appsTotal)}</span>}
              </div>}
            </div>
          </div>
        </div>
      );
    })}
  </div>);
}

// ====== RENTALS LIST ======
function RentalsList({data,save,onEdit}){
  const stC={booking:"#ffaa00",active:"#00aaff",done:"#00ff87"};
  const stL={booking:"Ожидает",active:"Активная",done:"Завершена"};
  const nextSt={booking:"active",active:"done"};
  const nextStL={booking:"Активная",active:"Завершена"};
  const [confirmIdx,setConfirmIdx]=useState(null);
  const [statusChange,setStatusChange]=useState(null);
  const [tab,setTab]=useState("all");
  const [search,setSearch]=useState("");

  const filtered = useMemo(() => {
    let list;
    if (tab === "bookings") {
      list = data.rentals.map((r,i)=>({...r,_idx:i})).filter(r=>r.status==="booking").sort((a,b)=>a.date.localeCompare(b.date));
    } else {
      list = data.rentals.map((r,i)=>({...r,_idx:i})).filter(r=>r.status!=="booking");
    }
    if (search && search !== "+7") {
      const q = formatPhone(search); const ql = search.toLowerCase();
      list = list.filter(r => (r.phone || "").includes(q) || (r.phone || "").includes(search) || (r.lastName || "").toLowerCase().includes(ql));
    }
    return list;
  }, [data.rentals, tab, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(r => { if (!map[r.date]) map[r.date] = []; map[r.date].push(r); });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (<div>
    <h3 style={{margin:"0 0 8px",fontSize:16,fontWeight:600}}>Аренда и брони</h3>
    <div style={{display:"flex",marginBottom:14}}>
      {[{id:"all",l:"Аренды"},{id:"bookings",l:"Будущие брони"}].map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:8,background:"transparent",border:"none",borderBottom:tab===t.id?"2px solid #00ff87":"2px solid transparent",color:tab===t.id?"#00ff87":"#666",fontSize:13,cursor:"pointer"}}>{t.l}</button>
      ))}
    </div>
    <PhoneInput value={search} onChange={setSearch} style={{...inp, marginBottom: 12}} />
    {confirmIdx!==null&&<ConfirmModal msg="Удалить эту запись?" onConfirm={()=>{save({...data,rentals:data.rentals.filter((_,j)=>j!==confirmIdx)});setConfirmIdx(null)}} onClose={()=>setConfirmIdx(null)}/>}
    {statusChange!==null&&<ConfirmModal msg={`Изменить статус на «${statusChange.label}»?`} confirmText="Изменить" confirmColor="linear-gradient(135deg,#00aaff,#0088cc)" onConfirm={()=>{const nr=[...data.rentals];nr[statusChange.idx]={...nr[statusChange.idx],status:statusChange.newStatus};save({...data,rentals:nr});setStatusChange(null)}} onClose={()=>setStatusChange(null)}/>}
    {!grouped.length?<div style={{color:"#555",padding:40,textAlign:"center"}}>{search&&search!=="+7"?"Ничего не найдено":tab==="bookings"?"Нет будущих броней":"Пока нет аренд"}</div>:
    grouped.map(([date, rentals]) => {
      const d = new Date(date);
      const dayLabel = `${d.getDate()} ${MR[d.getMonth()]}`;
      return (<div key={date} style={{marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:8,padding:"0 4px"}}>{dayLabel}</div>
        {rentals.map((r, i) => {
          const ns = nextSt[r.status];
          const rs = rentalStatus(r);
          return (<div key={i} style={{background:"#111118",borderRadius:12,padding:"12px 16px",border:"1px solid #1a1a2a",marginBottom:6,borderLeft:`3px solid ${stC[r.status]||"#555"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>onEdit(r._idx)}>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{r.productName?`Аренда ${r.productName}`:""} · {r.lastName||"—"}</div>
                <div style={{fontSize:12,color:"#666",marginTop:2}}>{r.phone||"—"}{r.note?` · ${r.note}`:""}</div>
                {rs&&<div style={{fontSize:11,fontWeight:600,color:rs.color,marginTop:3}}>{rs.text}</div>}
              </div>
              <div style={{textAlign:"right"}}>
                <span style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:stC[r.status]+"22",color:stC[r.status]}}>{stL[r.status]}</span>
                {r.amount>0&&<div style={{fontSize:14,fontWeight:700,color:"#00aaff",fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{fmtM(r.amount)}</div>}
                {(r.debt||0)>0?<div style={{fontSize:11,fontWeight:700,color:"#ff4444",marginTop:2}}>Долг: {fmtM(r.debt)}</div>:r.amount>0?<div style={{fontSize:10,color:"#00ff87",marginTop:2}}>Оплачено</div>:null}
              </div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              {ns&&<button onClick={e=>{e.stopPropagation();if(ns==="active"&&r.status==="booking"){const a=prompt("Сумма аренды:");if(!a)return;const nr=[...data.rentals];nr[r._idx]={...nr[r._idx],status:"active",amount:Number(a),date:fmtD(new Date()),returnDate:nr[r._idx].returnDate||tomorrow(fmtD(new Date()))};save({...data,rentals:nr})}else{setStatusChange({idx:r._idx,newStatus:ns,label:nextStL[r.status]})}}} style={{background:stC[ns]+"22",border:"1px solid "+stC[ns]+"44",borderRadius:6,color:stC[ns],padding:"4px 10px",fontSize:11,cursor:"pointer"}}>→ {nextStL[r.status]}</button>}
              {r.phone&&r.status==="active"&&<a href={waLink(r.phone)} target="_blank" rel="noopener" onClick={e=>e.stopPropagation()} style={{background:"#25D36622",border:"1px solid #25D36644",borderRadius:6,color:"#25D366",padding:"4px 10px",fontSize:11,cursor:"pointer",textDecoration:"none"}}>WhatsApp</a>}
              <button onClick={e=>{e.stopPropagation();onEdit(r._idx)}} style={{background:"none",border:"1px solid #00aaff44",borderRadius:6,color:"#00aaff",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>✏️</button>
              <button onClick={e=>{e.stopPropagation();setConfirmIdx(r._idx)}} style={{background:"none",border:"1px solid #ff444444",borderRadius:6,color:"#ff4444",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>🗑</button>
            </div>
          </div>);
        })}
      </div>);
    })}
  </div>);
}

// ====== CLIENTS ======
function ClientsView({clients,data,save}){
  const [search,setSearch]=useState("");const [editClient,setEditClient]=useState(null);
  const filtered=useMemo(()=>{if(!search)return clients;const q=search.toLowerCase();return clients.filter(c=>(c.name||"").toLowerCase().includes(q)||(c.phone||"").includes(q))},[clients,search]);
  const exportCSV=()=>{const bom="\uFEFF";const rows=["Имя;Телефон;Сумма;Покупки;Аренды",...filtered.map(c=>`${c.name};${c.phone};${c.totalSpent};${c.purchases};${c.rentals}`)].join("\n");const blob=new Blob([bom+rows],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="clients_mikro15.csv";a.click();URL.revokeObjectURL(url)};
  return (<div>
    {editClient&&<EditClientModal client={editClient} data={data} save={save} onClose={()=>setEditClient(null)}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:600}}>Клиенты ({filtered.length})</h3>
      <button onClick={exportCSV} style={{background:"#00ff8718",border:"1px solid #00ff8740",borderRadius:8,color:"#00ff87",padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>📥 CSV</button>
    </div>
    <input type="text" placeholder="Поиск по имени или телефону..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,marginBottom:12}}/>
    {!filtered.length?<div style={{color:"#555",padding:40,textAlign:"center"}}>Нет клиентов</div>:filtered.map((c,i)=>(
      <div key={i} onClick={()=>setEditClient(c)} style={{background:"#111118",borderRadius:12,padding:"12px 16px",border:"1px solid #1a1a2a",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>{c.name||"—"} <span style={{fontSize:11,color:"#00aaff",marginLeft:4}}>✏️</span></div>
          <div style={{fontSize:13,color:"#888",marginTop:2}}>{c.phone||"—"}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:15,fontWeight:700,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(c.totalSpent)}</div>
          <div style={{fontSize:11,color:"#666"}}>{c.purchases>0?`${c.purchases} пок.`:""}{c.purchases>0&&c.rentals>0?" · ":""}{c.rentals>0?`${c.rentals} ар.`:""}</div>
        </div>
      </div>
    ))}
  </div>);
}

// ====== CALENDAR ======
function CalendarView({data,selMonth,setSelMonth,onDayClick,onBook}){
  const year=2026,days=dim(year,selMonth);const fd=new Date(year,selMonth,1).getDay();const offset=fd===0?6:fd-1;const today=fmtD(new Date());
  const dt=useMemo(()=>{
    const m={};
    data.sales.forEach(s=>{if(!m[s.date])m[s.date]={s:0,r:0,b:0,a:0};if(s.date<CUTOFF){m[s.date].s+=s.amount}else{const pr=s.items?s.items.reduce((a,it)=>a+(isAppItem(it)?appProfit(it):it.price),0):s.amount;m[s.date].s+=pr}});
    data.rentals.forEach(r=>{if(!m[r.date])m[r.date]={s:0,r:0,b:0,a:0};if(r.status==="booking")m[r.date].b++;m[r.date].r+=Math.max(0,(r.amount||0)-(r.debt||0))});
    (data.appointments||[]).forEach(ap=>{if(!m[ap.date])m[ap.date]={s:0,r:0,b:0,a:0};m[ap.date].a++});
    return m;
  },[data]);
  return (<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <button onClick={()=>setSelMonth(Math.max(0,selMonth-1))} style={navBtn}>‹</button>
      <span style={{fontSize:17,fontWeight:700}}>{MR[selMonth]} {year}</span>
      <button onClick={()=>setSelMonth(Math.min(11,selMonth+1))} style={navBtn}>›</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:"#555",padding:4}}>{d}</div>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
      {Array(offset).fill(null).map((_,i)=><div key={`e${i}`}/>)}
      {Array.from({length:days},(_,i)=>{const d=`${year}-${pad(selMonth+1)}-${pad(i+1)}`;const info=dt[d];const isT=d===today;const tot=info?info.s+info.r:0;const hasData=info&&(info.s||info.r||info.b||info.a);
        return (<button key={i} onClick={()=>onDayClick(d)} style={{background:isT?"#00ff8718":hasData?"#1a1a2a":"#0d0d15",border:isT?"1px solid #00ff8740":"1px solid #1a1a2a",borderRadius:8,padding:"6px 2px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minHeight:50}}>
          <span style={{fontSize:13,color:isT?"#00ff87":"#ccc",fontWeight:isT?700:400}}>{i+1}</span>
          {tot>0&&<span style={{fontSize:8,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{(tot/1000).toFixed(0)}к</span>}
          <div style={{display:"flex",gap:2}}>
            {info?.b>0&&<span style={{fontSize:7,color:"#ffaa00"}}>🔖</span>}
            {info?.a>0&&<span style={{fontSize:7,color:"#66ccff"}}>📋{info.a}</span>}
          </div>
        </button>)})}
    </div>
  </div>);
}

// ====== DAY DETAIL ======
function DayDetail({day,dayData,onClose,onAddSale,onAddRental,onAddAppointment}){
  if(!dayData)return null;const d=new Date(day);const label=`${d.getDate()} ${MR[d.getMonth()]}`;
  const stC={booking:"#ffaa00",active:"#00aaff",done:"#00ff87"};const stL={booking:"Ожидает",active:"Активная",done:"Завершена"};
  return (<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#111118",borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto",border:"1px solid #222"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h3 style={{margin:0,fontSize:17,fontWeight:700}}>{label}</h3><button onClick={onClose} style={{background:"#222",border:"none",color:"#888",width:32,height:32,borderRadius:"50%",fontSize:16,cursor:"pointer"}}>✕</button></div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <button onClick={onAddSale} style={{flex:1,padding:"10px",background:"#00ff8712",border:"1px solid #00ff8730",borderRadius:10,color:"#00ff87",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Продажа</button>
        <button onClick={onAddRental} style={{flex:1,padding:"10px",background:"#ffaa0012",border:"1px solid #ffaa0030",borderRadius:10,color:"#ffaa00",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Бронь</button>
        <button onClick={onAddAppointment} style={{flex:1,padding:"10px",background:"#66ccff12",border:"1px solid #66ccff30",borderRadius:10,color:"#66ccff",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Запись</button>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div style={{flex:1,background:"#00ff8712",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:11,color:"#888"}}>Продажи</div><div style={{fontSize:18,fontWeight:700,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(dayData.totalSales)}</div></div>
        <div style={{flex:1,background:"#00aaff12",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:11,color:"#888"}}>Аренда</div><div style={{fontSize:18,fontWeight:700,color:"#00aaff",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(dayData.totalRentals)}</div></div>
      </div>
      {dayData.sales.length>0&&<><h4 style={{fontSize:13,color:"#888",margin:"12px 0 8px"}}>Продажи ({dayData.sales.length})</h4>{dayData.sales.map((s,i)=>{const nm=s.items?s.items.map(it=>it.name).join(", "):(s.productName||"Продажа");return (<div key={i} style={{background:"#0d0d15",borderRadius:8,padding:"8px 12px",marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13}}>{nm}</span><span style={{fontSize:13,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(s.amount)}</span></div>{s.name&&<div style={{fontSize:11,color:"#666",marginTop:2}}>{s.name} {s.phone||""}</div>}{s.items&&s.items.length>1&&s.items.map((it,j)=><div key={j} style={{fontSize:11,color:"#555",display:"flex",justifyContent:"space-between",paddingLeft:8}}><span>· {it.name}</span><span>{fmtM(it.price)}</span></div>)}</div>)})}</>}
      {dayData.rentals.length>0&&<><h4 style={{fontSize:13,color:"#888",margin:"12px 0 8px"}}>Аренда / Бронь ({dayData.rentals.length})</h4>{dayData.rentals.map((r,i)=>(<div key={i} style={{background:"#0d0d15",borderRadius:8,padding:"8px 12px",marginBottom:6,borderLeft:`3px solid ${stC[r.status]}`}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13}}>{r.lastName} · {r.phone}</span><span style={{fontSize:11,color:stC[r.status]}}>{stL[r.status]}</span></div>{r.note&&<div style={{fontSize:11,color:"#666",marginTop:2}}>{r.note}</div>}</div>))}</>}
      {dayData.appointments&&dayData.appointments.length>0&&<><h4 style={{fontSize:13,color:"#888",margin:"12px 0 8px"}}>📋 Записи ({dayData.appointments.length})</h4>{dayData.appointments.map((a,i)=>{const apStC={pending:"#66ccff",done:"#00ff87",cancelled:"#ff4444"};const apStL={pending:"Ожидает",done:"Пришёл",cancelled:"Отменена"};const st=a.status||"pending";return (<div key={i} style={{background:"#0d0d15",borderRadius:8,padding:"8px 12px",marginBottom:6,borderLeft:`3px solid ${apStC[st]}`}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13}}>{a.name||"—"} · {a.phone||"—"}</span><span style={{fontSize:11,color:apStC[st]}}>{apStL[st]}</span></div><div style={{fontSize:11,color:"#666",marginTop:2}}>{a.time||"—"} · {a.purpose==="purchase"?"Покупка":a.purpose==="consultation"?"Консультация":a.purpose||"—"}{a.note?` · ${a.note}`:""}</div></div>)})}</>}
      {!dayData.sales.length&&!dayData.rentals.length&&(!dayData.appointments||!dayData.appointments.length)&&<div style={{color:"#555",textAlign:"center",padding:20}}>Нет записей</div>}
    </div></div>);
}

// ====== PRODUCT MANAGER ======
function ProductManager({products,rp,onClose,onSave}){
  const [tab,setTab]=useState("sales");const [sl,setSl]=useState([...products]);const [rl,setRl]=useState([...rp]);
  const [nn,setNn]=useState("");const [np,setNp]=useState("");const list=tab==="sales"?sl:rl;const setList=tab==="sales"?setSl:setRl;
  const move=(i,dir)=>{const n=[...list];const j=i+dir;if(j<0||j>=n.length)return;const tmp=n[i];n[i]=n[j];n[j]=tmp;setList(n)};
  return (<Modal onClose={onClose} title="⚙ Управление товарами">
    <div style={{display:"flex",marginBottom:16}}>{[{id:"sales",l:"Продажа"},{id:"rentals",l:"Аренда"}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:8,background:"transparent",border:"none",borderBottom:tab===t.id?"2px solid #00ff87":"2px solid transparent",color:tab===t.id?"#00ff87":"#666",fontSize:13,cursor:"pointer"}}>{t.l}</button>)}</div>
    <div style={{maxHeight:280,overflowY:"auto",marginBottom:16}}>{list.map((p,i)=>(<div key={p.id+i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        <button onClick={()=>move(i,-1)} style={{background:"none",border:"none",color:i===0?"#333":"#888",fontSize:10,cursor:"pointer",padding:0}}>▲</button>
        <button onClick={()=>move(i,1)} style={{background:"none",border:"none",color:i===list.length-1?"#333":"#888",fontSize:10,cursor:"pointer",padding:0}}>▼</button>
      </div>
      <span style={{flex:1,fontSize:13}}>{p.name}</span>
      <span style={{fontSize:13,color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(p.price)}</span>
      <button onClick={()=>setList(list.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#ff4444",fontSize:14,cursor:"pointer"}}>✕</button>
    </div>))}</div>
    <div style={{display:"flex",gap:8,marginBottom:12}}><input placeholder="Название" value={nn} onChange={e=>setNn(e.target.value)} style={{...inp,flex:2}}/><input placeholder="Цена" type="number" value={np} onChange={e=>setNp(e.target.value)} style={{...inp,flex:1}}/><button onClick={()=>{if(nn&&np){setList([...list,{id:(tab==="sales"?"p_":"r_")+Date.now(),name:nn,price:Number(np)}]);setNn("");setNp("")}}} style={{background:"#00ff8722",border:"1px solid #00ff8744",borderRadius:8,color:"#00ff87",padding:"0 12px",cursor:"pointer",fontWeight:700}}>+</button></div>
    <button onClick={()=>onSave(sl,rl)} style={btnG}>Сохранить</button>
  </Modal>);
}

// ====== STOCK / СКЛАД ======
function StockView({ data, save }) {
  const [tab, setTab] = useState("sale");
  const stock = data.stock || initStock();
  const products = tab === "sale" ? data.products : data.rentalProducts;
  const stockMap = tab === "sale" ? (stock.sale || {}) : (stock.rental || {});

  const setQty = (id, val) => {
    const newStock = { ...stock };
    if (tab === "sale") {
      newStock.sale = { ...(newStock.sale || {}), [id]: Math.max(0, val) };
    } else {
      newStock.rental = { ...(newStock.rental || {}), [id]: Math.max(0, val) };
    }
    save({ ...data, stock: newStock });
  };

  const totalItems = products.reduce((a, p) => a + (stockMap[p.id] || 0), 0);
  const totalValue = products.reduce((a, p) => a + (stockMap[p.id] || 0) * p.price, 0);

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Склад</h3>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 14 }}>
        Всего: <span style={{ color: "#00ff87", fontFamily: "'JetBrains Mono',monospace" }}>{totalItems} шт</span> на сумму <span style={{ color: "#00ff87", fontFamily: "'JetBrains Mono',monospace" }}>{fmtM(totalValue)}</span>
      </div>

      <div style={{ display: "flex", marginBottom: 16 }}>
        {[{ id: "sale", l: "Продажа" }, { id: "rental", l: "Аренда" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: 8, background: "transparent", border: "none",
            borderBottom: tab === t.id ? "2px solid #00ff87" : "2px solid transparent",
            color: tab === t.id ? "#00ff87" : "#666", fontSize: 13, cursor: "pointer"
          }}>{t.l}</button>
        ))}
      </div>

      {products.map(p => {
        const qty = stockMap[p.id] || 0;
        const isLow = qty > 0 && qty <= 2;
        const isEmpty = qty === 0;
        return (
          <div key={p.id} style={{
            background: "#111118", borderRadius: 12, padding: "10px 16px",
            border: isEmpty ? "1px solid #2a1a1a" : isLow ? "1px solid #3a2a1a" : "1px solid #1a1a2a",
            marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{fmtM(p.price)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setQty(p.id, qty - 1)} style={{
                width: 32, height: 32, borderRadius: 8, border: "1px solid #2a2a3a",
                background: "#0a0a12", color: "#ff6b6b", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>−</button>
              <input
                type="number"
                value={qty}
                onChange={e => setQty(p.id, parseInt(e.target.value) || 0)}
                style={{
                  width: 50, textAlign: "center", background: "#0a0a12",
                  border: "1px solid #2a2a3a", borderRadius: 8,
                  color: isEmpty ? "#ff4444" : isLow ? "#ffaa00" : "#00ff87",
                  padding: "6px 4px", fontSize: 16, fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace", outline: "none"
                }}
              />
              <button onClick={() => setQty(p.id, qty + 1)} style={{
                width: 32, height: 32, borderRadius: 8, border: "1px solid #2a2a3a",
                background: "#0a0a12", color: "#00ff87", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ====== APP BOOKINGS (Брони приложений) ======
function AppBookingsView({data, save, openModal}) {
  const bookings = data.appBookings || [];
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [search, setSearch] = useState("");
  const [statusChange, setStatusChange] = useState(null); // {idx, newStatus, label}

  const filtered = useMemo(() => {
    const list = bookings.map((b, i) => ({...b, _idx: i}));
    if (!search || search === "+7") return list.reverse();
    const q = formatPhone(search);
    const ql = search.toLowerCase();
    return list.filter(b => (b.phone || "").includes(q) || (b.phone || "").includes(search) || (b.name || "").toLowerCase().includes(ql)).reverse();
  }, [bookings, search]);

  if (editIdx !== null) {
    const b = bookings[editIdx];
    return <EditAppBooking b={b} idx={editIdx} data={data} save={save} onClose={() => setEditIdx(null)} />;
  }

  return (<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:600}}>Брони приложений</h3>
      <button onClick={() => openModal("appBooking")} style={{background:"#ff6bff18",border:"1px solid #ff6bff40",borderRadius:8,color:"#ff6bff",padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Новая</button>
    </div>
    <PhoneInput value={search} onChange={setSearch} style={{...inp, marginBottom: 12}} />
    {confirmIdx !== null && <ConfirmModal msg="Удалить бронь приложения?" onConfirm={() => { const nb = [...bookings]; nb.splice(confirmIdx, 1); save({...data, appBookings: nb}); setConfirmIdx(null); }} onClose={() => setConfirmIdx(null)} />}
    {statusChange !== null && <ConfirmModal msg={`Изменить статус на «${statusChange.label}»?`} confirmText="Изменить" confirmColor="linear-gradient(135deg,#00aaff,#0088cc)" onConfirm={() => { const nb = [...bookings]; nb[statusChange.idx] = {...nb[statusChange.idx], status: statusChange.newStatus}; save({...data, appBookings: nb}); setStatusChange(null); }} onClose={() => setStatusChange(null)} />}
    {!filtered.length ? <div style={{color:"#555",padding:40,textAlign:"center"}}>{search && search !== "+7" ? "Ничего не найдено" : "Пока нет броней приложений"}</div> :
    filtered.map((b, i) => {
      const isInstalled = b.status === "installed" || b.status === "done";
      const nextStatus = isInstalled ? "pending" : "installed";
      const nextLabel = isInstalled ? "Ожидает" : "Установлена";
      const nextColor = isInstalled ? "#ff6bff" : "#00ff87";
      return (<div key={i} style={{background:"#111118",borderRadius:12,padding:"12px 16px",border:"1px solid #1a1a2a",marginBottom:8,borderLeft:`3px solid ${isInstalled ? "#00ff87" : "#ff6bff"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={() => setEditIdx(b._idx)}>
          <div>
            <div style={{fontSize:14,fontWeight:600}}>{b.name || "—"} · {b.phone || "—"}</div>
            <div style={{fontSize:12,color:"#666",marginTop:2}}>{b.date} · {b.qty || 1} прилож.{b.note ? ` · ${b.note}` : ""}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:isInstalled ? "#00ff8722" : "#ff6bff22",color:isInstalled ? "#00ff87" : "#ff6bff"}}>{isInstalled ? "Установлена" : "Ожидает"}</span>
            {b.amount > 0 && <div style={{fontSize:14,fontWeight:700,color:"#ff6bff",fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{fmtM(b.amount)}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={e => { e.stopPropagation(); setStatusChange({idx: b._idx, newStatus: nextStatus, label: nextLabel}); }} style={{background:nextColor+"22",border:"1px solid "+nextColor+"44",borderRadius:6,color:nextColor,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>→ {nextLabel}</button>
          <button onClick={e => { e.stopPropagation(); setEditIdx(b._idx); }} style={{background:"none",border:"1px solid #00aaff44",borderRadius:6,color:"#00aaff",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>✏️</button>
          <button onClick={e => { e.stopPropagation(); setConfirmIdx(b._idx); }} style={{background:"none",border:"1px solid #ff444444",borderRadius:6,color:"#ff4444",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>🗑</button>
        </div>
      </div>);
    })}
  </div>);
}

function AppBookingForm({onClose, onSave}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(fmtD(new Date()));
  const [pricePerApp, setPricePerApp] = useState(String(APP_PRICE));
  const [costPerApp, setCostPerApp] = useState(String(APP_COST));
  const amount = (Number(qty) || 1) * (Number(pricePerApp) || APP_PRICE);
  const cost = (Number(qty) || 1) * (Number(costPerApp) || APP_COST);
  const profit = amount - cost;

  return (<Modal onClose={onClose} title="📱 Бронь приложения"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e => setName(e.target.value)} style={inp} />
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp} />
    <label style={lbl}>Количество приложений</label><input type="number" value={qty} onChange={e => setQty(e.target.value)} style={inp} min="1" />
    <label style={lbl}>Цена за 1 прилож.</label><input type="number" value={pricePerApp} onChange={e => setPricePerApp(e.target.value)} style={inp} />
    <label style={lbl}>Себестоимость за 1 прилож.</label><input type="number" value={costPerApp} onChange={e => setCostPerApp(e.target.value)} style={inp} />
    <div style={{fontSize:13,color:"#888"}}>Сумма: <span style={{color:"#ff6bff",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(amount)}</span> · Прибыль: <span style={{color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(profit)}</span></div>
    <label style={lbl}>Примечание</label><input value={note} onChange={e => setNote(e.target.value)} style={inp} />
    <button onClick={() => onSave({phone, name, qty: Number(qty) || 1, note, date, amount, cost, status: "pending"})} style={{...btnG, background:"linear-gradient(135deg,#ff6bff,#cc44cc)"}}>Сохранить бронь</button>
  </div></Modal>);
}

function EditAppBooking({b, idx, data, save, onClose}) {
  const [phone, setPhone] = useState(b.phone || "");
  const [name, setName] = useState(b.name || "");
  const [qty, setQty] = useState(String(b.qty || 1));
  const [note, setNote] = useState(b.note || "");
  const [date, setDate] = useState(b.date);
  const [status, setStatus] = useState(b.status || "pending");
  const [pricePerApp, setPricePerApp] = useState(String(b.amount ? Math.round(b.amount / (b.qty || 1)) : APP_PRICE));
  const [costPerApp, setCostPerApp] = useState(String(b.cost ? Math.round(b.cost / (b.qty || 1)) : APP_COST));
  const amount = (Number(qty) || 1) * (Number(pricePerApp) || APP_PRICE);
  const cost = (Number(qty) || 1) * (Number(costPerApp) || APP_COST);
  const profit = amount - cost;

  return (<Modal onClose={onClose} title="✏️ Редактировать бронь прилож."><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Статус</label>
    <select value={status} onChange={e => setStatus(e.target.value)} style={inp}><option value="pending">Ожидает</option><option value="installed">Установлена</option></select>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e => setName(e.target.value)} style={inp} />
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp} />
    <label style={lbl}>Количество приложений</label><input type="number" value={qty} onChange={e => setQty(e.target.value)} style={inp} />
    <label style={lbl}>Цена за 1 прилож.</label><input type="number" value={pricePerApp} onChange={e => setPricePerApp(e.target.value)} style={inp} />
    <label style={lbl}>Себестоимость за 1 прилож.</label><input type="number" value={costPerApp} onChange={e => setCostPerApp(e.target.value)} style={inp} />
    <div style={{fontSize:13,color:"#888"}}>Сумма: <span style={{color:"#ff6bff",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(amount)}</span> · Прибыль: <span style={{color:"#00ff87",fontFamily:"'JetBrains Mono',monospace"}}>{fmtM(profit)}</span></div>
    <label style={lbl}>Примечание</label><input value={note} onChange={e => setNote(e.target.value)} style={inp} />
    <button onClick={() => { const nb = [...(data.appBookings||[])]; nb[idx] = {phone, name, qty: Number(qty)||1, note, date, amount, cost, status}; save({...data, appBookings: nb}); onClose(); }} style={{...btnG, background:"linear-gradient(135deg,#ff6bff,#cc44cc)"}}>Сохранить</button>
  </div></Modal>);
}

// ====== APPOINTMENTS / ЗАПИСИ ======
function AppointmentsView({data, save, openModal}) {
  const appts = data.appointments || [];
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [search, setSearch] = useState("");
  const [statusChange, setStatusChange] = useState(null);

  const stC = {pending: "#66ccff", done: "#00ff87", cancelled: "#ff4444"};
  const stL = {pending: "Ожидает", done: "Пришёл", cancelled: "Отменена"};

  const filtered = useMemo(() => {
    const list = appts.map((a, i) => ({...a, _idx: i}));
    if (!search || search === "+7") return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).reverse();
    const q = formatPhone(search);
    const ql = search.toLowerCase();
    return list.filter(a => (a.phone || "").includes(q) || (a.phone || "").includes(search) || (a.name || "").toLowerCase().includes(ql)).reverse();
  }, [appts, search]);

  if (editIdx !== null) {
    const a = appts[editIdx];
    return <EditAppointment a={a} idx={editIdx} data={data} save={save} onClose={() => setEditIdx(null)} />;
  }

  return (<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:600}}>Записи клиентов</h3>
      <button onClick={() => openModal("appointment")} style={{background:"#66ccff18",border:"1px solid #66ccff40",borderRadius:8,color:"#66ccff",padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Новая</button>
    </div>
    <PhoneInput value={search} onChange={setSearch} style={{...inp, marginBottom: 12}} />
    {confirmIdx !== null && <ConfirmModal msg="Удалить запись?" onConfirm={() => { const na = [...appts]; na.splice(confirmIdx, 1); save({...data, appointments: na}); setConfirmIdx(null); }} onClose={() => setConfirmIdx(null)} />}
    {statusChange !== null && <ConfirmModal msg={`Изменить статус на «${statusChange.label}»?`} confirmText="Изменить" confirmColor="linear-gradient(135deg,#00aaff,#0088cc)" onConfirm={() => { const na = [...appts]; na[statusChange.idx] = {...na[statusChange.idx], status: statusChange.newStatus}; save({...data, appointments: na}); setStatusChange(null); }} onClose={() => setStatusChange(null)} />}
    {!filtered.length ? <div style={{color:"#555",padding:40,textAlign:"center"}}>{search && search !== "+7" ? "Ничего не найдено" : "Пока нет записей"}</div> :
    filtered.map((a, i) => {
      const isPending = a.status === "pending" || !a.status;
      const nextSt = isPending ? "done" : a.status === "done" ? "cancelled" : "pending";
      const nextLbl = stL[nextSt];
      const nextClr = stC[nextSt];
      const curClr = stC[a.status || "pending"];
      return (<div key={i} style={{background:"#111118",borderRadius:12,padding:"12px 16px",border:"1px solid #1a1a2a",marginBottom:8,borderLeft:`3px solid ${curClr}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={() => setEditIdx(a._idx)}>
          <div>
            <div style={{fontSize:14,fontWeight:600}}>{a.name || "—"} · {a.phone || "—"}</div>
            <div style={{fontSize:12,color:"#666",marginTop:2}}>{a.date} · {a.time || "—"} · {a.purpose === "purchase" ? "Покупка" : a.purpose === "consultation" ? "Консультация" : a.purpose || "—"}</div>
            {a.note && <div style={{fontSize:11,color:"#555",marginTop:2}}>{a.note}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:curClr + "22",color:curClr}}>{stL[a.status || "pending"]}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          <button onClick={e => { e.stopPropagation(); setStatusChange({idx: a._idx, newStatus: nextSt, label: nextLbl}); }} style={{background:nextClr+"22",border:"1px solid "+nextClr+"44",borderRadius:6,color:nextClr,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>→ {nextLbl}</button>
          {a.phone&&<a href={waLink(a.phone)} target="_blank" rel="noopener" onClick={e=>e.stopPropagation()} style={{background:"#25D36622",border:"1px solid #25D36644",borderRadius:6,color:"#25D366",padding:"4px 10px",fontSize:11,cursor:"pointer",textDecoration:"none"}}>WhatsApp</a>}
          <button onClick={e => { e.stopPropagation(); const ns=[...(data.sales)]; ns.push({date:a.date,items:[{name:"Из записи",price:0}],amount:0,phone:a.phone||"",name:a.name||""}); const na=[...(data.appointments||[])]; na.splice(a._idx,1); save({...data,sales:ns,appointments:na}); }} style={{background:"#00ff8722",border:"1px solid #00ff8744",borderRadius:6,color:"#00ff87",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>→ Продажа</button>
          <button onClick={e => { e.stopPropagation(); const nr=[...(data.rentals)]; nr.push({date:a.date,phone:a.phone||"",lastName:a.name||"",productName:"—",amount:0,status:"active",returnDate:tomorrow(a.date),note:"Из записи"}); const na=[...(data.appointments||[])]; na.splice(a._idx,1); save({...data,rentals:nr,appointments:na}); }} style={{background:"#00aaff22",border:"1px solid #00aaff44",borderRadius:6,color:"#00aaff",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>→ Аренда</button>
          <button onClick={e => { e.stopPropagation(); setEditIdx(a._idx); }} style={{background:"none",border:"1px solid #00aaff44",borderRadius:6,color:"#00aaff",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>✏️</button>
          <button onClick={e => { e.stopPropagation(); setConfirmIdx(a._idx); }} style={{background:"none",border:"1px solid #ff444444",borderRadius:6,color:"#ff4444",padding:"4px 10px",fontSize:11,cursor:"pointer"}}>🗑</button>
        </div>
      </div>);
    })}
  </div>);
}

function AppointmentForm({selDate, onClose, onSave}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(selDate || fmtD(new Date()));
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("purchase");
  const [note, setNote] = useState("");

  return (<Modal onClose={onClose} title="📋 Новая запись"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
    <label style={lbl}>Время</label><input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} />
    <label style={lbl}>Что хотят</label>
    <select value={purpose} onChange={e => setPurpose(e.target.value)} style={inp}>
      <option value="purchase">Покупка</option>
      <option value="consultation">Консультация</option>
    </select>
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e => setName(e.target.value)} style={inp} />
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp} />
    <label style={lbl}>Примечание</label><input value={note} onChange={e => setNote(e.target.value)} style={inp} />
    <button onClick={() => onSave({phone, name, date, time, purpose, note, status: "pending"})} style={{...btnG, background:"linear-gradient(135deg,#66ccff,#3399cc)"}}>Сохранить запись</button>
  </div></Modal>);
}

function EditAppointment({a, idx, data, save, onClose}) {
  const [phone, setPhone] = useState(a.phone || "");
  const [name, setName] = useState(a.name || "");
  const [date, setDate] = useState(a.date || "");
  const [time, setTime] = useState(a.time || "");
  const [purpose, setPurpose] = useState(a.purpose || "purchase");
  const [note, setNote] = useState(a.note || "");
  const [status, setStatus] = useState(a.status || "pending");
  const [confirmDel, setConfirmDel] = useState(false);

  if (confirmDel) return <ConfirmModal msg="Удалить запись?" onConfirm={() => { const na = [...(data.appointments||[])]; na.splice(idx, 1); save({...data, appointments: na}); onClose(); }} onClose={() => setConfirmDel(false)} />;

  return (<Modal onClose={onClose} title="✏️ Редактировать запись"><div style={{display:"flex",flexDirection:"column",gap:12}}>
    <label style={lbl}>Статус</label>
    <select value={status} onChange={e => setStatus(e.target.value)} style={inp}><option value="pending">Ожидает</option><option value="done">Пришёл</option><option value="cancelled">Отменена</option></select>
    <label style={lbl}>Дата</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
    <label style={lbl}>Время</label><input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} />
    <label style={lbl}>Что хотят</label>
    <select value={purpose} onChange={e => setPurpose(e.target.value)} style={inp}><option value="purchase">Покупка</option><option value="consultation">Консультация</option></select>
    <label style={lbl}>Имя / Фамилия</label><input value={name} onChange={e => setName(e.target.value)} style={inp} />
    <label style={lbl}>Телефон</label><PhoneInput value={phone} onChange={setPhone} style={inp} />
    <label style={lbl}>Примечание</label><input value={note} onChange={e => setNote(e.target.value)} style={inp} />
    <button onClick={() => { const na = [...(data.appointments||[])]; na[idx] = {phone, name, date, time, purpose, note, status}; save({...data, appointments: na}); onClose(); }} style={{...btnG, background:"linear-gradient(135deg,#66ccff,#3399cc)"}}>Сохранить</button>
    <button onClick={() => setConfirmDel(true)} style={{...btnR, marginTop: 4}}>🗑 Удалить</button>
  </div></Modal>);
}

const lbl={fontSize:13,color:"#888"};
const inp={background:"#0a0a12",border:"1px solid #2a2a3a",borderRadius:10,color:"#e0e0e0",padding:"12px 14px",fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
const btnG={background:"linear-gradient(135deg,#00ff87,#00cc6a)",border:"none",borderRadius:10,color:"#000",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",width:"100%",marginTop:8};
const btnB={...btnG,background:"linear-gradient(135deg,#00aaff,#0088cc)"};
const btnY={...btnG,background:"linear-gradient(135deg,#ffaa00,#cc8800)"};
const btnR={background:"transparent",border:"1px solid #ff444466",borderRadius:10,color:"#ff4444",padding:"12px",fontSize:14,cursor:"pointer",width:"100%",textAlign:"center"};
const navBtn={background:"#1a1a2a",border:"none",color:"#ccc",width:36,height:36,borderRadius:"50%",fontSize:18,cursor:"pointer"};
