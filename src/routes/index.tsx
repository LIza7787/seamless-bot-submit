import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, type FormEvent } from "react";
import {
  Activity, ArrowRight, Bot, Check, ChevronRight, Cloud, CreditCard,
  Github, Globe2, LayoutDashboard, LogOut, Menu, Search, Server, ShieldCheck, Sparkles,
  Twitter, X, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendTelegramOrder, isValidContact } from "@/lib/orders.functions";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "OxynHost | High-Performance Cloud Hosting" },
    { name: "description", content: "Deploy websites and applications in seconds with NVMe KVM hosting, DDoS protection, and AI diagnostics." },
    { property: "og:title", content: "OxynHost | High-Performance Cloud Hosting" },
    { property: "og:description", content: "Fast, secure cloud infrastructure without setup complexity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

type PlanName = "Website Hosting" | "Virtual Servers" | "Dedicated Servers";
type Service = { id: string; plan: PlanName; label: string; ip: string; cpu: number; ram: number };

const plans: Array<{ name: PlanName; price: number; description: string; icon: typeof Cloud; features: string[]; popular?: boolean }> = [
  { name: "Website Hosting", price: 1.99, icon: Globe2, description: "Fast, managed hosting for personal and commercial sites.", features: ["Managed by Plesk", "High-performance storage", "DDoS protected"] },
  { name: "Virtual Servers", price: 2.99, icon: Server, popular: true, description: "Flexible compute with complete control and instant scaling.", features: ["KVM virtualization", "Automated backups", "Full root control"] },
  { name: "Dedicated Servers", price: 29.99, icon: Activity, description: "Bare-metal power managed through the TenantOS control panel.", features: ["Dedicated enterprise hardware", "TenantOS control panel", "Built for extreme demands"] },
];

const tlds = [{ ext: ".com", price: "£8.99/yr" }, { ext: ".io", price: "£24.99/yr" }, { ext: ".dev", price: "£10.99/yr" }, { ext: ".uk", price: "£4.99/yr" }];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Index() {
  const sendOrder = useServerFn(sendTelegramOrder);
  const [yearly, setYearly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("Virtual Servers");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [sending, setSending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [services, setServices] = useState<Service[]>([]);
  const challenge = useMemo(() => ({ a: 4 + Math.floor(Math.random() * 4), b: 2 + Math.floor(Math.random() * 5) }), [modalOpen]);

  const openOrder = (plan: PlanName) => { setSelectedPlan(plan); setCaptcha(""); setModalOpen(true); };
  const openAuth = (tab: string) => { setAuthTab(tab); setAuthOpen(true); };
  const submitAuth = (event: FormEvent) => {
    event.preventDefault();
    setIsLoggedIn(true); setAuthOpen(false);
    toast.success("Welcome back!");
  };
  const logOut = () => { setIsLoggedIn(false); toast("You have been logged out."); };

  const checkDomain = (event: FormEvent) => {
    event.preventDefault();
    const clean = domain.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,62}\.[a-z]{2,}$/.test(clean)) {
      toast.error("Enter a valid domain name.");
      return;
    }
    toast.success(`${clean} is available!`, {
      description: "Secure it before someone else does.",
      action: { label: "Order now", onClick: () => openOrder("Website Hosting") },
    });
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (Number(captcha) !== challenge.a + challenge.b) {
      toast.error("That answer isn’t correct. Please try again.");
      return;
    }
    if (!isValidContact(contact)) {
      toast.error("Enter a valid email or Telegram username (e.g. alex@company.com or @alex).");
      return;
    }
    setSending(true);
    try {
      await sendOrder({ data: { plan: selectedPlan, name, contact } });
      setServices((prev) => [...prev, {
        id: `${Date.now()}`,
        plan: selectedPlan,
        label: domain.trim().toLowerCase() || `${selectedPlan.toLowerCase().replace(/\s+/g, "-")}-${prev.length + 1}`,
        ip: `185.${40 + prev.length}.${12 + prev.length * 7}.${100 + prev.length * 3}`,
        cpu: 12 + Math.floor(Math.random() * 40),
        ram: 20 + Math.floor(Math.random() * 45),
      }]);
      toast.success("Order sent successfully! We will contact you shortly.");
      setModalOpen(false); setName(""); setContact(""); setCaptcha("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your order. Please try again.");
    } finally { setSending(false); }
  };

  return <div className="min-h-screen overflow-hidden bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-2 text-lg font-semibold tracking-tight"><span className="text-primary drop-shadow-[0_0_12px_var(--primary)]">⚡</span> OxynHost</a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex" aria-label="Main navigation">
          {["Services", "Domain Check", "Pricing", "AI Diagnostics", "Docs"].map((item) => <a key={item} href={item === "Pricing" ? "#pricing" : item === "Domain Check" ? "#domain" : item === "Services" ? "#services" : "#features"} className="transition-colors hover:text-foreground">{item}</a>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="glass" className="h-10 gap-2.5 pl-1.5 pr-3">
                <span className="flex size-7 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-xs font-semibold text-primary">AM</span>
                Alex M.
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => scrollTo("services")}><LayoutDashboard /> My Services / Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => scrollTo("pricing")}><CreditCard /> Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut}><LogOut /> Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <>
            <Button variant="ghost" onClick={() => openAuth("login")}>Log In</Button>
            <Button variant="glow" onClick={() => openAuth("signup")}>Sign Up <ArrowRight /></Button>
          </>}
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">
        {["Services", "Domain Check", "Pricing", "AI Diagnostics", "Docs"].map((item) => <a key={item} href={item === "Pricing" ? "#pricing" : item === "Domain Check" ? "#domain" : item === "Services" ? "#services" : "#features"} onClick={() => setMenuOpen(false)} className="block py-3 text-sm text-muted-foreground">{item}</a>)}
        <div className="mt-3 flex gap-2">{isLoggedIn
          ? <Button variant="glass" className="flex-1" onClick={() => { setMenuOpen(false); logOut(); }}>Log Out</Button>
          : <><Button variant="glass" className="flex-1" onClick={() => { setMenuOpen(false); openAuth("login"); }}>Log In</Button><Button variant="glow" className="flex-1" onClick={() => { setMenuOpen(false); openAuth("signup"); }}>Sign Up</Button></>}</div>
      </nav>}
    </header>

    <main id="top">
      <section className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-20 px-5 pb-24 pt-36 lg:grid-cols-2 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 grid-surface opacity-25" />
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-[3.4rem]">High-Performance Cloud Hosting.</h1>
          <p className="mt-8 text-base leading-8 text-muted-foreground sm:text-lg">Blazing fast VPS and web hosting backed by 24/7 support.</p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button variant="glow" size="lg" className="h-12 px-7" onClick={() => openOrder("Virtual Servers")}>Get Started <ArrowRight /></Button>
            <Button variant="glass" size="lg" className="h-12 px-7" onClick={() => scrollTo("pricing")}>View Plans</Button>
          </div>
        </div>

        <div id="domain" className="relative z-10 mx-auto w-full max-w-md scroll-mt-28">
          <div className="pointer-events-none absolute -inset-14 bg-primary/10 blur-3xl opacity-60" />
          <div className="glass-panel relative rounded-2xl border-primary/20 p-8 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10"><Globe2 className="size-5 text-primary" /></span>
              <h2 className="text-lg sm:text-xl">Find your perfect domain</h2>
            </div>
            <form onSubmit={checkDomain} className="mt-7">
              <div className="relative">
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Enter domain, e.g. project.oxyn" className="h-13 border-border/70 bg-background/50 pr-28 pl-4" aria-label="Domain name" />
                <Button type="submit" variant="glow" size="sm" className="absolute right-2 top-1/2 h-9 -translate-y-1/2 px-4">Check <ChevronRight /></Button>
              </div>
            </form>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {tlds.map((t) => <button key={t.ext} type="button" onClick={() => setDomain((d) => `${(d.split(".")[0] || "project")}${t.ext}`)} className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-xs transition hover:border-primary/40 hover:bg-primary/5">
                <span className="font-medium text-foreground">{t.ext}</span><span className="text-muted-foreground">{t.price}</span>
              </button>)}
            </div>
          </div>
        </div>
      </section>

      {isLoggedIn && <section id="services" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-8 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><span className="text-xs font-medium uppercase tracking-widest text-primary">Client area</span><h2 className="mt-3 text-2xl sm:text-3xl">My Services</h2></div>
          <span className="text-sm text-muted-foreground">Signed in as Alex M.</span>
        </div>
        {services.length === 0
          ? <div className="glass-panel flex flex-col items-center rounded-2xl px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10"><Cloud className="size-6 text-primary" /></span>
              <h3 className="mt-7 text-xl sm:text-2xl">No active services or domains yet</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">Search for an available domain or pick a hosting plan to launch your project.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="glow" className="h-11 px-6" onClick={() => scrollTo("domain")}><Search /> Search &amp; Rent a Domain</Button>
                <Button variant="glass" className="h-11 px-6" onClick={() => scrollTo("pricing")}><Zap /> Explore Hosting Plans</Button>
              </div>
            </div>
          : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((s) => <article key={s.id} className="glass-panel rounded-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="text-lg font-semibold">{s.plan}</h3><p className="mt-1 text-sm text-muted-foreground">{s.label}</p></div>
                <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success"><span className="size-1.5 rounded-full bg-success" /> Active</span>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">IP address <span className="ml-1 font-medium text-foreground">{s.ip}</span></p>
              <div className="mt-6 space-y-4">
                <div><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>CPU</span><span>{s.cpu}%</span></div><Progress value={s.cpu} className="h-1.5" /></div>
                <div><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>RAM</span><span>{s.ram}%</span></div><Progress value={s.ram} className="h-1.5" /></div>
              </div>
            </article>)}</div>}
      </section>}

      <section className="mx-auto max-w-7xl px-5 pt-12 lg:px-8"><div className="glass-panel grid rounded-lg sm:grid-cols-2 lg:grid-cols-4">{[["99.99%", "Uptime SLA"], ["< 8ms", "Global Latency"], ["120K+", "Active Projects Hosted"], ["24/7/365", "Expert Support"]].map(([value,label], i) => <div key={label} className={`p-6 text-center ${i ? "border-t border-border sm:border-l sm:border-t-0" : ""}`}><strong className="font-display text-2xl font-semibold tracking-tight text-foreground">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{label}</span></div>)}</div></section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <div className="mb-12 max-w-2xl"><span className="text-xs font-medium uppercase tracking-widest text-primary">Infrastructure, evolved</span><h2 className="mt-4 text-3xl sm:text-4xl">Built on Enterprise-Grade Hardware.</h2><p className="mt-4 text-muted-foreground">A resilient platform engineered for speed, security, and intelligent operations.</p></div>
        <div className="grid gap-4 md:grid-cols-3">{[
          { Icon: Server, title: "KVM Virtualization", text: "Enterprise-grade hardware VPS for general purpose computing with automated backups." },
          { Icon: ShieldCheck, title: "Robust Anti-DDoS", text: "Continuous real-time traffic filtering with automatic mitigation." },
          { Icon: Bot, title: "Oxyn AI Diagnostics", text: "Built-in AI log analyzer for zero-downtime server performance optimization." },
        ].map(({ Icon, title, text }) => <article key={title} className="group glass-panel rounded-lg p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/30"><div className="mb-8 flex size-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10"><Icon className="size-5 text-primary"/></div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p><div className="mt-8 h-px w-12 bg-primary/50 transition-all group-hover:w-24"/></article>)}</div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-y border-border bg-card/20 py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><span className="text-xs font-medium uppercase tracking-widest text-primary">Simple pricing</span><h2 className="mt-4 text-3xl sm:text-4xl">Affordable &amp; Transparent Infrastructure.</h2><p className="mt-4 text-muted-foreground">High performance enterprise hardware without hidden fees.</p></div><div className="inline-flex w-fit items-center rounded-md border border-border bg-background p-1" aria-label="Billing period"><Button variant={!yearly ? "secondary" : "ghost"} size="sm" onClick={() => setYearly(false)}>Monthly</Button><Button variant={yearly ? "secondary" : "ghost"} size="sm" onClick={() => setYearly(true)}>Yearly <span className="text-primary">Save 20%</span></Button></div></div>
        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">{plans.map((plan) => { const price = yearly ? plan.price * .8 : plan.price; const Icon = plan.icon; return <article key={plan.name} className={`relative flex flex-col rounded-lg border p-7 transition duration-300 hover:-translate-y-1 ${plan.popular ? "border-primary/60 bg-primary/5 shadow-[var(--shadow-glow)]" : "border-border bg-card/50"}`}>{plan.popular && <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Popular</span>}<Icon className="size-6 text-primary"/><h3 className="mt-7 text-xl font-semibold">{plan.name}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-muted-foreground">{plan.description}</p><div className="my-7"><span className="text-sm text-muted-foreground">Starting from </span><strong className="text-4xl">£{price.toFixed(2)}</strong><span className="text-sm text-muted-foreground">/mo</span>{yearly && <span className="mt-1 block text-xs text-primary">Billed £{(price * 12).toFixed(2)} yearly</span>}</div><ul className="mb-8 space-y-3">{plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4 text-primary"/>{f}</li>)}</ul><Button variant={plan.popular ? "glow" : "glass"} className="mt-auto w-full" onClick={() => openOrder(plan.name)}>Order Now <ArrowRight /></Button></article>})}</div>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="relative overflow-hidden rounded-lg border border-primary/20 bg-primary/10 px-6 py-16 text-center shadow-[var(--shadow-glow)]"><Sparkles className="mx-auto mb-5 size-7 text-primary"/><h2 className="text-3xl sm:text-4xl">Ready to migrate to OxynHost?</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Move faster on infrastructure built to disappear into the background.</p><Button variant="glow" size="lg" className="mt-8" onClick={() => openOrder("Virtual Servers")}>Get Started Now <ArrowRight /></Button></div></section>
    </main>

    <footer className="border-t border-border"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8"><div><a href="#top" className="text-lg font-semibold tracking-tight"><span className="text-primary">⚡</span> OxynHost</a><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Cloud infrastructure without the operational drag.</p></div>{[["Platform", "Services", "Pricing", "Domain Check"], ["Resources", "Documentation", "Status", "AI Diagnostics"], ["Company", "About", "Contact", "Legal"]].map(([heading,...links]) => <div key={heading}><h3 className="text-sm font-semibold">{heading}</h3><div className="mt-4 space-y-3">{links.map(l => <a key={l} href={l === "Pricing" ? "#pricing" : l === "Domain Check" ? "#domain" : "#features"} className="block text-sm text-muted-foreground hover:text-foreground">{l}</a>)}</div></div>)}</div><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8"><span>© 2026 OxynHost Inc. All rights reserved.</span><div className="flex gap-2"><Button variant="ghost" size="icon" aria-label="GitHub"><Github/></Button><Button variant="ghost" size="icon" aria-label="Telegram"><Zap/></Button><Button variant="ghost" size="icon" aria-label="Twitter"><Twitter/></Button></div></div></footer>

    <Dialog open={authOpen} onOpenChange={setAuthOpen}><DialogContent className="glass-panel max-w-sm border-primary/20">
      <DialogHeader><DialogTitle className="text-2xl">Welcome to OxynHost</DialogTitle><DialogDescription>Access your dashboard, services, and billing.</DialogDescription></DialogHeader>
      <Tabs value={authTab} onValueChange={setAuthTab} className="mt-2">
        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Log In</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
        <TabsContent value="login">
          <form onSubmit={submitAuth} className="mt-5 space-y-4">
            <label className="block text-sm font-medium">Email<Input required type="email" className="mt-2 h-11" placeholder="alex@company.com" /></label>
            <label className="block text-sm font-medium">Password<Input required type="password" minLength={6} className="mt-2 h-11" placeholder="••••••••" /></label>
            <Button type="submit" variant="glow" className="h-11 w-full">Log In <ArrowRight /></Button>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form onSubmit={submitAuth} className="mt-5 space-y-4">
            <label className="block text-sm font-medium">Full name<Input required minLength={2} className="mt-2 h-11" placeholder="Alex Morgan" /></label>
            <label className="block text-sm font-medium">Email<Input required type="email" className="mt-2 h-11" placeholder="alex@company.com" /></label>
            <label className="block text-sm font-medium">Password<Input required type="password" minLength={6} className="mt-2 h-11" placeholder="••••••••" /></label>
            <Button type="submit" variant="glow" className="h-11 w-full">Create Account <ArrowRight /></Button>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent></Dialog>

    <Dialog open={modalOpen} onOpenChange={setModalOpen}><DialogContent className="glass-panel max-w-md border-primary/20"><DialogHeader><DialogTitle className="text-2xl">Launch with OxynHost</DialogTitle><DialogDescription>Tell us where to reach you. Our team will respond shortly.</DialogDescription></DialogHeader><form onSubmit={submitOrder} className="mt-3 space-y-5"><label className="block text-sm font-medium">Selected plan<Select value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanName)}><SelectTrigger className="mt-2 h-11"><SelectValue/></SelectTrigger><SelectContent>{plans.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}</SelectContent></Select></label><label className="block text-sm font-medium">Customer name<Input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11" placeholder="Alex Morgan" /></label><label className="block text-sm font-medium">Email or Telegram username<Input required minLength={3} maxLength={255} value={contact} onChange={(e) => setContact(e.target.value)} className="mt-2 h-11" placeholder="alex@company.com or @alex" /></label><label className="block text-sm font-medium">What is {challenge.a} + {challenge.b}?<Input required inputMode="numeric" pattern="[0-9]*" value={captcha} onChange={(e) => setCaptcha(e.target.value)} className="mt-2 h-11" placeholder="Your answer" /></label><Button type="submit" variant="glow" className="h-11 w-full" disabled={sending}>{sending ? "Sending order..." : "Send Order"} {!sending && <ArrowRight/>}</Button></form></DialogContent></Dialog>
  </div>;
}
