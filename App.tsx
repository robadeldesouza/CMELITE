
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { CoreProvider, useCore } from './core/CoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard, GridProductCard } from './components/ProductCard';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { FAQ } from './components/FAQ';
import { TopBanner } from './components/TopBanner';
import { Product } from './types'; 
import { CheckoutModal } from './components/CheckoutModal';
import { SalesToast } from './components/SalesToast';
import { ExitPopup } from './components/ExitPopup';
import { ServerStatusModal } from './components/ServerStatusModal';
import { FeaturesModal } from './components/FeaturesModal';
import { GeneratorDemo } from './components/GeneratorDemo';
import { GhostModeDemo } from './components/GhostModeDemo';
import { StickyCTA } from './components/StickyCTA';
import { FloatingChat } from './components/FloatingChat';
import { JadeAudit } from './components/JadeAudit';
import { Grid2X2, ChevronDown, ChevronUp, ArrowLeft, Loader2, Zap } from 'lucide-react';
import { usePerformanceMonitoring } from './utils/performance';
import { useDiscountTimer } from './hooks/useDiscountTimer';

// ESTILOS UNIFICADOS
import './layout/css/ThemeStyles.css';

// LAZY LOADING
const GlobalNotes = React.lazy(() => import('./tools/GlobalNotes').then(module => ({ default: module.GlobalNotes })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));

const ICON_MAP: Record<string, any> = {
    Zap, 
    Target: (props: any) => <Zap {...props} />, 
    Coins: (props: any) => <Zap {...props} />
};

