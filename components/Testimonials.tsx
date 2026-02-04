
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, StarHalf, Users, ThumbsUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { generateUniqueIdentity } from '../data/names';
import { useCore } from '../core/CoreContext';

// Estrutura que vincula o comentário a cargos que fazem sentido logicamente
const TESTIMONIAL_TEMPLATES = [
    {
        text: "Finalmente fechei o set do Espaço! O Card Finisher achou a carta que faltava no segundo baú.",
        roles: ["Set Completo", "Colecionador", "Vila 210+", "Membro Vitalício"]
    },
    {
        text: "O Bot da Viking Quest é insano. Fiz os 3 níveis dourados sem gastar nem 2bi de moedas.",
        roles: ["Top Evento", "Farmer", "Mestre Viking", "Vila 150+"]
    },
    {
        text: "Tava travado na vila 180 sem coins. Usei o Sniper de Escudos e farmei 10bi em uma hora.",
        roles: ["Vila 192", "Vila 205", "Vila 250+", "Membro Elite"] 
    },
    {
        text: "Achei que era fake, mas o Sequence Reader acertou 3 ataques seguidos x100. Recuperei o investimento na hora.",
        roles: ["Apostador VIP", "High Roller", "Vila 100+", "Membro Vitalício"]
    },
    {
        text: "Meu Tigre tava nível baixo, mas com o Speed Hack upei ele pro max rapidinho.",
        roles: ["Pet Max", "Farmer", "Vila 140", "VIP"]
    },
    {
        text: "O melhor é o Ghost Mode. Ataquei meu rival 50 vezes e ele nem viu de onde veio kkkkk.",
        roles: ["Raid Master", "Vingador", "Ghost User", "Global Rank"] 
    },
    {
        text: "Suporte nota 10. Me ajudaram a configurar o bot pra rodar enquanto eu dormia.",
        roles: ["Cliente VIP", "Farmer", "Vila 80+", "Membro Novo"]
    },
    {
        text: "Nunca mais compro spins na loja oficial. Com esse painel eu gero o triplo de graça.",
        roles: ["Economia Real", "Vila 300+", "Membro Elite", "Set Completo"]
    },
    {
        text: "A função de prever a aposta salvou meu evento. Peguei o prêmio final faltando 2 minutos.",
        roles: ["Top Evento", "Rank Global", "Vila 220", "Estrategista"]
    },
    {
        text: "Troquei 3 douradas no grupo VIP hoje. A comunidade é muito forte.",
        roles: ["Set Completo", "Trader Elite", "Membro Vitalício", "Vila 180+"]
    },
    {
        text: "Funciona liso no iPhone. Não precisei de Jailbreak nem nada complicado.",
        roles: ["Usuário iOS", "Vila 115", "VIP", "Membro Verificado"]
    },
    {
        text: "Pra quem ta duvidando: o Bypass do Rinoceronte funciona mesmo. O pet do cara nem acordou.",
        roles: ["Raid Master", "Destruidor", "Vila 260+", "Top Atacante"] 
    },
    {
        text: "Já tinha gasto uns 500 reais no jogo. Devia ter comprado esse painel antes.",
        roles: ["Membro Vitalício", "Vila 90+", "Economia Inteligente", "VIP"]
    },
    {
        text: "Atualizaram pro evento novo em menos de 1 hora. Equipe rápida demais.",
        roles: ["Cliente Antigo", "Vila 300+", "Membro Beta", "Global Rank"]
    },
    {
        text: "Fechei 4 sets hoje só usando a função de troca automática. Surreal.",
        roles: ["Card Master", "Set Completo", "Vila 175", "Colecionador"]
    }
];

interface GeneratedReview {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    date: string;
    avatarUrl: string;
    gender: 'men' | 'women';
}

const generateReviews = (count: number): GeneratedReview[] => {
    const reviews: GeneratedReview[] = [];
    const maleIds = Array.from({length: 96}, (_, i) => i).sort(() => Math.random() - 0.5);
    const femaleIds = Array.from({length: 96}, (_, i) => i).sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
        const isMale = i % 2 === 0;
        const fullName = generateUniqueIdentity(isMale ? 'male' : 'female');
        const avatarId = isMale ? maleIds[i % maleIds.length] : femaleIds[i % femaleIds.length];
        const genderDir = isMale ? 'men' : 'women';
        const templateIndex = i % TESTIMONIAL_TEMPLATES.length;
        const template = TESTIMONIAL_TEMPLATES[templateIndex];
        const roleIndex = (i + templateIndex) % template.roles.length;
        const role = template.roles[roleIndex];
        const variations = [" Muito top!", " Recomendo pra geral.", " Valeu cada centavo.", " Aprovado.", " Sensacional!", ""];
        const variation = variations[i % variations.length];
        const times = ["Agora mesmo", "5 min atrás", "1 hora atrás", "Hoje cedo", "Ontem", "2 dias atrás"];
        const time = times[i % times.length];
        const randRating = Math.random();
        let rating = 5.0;
        if (randRating < 0.90) rating = 5.0;
        else if (randRating < 0.95) rating = 4.5 + (Math.random() * 0.4);
        else rating = 4.0;

        reviews.push({
            id: i,
            name: fullName,
            role: role,
            content: `${template.text}${variation}`,
            rating: parseFloat(rating.toFixed(1)),
            date: time,
            avatarUrl: `https://randomuser.me/api/portraits/${genderDir}/${avatarId}.jpg`,
            gender: genderDir
        });
    }
    return reviews;
};

