"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

function KaTeX({ math }) {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: true });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ResearchPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 md:px-8 space-y-16 animate-in fade-in duration-700">

      {/* Title Section */}
      <div className="text-center space-y-4">
        <h1 className="font-black text-3xl md:text-5xl lg:text-6xl text-white tracking-tighter">
          Introducing Nexus
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-300 text-sm md:text-base">
            By Siddhartha Bhattarai
          </p>
          
        </div>
      </div>

      {/* 1. What is Nexus */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          What is Nexus?
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Nexus is a self-learning generative workspace built to solve the &quot;information overload&quot;
          faced by CSIT students in Nepal. Unlike static dashboards, it predicts your needs using
          Online Reinforcement Learning, pre-rendering components before you even ask for them.
        </p>
      </div>

      {/* 2. How did we get here */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          How did we get here?
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          It all started when we came across Cursor&apos;s research blog on improving Cursor Tab with Online RL.
          They described how they used reinforcement learning to predict code completions and learn
          from acceptance rates in real time. That got us thinking — what if we applied the same
          Bellman equation-based approach, not to code, but to entire UI components? Instead of
          predicting the next line, we could predict which tool or view a developer actually needs next.
          Instead of learning from code acceptances, we could learn from real human validation.
          That shift in thinking is where Nexus began.
        </p>
      </div>

      {/* 3. Mathematical Foundation */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          Mathematical Foundation
        </h1>
        <div className="space-y-4">
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            The core engine uses the <span className="text-white font-semibold">Q-Learning Update Rule</span> to value your interactions.
            Fast approval of a tool yields a reward of <span className="text-blue-300 font-mono">r<sub>t</sub> = +3</span>, while rejection results in <span className="text-blue-300 font-mono">r<sub>t</sub> = -1</span>.
          </p>
          <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-blue-300 overflow-x-auto flex justify-center">
            <KaTeX math="Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \left[ r_t + \gamma \max_{a} Q(s_{t+1}, a) - Q(s_t, a_t) \right]" />
          </div>
        </div>
      </div>

      {/* 4. State Representation */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          State Representation
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          We encode the user&apos;s current environment into a state vector that the Q-Learning agent reads
          before making a prediction. Every single thing happening on your screen at that moment gets
          compressed into five numbers.
        </p>
        <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-blue-300 overflow-x-auto flex justify-center">
          <KaTeX math="S_t = [h,\; d,\; c_{\text{last}},\; \Delta t,\; p]" />
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-blue-300 font-mono text-sm min-w-[60px]">h</span>
            <span className="text-slate-400 text-sm">Hour of the day. The agent learns that 9 AM on a Monday looks very different from 2 AM on a Friday.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-300 font-mono text-sm min-w-[60px]">d</span>
            <span className="text-slate-400 text-sm">Day of the week. Patterns repeat on a weekly cycle for most students.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-300 font-mono text-sm min-w-[60px]">c<sub>last</sub></span>
            <span className="text-slate-400 text-sm">The last 3 components you used, hashed into a single integer. We hash it for two reasons: it gives us a fixed-size numeric representation instead of raw strings, and comparing integers is a lot faster than comparing string arrays.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-300 font-mono text-sm min-w-[60px]">△t</span>
            <span className="text-slate-400 text-sm">Seconds since your last interaction. If you&apos;ve been idle for a while, the agent knows you might need a nudge.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-300 font-mono text-sm min-w-[60px]">p</span>
            <span className="text-slate-400 text-sm">Workspace density — how many components are currently active divided by the max capacity. Tells the agent how cluttered your space already is.</span>
          </div>
        </div>
      </div>

      {/* 5. The Learning Loop */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          The Learning Loop
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 border border-white/5 rounded-lg">
            <div className="text-green-400 font-bold">+3</div>
            <div className="text-[10px] text-slate-500 uppercase mt-1">Perfect Prediction</div>
          </div>
          <div className="p-4 border border-white/5 rounded-lg">
            <div className="text-blue-400 font-bold">+1</div>
            <div className="text-[10px] text-slate-500 uppercase mt-1">Edited Approval</div>
          </div>
          <div className="p-4 border border-white/5 rounded-lg">
            <div className="text-red-400 font-bold">-1</div>
            <div className="text-[10px] text-slate-500 uppercase mt-1">Direct Reject</div>
          </div>
          <div className="p-4 border border-white/5 rounded-lg">
            <div className="text-yellow-400 font-bold">-0.5</div>
            <div className="text-[10px] text-slate-500 uppercase mt-1">Ignored Pattern</div>
          </div>
        </div>
      </div>

      {/* 6. The Logic Gate Layer */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          The Logic Gate Layer
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          AI-generated UI can hallucinate. It might render something that looks right but completely
          breaks the workflow. To prevent that, every component Nexus generates has to pass through
          Logic Gate before it ever hits your screen. It&apos;s a validation layer with three rules.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-black/30 rounded-lg border border-white/5">
            <p className="text-white text-sm font-semibold mb-1">Draft Mode</p>
            <p className="text-slate-400 text-sm">The component first renders at 40% opacity with a confidence score attached. You can see it&apos;s there, but it&apos;s clearly not confirmed yet.</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg border border-white/5">
            <p className="text-white text-sm font-semibold mb-1">Confidence Threshold</p>
            <p className="text-slate-400 text-sm">Nothing becomes visible at full opacity unless the confidence score is above 0.65. Below that, it simply doesn&apos;t appear. That&apos;s the gate.</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg border border-white/5">
            <p className="text-white text-sm font-semibold mb-1">Auto Approve</p>
            <p className="text-slate-400 text-sm">If the confidence crosses 0.90, the component fades in on its own after a 5 second countdown. Both conditions have to be true at the same time — high confidence AND the timer elapsed. Neither one alone is enough.</p>
          </div>
        </div>
      </div>

      {/* 7. System Architecture */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          System Architecture
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          The whole system is a feedback loop. The frontend watches what you do, sends that signal
          through Logic Gate, the backend updates the Q-Learning agent, the agent writes new state
          into Postgres, and then uses that state to ask Tambo SDK to generate the next component.
          That component renders back in the frontend — and the loop starts again.
        </p>
        <div className="space-y-2">
          {[
            { from: "User Interaction", arrow: "→", to: "Next.js Frontend" },
            { from: "Next.js Frontend", arrow: "→", to: "LogicGate Wrapper" },
            { from: "LogicGate Wrapper", arrow: "→ Feedback →", to: "FastAPI Backend" },
            { from: "FastAPI Backend", arrow: "→", to: "Q-Learning Agent" },
            { from: "Q-Learning Agent", arrow: "↔", to: "PostgreSQL DB" },
            { from: "Q-Learning Agent", arrow: "→ Prediction →", to: "Tambo SDK" },
            { from: "Tambo SDK", arrow: "→ Render →", to: "Next.js Frontend" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
              <span className="text-blue-300 font-mono text-xs text-right min-w-[140px]">{step.from}</span>
              <span className="text-slate-600 font-mono text-xs">{step.arrow}</span>
              <span className="text-slate-300 font-mono text-xs">{step.to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Tech Stack */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          Tech Stack
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Frontend", items: "Next.js, ShadCN UI, Tailwind CSS, Framer Motion" },
            { label: "AI / Generative", items: "Tambo SDK (@tambo-ai/react)" },
            { label: "Backend", items: "Python, FastAPI, Pydantic, Uvicorn" },
            { label: "Intelligence", items: "Custom Online RL Agent (Q-Learning)" },
            { label: "Database", items: "PostgreSQL — State & Q-Table Persistence" },
            { label: "Real Time", items: "WebSockets — Instant UI state pushing" },
            { label: "DevOps", items: "Docker, Docker Compose" },
          ].map((tech, i) => (
            <div key={i} className="p-4 bg-black/30 rounded-lg border border-white/5">
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-1">{tech.label}</p>
              <p className="text-slate-400 text-sm">{tech.items}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Getting Started */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest font-mono">
          Wanna Get Started?
        </h1>
        <div className="space-y-6">
          <div>
            <p className="text-white text-sm font-semibold mb-2">Clone the repo</p>
            <div className="p-4 bg-black/40 rounded-lg border border-white/5">
              <pre className="text-green-400 font-mono text-xs overflow-x-auto">
{`git clone https://github.com/yourusername/nexus
cd nexus`}
              </pre>
            </div>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-2">Set up your environment</p>
            <p className="text-slate-400 text-sm mb-2">Create a <span className="text-blue-300 font-mono">.env</span> file in the root:</p>
            <div className="p-4 bg-black/40 rounded-lg border border-white/5">
              <pre className="text-green-400 font-mono text-xs overflow-x-auto">
{`TAMBO_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/nexus`}
              </pre>
            </div>
          </div>
          
        </div>
      </div>

      <footer className="text-center pt-20">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
          Adaptive Canvas // CSIT PHASE 04 // 2026
        </p>
        <p className="text-slate-600 text-xs mt-3">Made with ❤️ in Nepal for the WeMakeDevs Community</p>
      </footer>
    </div>
  );
}
