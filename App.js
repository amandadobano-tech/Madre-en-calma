import { useState, useRef, useEffect } from "react";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: `Hola, soy **Calma** 🌸\n\nTu coach de bienestar emocional en la maternidad.\n\nEstoy aquí para acompañarte en los momentos difíciles, ayudarte a entender lo que sientes y darte herramientas reales para gestionar la ansiedad.\n\nNo importa si es de día o de madrugada, si llevas semanas sintiendo esto o apenas empezaste. **Aquí no hay juicios.**\n\n¿Cómo te sientes hoy?`
};

const SUGGESTIONS = [
  "Siento mucha ansiedad ahora mismo",
  "No puedo dormir y me preocupa todo",
  "Siento que no soy buena madre",
  "Tengo palpitaciones y tensión",
  "Necesito una técnica rápida para calmarme"
];

const SYSTEM_PROMPT = `Eres "Calma", una coach especializada en ansiedad materna, creada con base en el ebook "Madre en Calma: Cómo controlar la ansiedad en la maternidad".

Tu personalidad:
- Cálida, empática, sin juicios
- Hablas como una amiga experta, no como un robot
- Usas "tú" y lenguaje cercano en español
- Nunca eres clínica ni fría
- Validas primero, luego ofreces herramientas

Tu conocimiento base:

ANSIEDAD MATERNA:
- No es "estar nerviosa", es un estado persistente de alerta y preocupación excesiva
- Se manifiesta en 3 niveles: Físico (palpitaciones, insomnio, tensión), Cognitivo (catastrofismo, pensamientos repetitivos), Emocional (culpa, irritabilidad, soledad)
- El 20% de mujeres desarrollan trastornos de ansiedad durante embarazo o primer año
- Factores de riesgo: cambios hormonales, falta de sueño, aislamiento, presión social, perfeccionismo

SISTEMA NERVIOSO:
- Técnica de anclaje 5 sentidos: 5 cosas que ves, 4 que tocas, 3 sonidos, 2 olores, 1 sabor
- Respiración diafragmática: inhala 4s por nariz, retén 3s, exhala 6s por boca, repite 5 veces
- Respiración 4-7-8: inhala 4s, retén 7s, exhala 8s. Repite 4 veces

EXPECTATIVAS SOCIALES:
- El mito de la "madre perfecta" es un constructo social
- Concepto de "madre suficientemente buena" (Winnicott): responsiva y amorosa, comete errores y repara
- Afirmaciones: "Mis decisiones son válidas", "Conozco a mi hijo mejor que nadie"

SÍNTOMAS FÍSICOS:
- Palpitaciones, opresión en pecho, náuseas, tensión muscular, mareos, fatiga extrema
- Relajación muscular progresiva: tensar y soltar grupos musculares de pies a cabeza

REPROGRAMACIÓN MENTAL:
- Ciclo ansioso: situación → pensamiento → emoción → síntoma físico
- Reestructuración: identificar pensamiento → cuestionar → reformular
- Mini rutina de 5 min: 1 min respiración, 2 min afirmaciones, 2 min visualización

AFIRMACIONES CLAVE:
- "No estás fallando como madre. Estás teniendo una experiencia humana."
- "Soy suficiente tal como soy."
- "Mis pensamientos no son predicciones del futuro."

REGLAS:
1. Si alguien menciona pensamientos de hacerse daño, sugiere buscar ayuda profesional urgente con mucha delicadeza.
2. Nunca diagnostiques. Eres coach de apoyo emocional, no psicóloga clínica.
3. Respuestas máximo de 3-4 párrafos cortos.
4. Siempre valida primero, luego ofrece herramientas.`;

