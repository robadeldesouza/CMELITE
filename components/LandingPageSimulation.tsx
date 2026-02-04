import React from 'react';
import { Room } from '../types';
import { ArrowRight, Check, Star, Shield, Zap } from 'lucide-react';

interface LandingPageSimulationProps {
  room: Room;
}

export const LandingPageSimulation: React.FC<LandingPageSimulationProps> = ({ room }) => {
  return (
    <div className="w-full h-full bg-white overflow-y-auto relative font-sans">
      {/* Mock Header */}
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="font-bold text-xl text-gray-900 tracking-tight flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-2"></div>
          SaaS Product
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
          <span className="cursor-pointer hover:text-indigo-600">Funcionalidades</span>
          <span className="cursor-pointer hover:text-indigo-600">Preços</span>
          <span className="cursor-pointer hover:text-indigo-600">Depoimentos</span>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
          Começar Grátis
        </button>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-16 sm:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Star size={12} className="mr-1" /> Novo Lançamento 2.0
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Aumente suas vendas com <br className="hidden sm:block"/>
          <span className="text-indigo-600">Prova Social Automática</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Nossa plataforma simula conversas reais entre bots inteligentes para criar um ambiente de comunidade vibrante em sua landing page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center">
            Testar Agora <ArrowRight className="ml-2" size={20} />
          </button>
          <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 flex items-center justify-center">
            Ver Demo
          </button>
        </div>
      </div>

      {/* Features Grid Mock */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Tudo que você precisa</h2>
            <p className="text-gray-500 mt-2">Funcionalidades pensadas para conversão.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Setup Rápido", desc: "Instale em menos de 2 minutos com um script simples." },
              { icon: Shield, title: "Totalmente Seguro", desc: "Seus dados e de seus clientes estão protegidos." },
              { icon: Check, title: "Resultados Reais", desc: "Aumente seu CTR em até 40% com prova social." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  <f.icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mock Content Filler */}
      <div className="py-20 px-6 max-w-3xl mx-auto text-gray-500 space-y-4">
        <p className="h-4 bg-gray-100 rounded w-full"></p>
        <p className="h-4 bg-gray-100 rounded w-5/6"></p>
        <p className="h-4 bg-gray-100 rounded w-4/6"></p>
      </div>

      <div className="bg-gray-900 text-white py-12 text-center text-sm text-gray-400">
        © 2025 SaaS Product. Todos os direitos reservados.
      </div>
    </div>
  );
};