interface TestimonialsProps {
    paused?: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ paused = false }) => {
  const { content } = useCore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [arrowsVisible, setArrowsVisible] = useState(false);
  
  const reviews = useMemo(() => generateReviews(120), []);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = () => {
      setArrowsVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
          setArrowsVisible(false);
      }, 5000); 
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    showControls();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    showControls();
  };

  useEffect(() => {
      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting) {
                  showControls();
              }
          },
          { threshold: 0.3 }
      );

      if (sectionRef.current) {
          observer.observe(sectionRef.current);
      }

      return () => {
          if (sectionRef.current) observer.unobserve(sectionRef.current);
          if (timerRef.current) clearTimeout(timerRef.current);
      };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section id="reviews" ref={sectionRef} className="py-24 bg-page relative overflow-hidden group/section">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* HEADER DE RESULTADOS */}
        <div className="text-center pt-8 w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold mb-4 uppercase tracking-widest whitespace-nowrap">
            Comunidade Elite
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-primary mb-6">
            Resultados de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-600">Jogadores Reais</span>
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-lg leading-relaxed mb-12">
            Jogadores reais que pararam de gastar dinheiro com pacotes oficiais e começaram a dominar os eventos.
          </p>

          {/* CARROSSEL DE COMENTÁRIOS */}
          <div 
              className="relative w-full mb-12"
              onTouchStart={showControls}
              onMouseEnter={showControls}
          >
               <Quote className="absolute -top-6 -left-2 w-12 h-12 text-brand-500/40 rotate-180 z-20 pointer-events-none drop-shadow-md" />
               <Quote className="absolute -bottom-6 -right-2 w-12 h-12 text-brand-500/40 z-20 pointer-events-none drop-shadow-md" />

               <div className="bg-surface border border-border-dim rounded-3xl relative shadow-2xl mx-auto max-w-2xl h-[560px] md:h-[500px] overflow-hidden">
                   
                   <div key={currentIndex} className="relative z-10 text-center w-full h-full flex flex-col items-center px-6 py-8 md:px-10 animate-fade-in">
                   
                       <div className="shrink-0 flex flex-col items-center h-[200px] w-full">
                           <div className="w-32 h-32 rounded-full p-1.5 bg-gradient-to-br from-brand-500 to-emerald-700 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-4 relative shrink-0">
                               <img 
                               src={reviews[currentIndex].avatarUrl} 
                               alt={reviews[currentIndex].name}
                               className="w-full h-full rounded-full object-cover border-4 border-surface" 
                               />
                               <div className="absolute -bottom-1 -right-1 bg-brand-600 text-xs font-bold text-white px-2 py-1 rounded border-2 border-surface">BR</div>
                           </div>

                           <div className="flex flex-col items-center justify-start w-full">
                               <h4 className="font-bold text-primary text-xl font-display uppercase leading-tight mb-1 truncate w-full">{reviews[currentIndex].name}</h4>
                               <span className="text-xs font-bold text-brand-400 bg-brand-950/80 px-2.5 py-0.5 rounded border border-brand-500/30 uppercase tracking-wide whitespace-nowrap">
                                   {reviews[currentIndex].role}
                               </span>
                           </div>
                       </div>
                       
                       <div className="flex-1 flex flex-col items-center justify-center w-full py-2 overflow-hidden text-center px-4 md:px-8">
                          <p className="text-2xl md:text-3xl text-secondary italic leading-relaxed font-serif font-normal text-balance">
                          "{'\u00A0'}{reviews[currentIndex].content}{'\u00A0'}"
                          </p>
                       </div>
                       
                       <div className="shrink-0 flex flex-col items-center justify-end pb-2 pt-4">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1.5 whitespace-nowrap">
                              Avaliação do Membro
                           </span>

                           <div className="flex justify-center gap-1 mb-1.5">
                               {[...Array(Math.floor(reviews[currentIndex].rating))].map((_, i) => (
                                  <Star key={`full-${i}`} className="w-5 h-5 fill-brand-500 text-brand-500" />
                               ))}
                               
                               {reviews[currentIndex].rating % 1 !== 0 && reviews[currentIndex].rating < 5.0 && (
                                  <StarHalf className="w-5 h-5 fill-brand-500 text-brand-500" />
                               )}
                           </div>

                           <span className="font-display font-black text-2xl text-primary leading-none">
                              {currentIndex % 5 === 0 ? '5.0' : reviews[currentIndex].rating.toFixed(1)}
                           </span>
                       </div>
                   </div>
               </div>

               <button 
                  onClick={prevSlide} 
                  className={`absolute left-0 md:-left-20 top-0 bottom-0 w-20 flex items-center justify-center md:justify-end p-4 z-20 transition-all duration-500 outline-none ${arrowsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                  aria-label="Anterior"
               >
                   <div className="text-muted hover:text-white hover:scale-150 transition-all duration-300 drop-shadow-md">
                      <ChevronLeft className="w-12 h-12" strokeWidth={1} />
                   </div>
               </button>

               <button 
                  onClick={nextSlide} 
                  className={`absolute right-0 md:-right-20 top-0 bottom-0 w-20 flex items-center justify-center md:justify-start p-4 z-20 transition-all duration-500 outline-none ${arrowsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'}`}
                  aria-label="Próximo"
               >
                   <div className="text-muted hover:text-white hover:scale-150 transition-all duration-300 drop-shadow-md">
                      <ChevronRight className="w-12 h-12" strokeWidth={1} />
                   </div>
               </button>
          </div>

          {/* MÉTRICAS DE CREDIBILIDADE */}
          <div className="w-full mb-12 animate-fade-in">
              <h3 className="text-lg md:text-xl font-black text-primary text-center tracking-wide uppercase border-b-2 border-brand-500/30 pb-2 mb-8 max-w-lg mx-auto">
                  A VERDADE QUE A CONCORRÊNCIA TENTA ESCONDER
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
                  {/* 1. Membros Ativos */}
                  <div className="bg-surface/60 border border-border-dim p-4 rounded-2xl text-center backdrop-blur-sm hover:border-border-highlight transition-colors">
                      <div className="text-xl md:text-2xl font-black text-primary flex justify-center items-center gap-2 mb-1 whitespace-nowrap">
                          <Users className="w-4 h-4 text-muted" /> {content.socialProof.totalMembers}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-muted uppercase tracking-widest font-bold whitespace-nowrap">Membros Ativos</div>
                  </div>

                  {/* 2. Satisfação */}
                  <div className="bg-surface/60 border border-border-dim p-4 rounded-2xl text-center backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-black text-emerald-400 flex justify-center items-center gap-2 mb-1 whitespace-nowrap">
                          <ThumbsUp className="w-4 h-4" /> {content.socialProof.satisfactionRate}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-muted uppercase tracking-widest font-bold whitespace-nowrap">Satisfação</div>
                  </div>

                  {/* 3. Reclamações */}
                  <div className="bg-surface/60 border border-border-dim p-4 rounded-2xl text-center backdrop-blur-sm hover:border-brand-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-black text-brand-400 flex justify-center items-center gap-2 mb-1 whitespace-nowrap">
                          <AlertCircle className="w-4 h-4" /> {content.socialProof.refundRate}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-muted uppercase tracking-widest font-bold whitespace-nowrap">Reembolso</div>
                  </div>

                  {/* 4. Recomendações */}
                  <div className="bg-surface/60 border border-border-dim p-4 rounded-2xl text-center backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-black text-yellow-400 flex justify-center items-center gap-2 mb-1 whitespace-nowrap">
                          {content.socialProof.averageRating} <Star className="w-4 h-4 fill-yellow-400" />
                      </div>
                      <div className="text-[9px] md:text-[10px] text-muted uppercase tracking-widest font-bold whitespace-nowrap">Avaliação Global</div>
                  </div>
              </div>
          </div>

          {/* MÉTRICA DE RETOMADA ESTRATÉGICA (NOVA COPY REFINADA) */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 bg-brand-950/20 border border-brand-500/30 p-8 rounded-3xl w-full max-w-4xl relative overflow-hidden group/card">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
            
            <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                    <ShieldCheck className="w-10 h-10 text-brand-500" />
                </div>
                <div className="flex text-brand-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
            </div>

            <div className="text-center md:text-left relative z-10">
                <span className="block text-primary font-black text-xl md:text-2xl font-display leading-tight uppercase tracking-tight mb-2">
                    PROTOCOLOS DE RESGATE: {content.socialProof.totalReviews} EX-JOGADORES REATIVADOS
                </span>
                <p className="text-secondary text-sm md:text-base leading-relaxed opacity-90">
                    Nossa tecnologia reabilitou membros que haviam abandonado o ecossistema oficial por falta de recursos competitivos. Hoje, este grupo mantém <span className="text-brand-400 font-bold underline decoration-brand-500/30">dominância ativa</span> em 98% dos eventos globais.
                </p>
                <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Eficácia v4.6 Confirmada</span>
                    </div>
                    <div className="w-px h-3 bg-border-dim"></div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Amostragem: {content.socialProof.totalMembers} Usuários</span>
                </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