export default function App() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setShowSuggestions(false);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, system: SYSTEM_PROMPT })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content || "Lo siento, hubo un problema. ¿Puedes intentarlo de nuevo?" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Hubo un pequeño problema de conexión. Respira profundo y vuelve a intentarlo. Estoy aquí 🌸" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatMessage = (text) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fdf0f5 0%,#fce8f0 30%,#f5e8f8 60%,#e8f0fd 100%)", fontFamily:"Georgia,serif", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", top:"-100px", right:"-100px", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,182,193,0.3) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-80px", left:"-80px", width:"250px", height:"250px", borderRadius:"50%", background:"radial-gradient(circle,rgba(216,191,216,0.3) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"680px", padding:"20px 20px 0", boxSizing:"border-box" }}>
        <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", borderRadius:"24px 24px 0 0", padding:"20px 24px", borderBottom:"1px solid rgba(255,182,193,0.3)", display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:"linear-gradient(135deg,#f48fb1,#ce93d8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0, boxShadow:"0 4px 12px rgba(244,143,177,0.4)" }}>🌸</div>
          <div>
            <div style={{ fontSize:"20px", fontWeight:"700", color:"#7b3f6e" }}>Calma</div>
            <div style={{ fontSize:"12px", color:"#b06090", fontStyle:"italic", marginTop:"1px" }}>Tu coach de maternidad consciente · Siempre disponible</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:"#9c6b8a" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#81c784", boxShadow:"0 0 6px rgba(129,199,132,0.8)" }} />
            En línea
          </div>
        </div>
      </div>

      <div style={{ width:"100%", maxWidth:"680px", flex:1, padding:"0 20px", boxSizing:"border-box", display:"flex", flexDirection:"column" }}>
        <div style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(12px)", flex:1, overflowY:"auto", padding:"20px", minHeight:"400px", maxHeight:"55vh" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", marginBottom:"16px" }}>
              {msg.role==="assistant" && <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:"linear-gradient(135deg,#f48fb1,#ce93d8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", marginRight:"8px", flexShrink:0, marginTop:"4px" }}>🌸</div>}
              <div style={{ maxWidth:"78%", padding:"12px 16px", borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:msg.role==="user"?"linear-gradient(135deg,#f06292,#ba68c8)":"rgba(255,255,255,0.92)", color:msg.role==="user"?"white":"#4a2040", fontSize:"14.5px", lineHeight:"1.65", boxShadow:msg.role==="user"?"0 4px 16px rgba(240,98,146,0.3)":"0 2px 12px rgba(0,0,0,0.08)", fontFamily:"Georgia,serif" }}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
              <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:"linear-gradient(135deg,#f48fb1,#ce93d8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🌸</div>
              <div style={{ padding:"12px 18px", borderRadius:"18px 18px 18px 4px", background:"rgba(255,255,255,0.92)", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", display:"flex", gap:"5px", alignItems:"center" }}>
                {[0,1,2].map(i => <div key={i} style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#f48fb1", animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showSuggestions && (
          <div style={{ background:"rgba(255,255,255,0.7)", padding:"12px 20px", display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {SUGGESTIONS.map((s,i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{ padding:"7px 14px", borderRadius:"20px", border:"1px solid rgba(244,143,177,0.5)", background:"rgba(255,255,255,0.9)", color:"#9c4070", fontSize:"12px", cursor:"pointer", fontFamily:"Georgia,serif" }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", borderRadius:"0 0 24px 24px", padding:"16px 20px 20px", borderTop:"1px solid rgba(255,182,193,0.2)", marginBottom:"20px" }}>
          <div style={{ display:"flex", gap:"10px", alignItems:"flex-end" }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Escríbeme cómo te sientes..." rows={1}
              style={{ flex:1, padding:"12px 16px", borderRadius:"20px", border:"1.5px solid rgba(244,143,177,0.4)", background:"rgba(255,255,255,0.9)", fontSize:"14.5px", fontFamily:"Georgia,serif", color:"#4a2040", outline:"none", resize:"none", lineHeight:"1.5", boxSizing:"border-box" }} />
            <button onClick={() => sendMessage()} disabled={loading||!input.trim()}
              style={{ width:"44px", height:"44px", borderRadius:"50%", border:"none", background:(!loading&&input.trim())?"linear-gradient(135deg,#f06292,#ba68c8)":"rgba(220,200,215,0.5)", color:"white", fontSize:"18px", cursor:(!loading&&input.trim())?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>➤</button>
          </div>
          <div style={{ fontSize:"10.5px", color:"#b89caa", textAlign:"center", marginTop:"10px", fontStyle:"italic" }}>
            Calma es un coach de apoyo emocional, no reemplaza atención psicológica profesional
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(244,143,177,0.3);border-radius:4px}
      `}</style>
    </div>
  );
}
