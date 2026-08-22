import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Role = "USER" | "ADMIN";
type User = { id: number; name: string; email: string; role: Role };
type Vehicle = { id: number; make: string; model: string; category: string; price: number; quantity: number };
type VehicleForm = Omit<Vehicle, "id">;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const blankVehicle: VehicleForm = { make: "", model: "", category: "", price: 0, quantity: 0 };

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem("user") ?? "null"));
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState({ make: "", model: "", category: "", minPrice: "", maxPrice: "" });
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<VehicleForm>(blankVehicle);

  const request = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }), ...options.headers } });
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(body?.message ?? "Request failed");
    return body;
  };

  const loadVehicles = async () => {
    if (!token) return;
    const params = new URLSearchParams(Object.entries(search).filter(([, value]) => value));
    try { const data = await request(`/api/vehicles/search?${params}`); setVehicles(data.vehicles); } catch (error) { setNotice((error as Error).message); }
  };

  useEffect(() => { loadVehicles(); }, [token]);
  const inventoryValue = useMemo(() => vehicles.reduce((total, item) => total + item.price * item.quantity, 0), [vehicles]);

  const auth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const data = await request(`/api/auth/${authMode}`, { method: "POST", body: JSON.stringify(values) });
      if (authMode === "register") { setNotice("Registration complete. Please log in."); setAuthMode("login"); return; }
      localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); setToken(data.token); setUser(data.user); setNotice(`Welcome back, ${data.user.name}.`);
    } catch (error) { setNotice((error as Error).message); }
  };

  const purchase = async (id: number) => { try { await request(`/api/vehicles/${id}/purchase`, { method: "POST" }); setNotice("Purchase recorded."); loadVehicles(); } catch (error) { setNotice((error as Error).message); } };
  const remove = async (id: number) => { if (!confirm("Delete this vehicle?")) return; try { await request(`/api/vehicles/${id}`, { method: "DELETE" }); setNotice("Vehicle deleted."); loadVehicles(); } catch (error) { setNotice((error as Error).message); } };
  const saveVehicle = async (event: FormEvent) => { event.preventDefault(); try { const path = editing ? `/api/vehicles/${editing.id}` : "/api/vehicles"; await request(path, { method: editing ? "PUT" : "POST", body: JSON.stringify(form) }); setNotice(editing ? "Vehicle updated." : "Vehicle added."); setEditing(null); setForm(blankVehicle); loadVehicles(); } catch (error) { setNotice((error as Error).message); } };
  const restock = async (id: number) => { const amount = Number(prompt("How many vehicles are arriving?", "1")); if (!amount) return; try { await request(`/api/vehicles/${id}/restock`, { method: "POST", body: JSON.stringify({ amount }) }); setNotice("Inventory restocked."); loadVehicles(); } catch (error) { setNotice((error as Error).message); } };
  const logout = () => { localStorage.clear(); setToken(""); setUser(null); setVehicles([]); setNotice("Signed out."); };

  if (!user) return <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.2fr_.8fr]"><section><p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-cyan-400">Driveway Inventory</p><h1 className="max-w-2xl text-5xl font-black leading-tight md:text-7xl">The smarter way to manage every drive.</h1><p className="mt-6 max-w-xl text-lg text-slate-400">A modern dealership inventory workspace for browsing, selling, and managing your vehicles in one place.</p></section><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl shadow-cyan-950/30"><div className="mb-6 flex gap-6 border-b border-slate-800"><button onClick={() => setAuthMode("login")} className={authMode === "login" ? "border-b-2 border-cyan-400 pb-3 font-semibold" : "pb-3 text-slate-400"}>Sign in</button><button onClick={() => setAuthMode("register")} className={authMode === "register" ? "border-b-2 border-cyan-400 pb-3 font-semibold" : "pb-3 text-slate-400"}>Register</button></div><form onSubmit={auth} className="space-y-4">{authMode === "register" && <input required name="name" placeholder="Full name" className="w-full"/>}<input required name="email" type="email" placeholder="Email address" className="w-full"/><input required name="password" type="password" minLength={8} placeholder="Password" className="w-full"/><button className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-300">{authMode === "login" ? "Sign in" : "Create account"}</button></form>{notice && <p className="mt-4 text-sm text-cyan-300">{notice}</p>}</section></main>;

  return <main className="min-h-screen"><header className="border-b border-slate-800 bg-slate-950/80 px-6 py-5 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between"><div><p className="text-lg font-black tracking-tight">DRIVEWAY</p><p className="text-xs text-slate-400">Inventory command center</p></div><div className="flex items-center gap-4 text-sm"><span className="hidden text-slate-400 sm:block">{user.name} · <b className="text-cyan-300">{user.role}</b></span><button onClick={logout} className="rounded-lg border border-slate-700 px-3 py-2 hover:border-cyan-400">Sign out</button></div></div></header><div className="mx-auto max-w-7xl px-6 py-8"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-400">Live inventory</p><h1 className="mt-2 text-4xl font-black">Find the right vehicle.</h1></div><div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm"><span className="text-slate-400">Inventory value </span><b>${inventoryValue.toLocaleString()}</b></div></div>{notice && <p className="mb-5 rounded-lg border border-cyan-900 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-200">{notice}</p>}<section className="mb-7 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-5"><input placeholder="Make" value={search.make} onChange={e => setSearch({ ...search, make: e.target.value })}/><input placeholder="Model" value={search.model} onChange={e => setSearch({ ...search, model: e.target.value })}/><input placeholder="Category" value={search.category} onChange={e => setSearch({ ...search, category: e.target.value })}/><input type="number" placeholder="Min price" value={search.minPrice} onChange={e => setSearch({ ...search, minPrice: e.target.value })}/><div className="flex gap-2"><input type="number" placeholder="Max price" value={search.maxPrice} onChange={e => setSearch({ ...search, maxPrice: e.target.value })}/><button onClick={loadVehicles} className="rounded-lg bg-cyan-400 px-4 font-bold text-slate-950">Search</button></div></section>{user.role === "ADMIN" && <section className="mb-8 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5"><h2 className="mb-4 font-bold text-amber-200">{editing ? "Edit vehicle" : "Add vehicle"}</h2><form onSubmit={saveVehicle} className="grid gap-3 md:grid-cols-5">{(["make", "model", "category", "price", "quantity"] as const).map(key => <input key={key} required type={key === "price" || key === "quantity" ? "number" : "text"} placeholder={key} value={form[key]} onChange={e => setForm({ ...form, [key]: key === "price" || key === "quantity" ? Number(e.target.value) : e.target.value })}/>)}<button className="rounded-lg bg-amber-300 px-4 py-2 font-bold text-slate-950">Save</button></form></section>}<section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{vehicles.map(item => <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><div className="mb-8 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{item.category}</p><h2 className="mt-2 text-2xl font-black">{item.make} {item.model}</h2></div><span className={item.quantity ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300" : "rounded-full bg-rose-400/10 px-3 py-1 text-xs font-bold text-rose-300"}>{item.quantity ? `${item.quantity} in stock` : "Sold out"}</span></div><p className="mb-5 text-3xl font-black">${item.price.toLocaleString()}</p><div className="flex flex-wrap gap-2"><button disabled={!item.quantity} onClick={() => purchase(item.id)} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300">Purchase</button>{user.role === "ADMIN" && <><button onClick={() => { setEditing(item); setForm(item); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-lg border border-slate-600 px-3 py-2 text-sm">Edit</button><button onClick={() => restock(item.id)} className="rounded-lg border border-slate-600 px-3 py-2 text-sm">Restock</button><button onClick={() => remove(item.id)} className="rounded-lg border border-rose-900 px-3 py-2 text-sm text-rose-300">Delete</button></>}</div></article>)}</section>{!vehicles.length && <p className="py-20 text-center text-slate-500">No vehicles match these filters.</p>}</div></main>;
}

export default App;