// WRAPPER INTERNO PARA ACESSAR O CONTEXTO
const AppContent = () => {
  const { config, features, content, isInitialized, toggleFeature, updateConfig, logAction } = useCore();
  const { isExpired } = useDiscountTimer();
  
  const [currentPage, setCurrentPage] = useState<'home'|'connectivity'|'ghost'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isServerStatusOpen, setIsServerStatusOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(features.topBanner);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Performance e Tema
  const [isLightMode, setIsLightMode] = useState(false);
  usePerformanceMonitoring();

  // Secret Admin Trigger
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lógica de Detecção de Contexto Inteligente para as Notas
  const currentFileContext = useMemo(() => {
      if (isAdminOpen) return 'admin_panel.tsx';
      if (isCheckoutOpen) return 'CheckoutModal.tsx';
      if (isServerStatusOpen) return 'ServerStatusModal.tsx';
      
      switch(currentPage) {
          case 'connectivity': return 'GeneratorDemo.tsx';
          case 'ghost': return 'GhostModeDemo.tsx';
          case 'home': return 'Hero.tsx';
          default: return 'index.tsx';
      }
  }, [isAdminOpen, isCheckoutOpen, isServerStatusOpen, currentPage]);

  useEffect(() => {
    if (isExpired && features.nemesisCampaignActive) {
        if (features.nemesisCampaignActive) toggleFeature('nemesisCampaignActive');
        updateConfig('pricingMode', 'LayoutPRINCIPAL');
        setIsBannerVisible(true); 
    }
  }, [isExpired, features.nemesisCampaignActive]);

  if (!isInitialized || !content.products || content.products.length === 0) {
      return (
          <div className="min-h-screen bg-page flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
      );
  }

  const products: Product[] = content.products.map(p => ({
      ...p,
      icon: ICON_MAP[p.iconName] || Zap
  }));

  const handleSecretTrigger = () => {
      logoClickCount.current += 1;
      if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
      if (logoClickCount.current >= 5) {
          setIsAdminOpen(true);
          logoClickCount.current = 0;
      } else {
          logoClickTimer.current = setTimeout(() => {
              logoClickCount.current = 0;
          }, 1000);
      }
  };

  const handleNavigate = (target: string) => {
    if (target === 'home') handleSecretTrigger();
    if (target === 'specs') { setIsFeaturesModalOpen(true); return; }
    if (target === 'connectivity' || target === 'ghost') {
        setCurrentPage(target as any);
        window.scrollTo(0, 0);
        return;
    }
    setCurrentPage('home');
    setTimeout(() => {
        const el = document.getElementById(target);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }, 100);
  };

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-page text-primary font-sans selection:bg-brand-500 selection:text-white">
      
      {isBannerVisible && features.topBanner && <TopBanner onClose={() => setIsBannerVisible(false)} />}
      
      <Navbar 
        onNavigate={handleNavigate} 
        onOpenCheckout={() => handleBuy(products[0])} 
        hasBanner={isBannerVisible} 
        onOpenAdmin={() => setIsAdminOpen(true)}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode(!isLightMode)}
      />
      
      <Suspense fallback={null}>
          {isAdminOpen && <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />}
          {/* GlobalNotes Ativado via Engine Core (features.globalNotes) */}
          {features.globalNotes && <GlobalNotes forcedContext={currentFileContext} />}
      </Suspense>

      <main className={currentPage === 'home' ? 'pb-24 md:pb-0' : ''}>
        {currentPage === 'home' && (
            <>
                <Hero onNavigate={handleNavigate} onOpenCheckout={() => handleBuy(products[0])} onOpenServerStatus={() => setIsServerStatusOpen(true)} paused={isLightMode} />
                <Features onOpenDetails={() => setIsFeaturesModalOpen(true)} staticMode={isLightMode} />
                
                <section id="products" className="py-16 max-w-7xl mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-6 uppercase tracking-tight">Escolha sua Vantagem</h2>
                  </div>
                  <div className="max-w-md mx-auto mb-12 relative">
                     <ProductCard product={products[0]} onBuy={handleBuy} isFeatured={true} />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8 cursor-pointer select-none max-w-2xl mx-auto" onClick={() => setShowAllProducts(!showAllProducts)}>
                    <div className="h-px bg-border-dim flex-1"></div>
                    <div className="text-muted text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-border-dim font-mono shadow-sm">
                      <Grid2X2 className="w-4 h-4" />
                      {showAllProducts ? 'Ocultar Ferramentas' : 'Ver Todas'}
                      {showAllProducts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    <div className="h-px bg-border-dim flex-1"></div>
                  </div>
                  
                  {showAllProducts && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        {products.slice(1).map((product) => <GridProductCard key={product.id} product={product} onBuy={handleBuy} />)}
                      </div>
                  )}
                </section>

                <Testimonials />
                <FAQ />
            </>
        )}
        {currentPage === 'connectivity' && (
             <div className="pt-32 pb-20 min-h-screen bg-page">
                 <GeneratorDemo onOpenCheckout={() => handleBuy(products[0])} />
             </div>
        )}
        {currentPage === 'ghost' && (
             <div className="pt-32 pb-20 min-h-screen bg-page">
                 <GhostModeDemo />
             </div>
        )}
      </main>

      <Footer />
      
      {features.floatingChat && <FloatingChat hasBottomOffset={currentPage === 'home'} staticMode={isLightMode} />}
      {features.geminiEnabled && <JadeAudit />}
      {features.salesToast && <SalesToast staticMode={isLightMode} />}
      
      {currentPage === 'home' && (
          <>
            {features.exitPopup && <ExitPopup onAccept={() => handleBuy(products[0])} onOpenAdmin={() => setIsAdminOpen(true)} />}
            <StickyCTA onOpenCheckout={() => handleBuy(products[0])} />
          </>
      )}

      {selectedProduct && <CheckoutModal product={selectedProduct} isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />}
      <ServerStatusModal isOpen={isServerStatusOpen} onClose={() => setIsServerStatusOpen(false)} />
      <FeaturesModal isOpen={isFeaturesModalOpen} onClose={() => setIsFeaturesModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CoreProvider>
      <AppContent />
    </CoreProvider>
  );
}
