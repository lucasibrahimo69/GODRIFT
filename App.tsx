
import React, { useState, useEffect, useCallback } from 'react';
import { CARS, TRACKS } from './constants';
import { RacingItem, VoteData, AIAnalysis, ItemCategory } from './types';
import { getItemAnalysis } from './services/geminiService';
import Card from './components/Card';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ItemCategory>('car');
  const [carVotes, setCarVotes] = useState<VoteData[]>([]);
  const [trackVotes, setTrackVotes] = useState<VoteData[]>([]);
  const [userVotedCars, setUserVotedCars] = useState<string[]>([]);
  const [userVotedTracks, setUserVotedTracks] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);

  // Initialize simulated votes
  useEffect(() => {
    const savedCarVotes = localStorage.getItem('carVotes');
    const savedTrackVotes = localStorage.getItem('trackVotes');
    const savedUserVotedCars = localStorage.getItem('userVotedCars');
    const savedUserVotedTracks = localStorage.getItem('userVotedTracks');

    if (savedCarVotes) setCarVotes(JSON.parse(savedCarVotes));
    else setCarVotes(CARS.map(c => ({ id: c.id, count: Math.floor(Math.random() * 20) })));

    if (savedTrackVotes) setTrackVotes(JSON.parse(savedTrackVotes));
    else setTrackVotes(TRACKS.map(t => ({ id: t.id, count: Math.floor(Math.random() * 20) })));

    if (savedUserVotedCars) setUserVotedCars(JSON.parse(savedUserVotedCars));
    if (savedUserVotedTracks) setUserVotedTracks(JSON.parse(savedUserVotedTracks));
  }, []);

  useEffect(() => {
    if (carVotes.length > 0) localStorage.setItem('carVotes', JSON.stringify(carVotes));
    if (trackVotes.length > 0) localStorage.setItem('trackVotes', JSON.stringify(trackVotes));
    localStorage.setItem('userVotedCars', JSON.stringify(userVotedCars));
    localStorage.setItem('userVotedTracks', JSON.stringify(userVotedTracks));
  }, [carVotes, trackVotes, userVotedCars, userVotedTracks]);

  const handleVote = useCallback((id: string, category: ItemCategory) => {
    if (category === 'car') {
      if (userVotedCars.includes(id)) return;
      setCarVotes(prev => prev.map(v => v.id === id ? { ...v, count: v.count + 1 } : v));
      setUserVotedCars(prev => [...prev, id]);
    } else {
      if (userVotedTracks.includes(id)) return;
      setTrackVotes(prev => prev.map(v => v.id === id ? { ...v, count: v.count + 1 } : v));
      setUserVotedTracks(prev => [...prev, id]);
    }
  }, [userVotedCars, userVotedTracks]);

  const handleAnalyze = async (item: RacingItem) => {
    setIsAnalyzing(item.id);
    const result = await getItemAnalysis(item.name, item.category);
    setAnalysis(result);
    setIsAnalyzing(null);
  };

  const totalCarVotes = carVotes.reduce((acc, curr) => acc + curr.count, 0);
  const totalTrackVotes = trackVotes.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <header className="relative py-20 px-4 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent"></div>
          <div className="grid grid-cols-12 gap-2 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-full border-r border-white/5"></div>
            ))}
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1 bg-red-600 text-white font-orbitron text-[10px] tracking-widest mb-4">
            ASSETTO CORSA 2014 • HUB DE VOTAÇÃO
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-orbitron text-white italic tracking-tighter mb-4">
            MESTRES DO <span className="text-red-600">ASFALTO</span> MZ
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Escolha sua máquina e seu circuito favorito para o próximo campeonato. 
            Votação exclusiva para a comunidade Assetto Corsa Moçambique.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-[#111] rounded-2xl shadow-2xl border border-white/5 p-6 md:p-10 mb-12">
          
          {/* Navigation Tabs */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab('car')}
              className={`px-8 py-3 rounded-full font-orbitron text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'car' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <i className="fa-solid fa-car-side"></i>
              CARROS
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-8 py-3 rounded-full font-orbitron text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'track' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <i className="fa-solid fa-road"></i>
              PISTAS
            </button>
          </div>

          {/* Grid of Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(activeTab === 'car' ? CARS : TRACKS).map((item) => {
              const voteData = (activeTab === 'car' ? carVotes : trackVotes).find(v => v.id === item.id);
              const votes = voteData?.count || 0;
              const total = activeTab === 'car' ? totalCarVotes : totalTrackVotes;
              const hasVoted = activeTab === 'car' ? userVotedCars.includes(item.id) : userVotedTracks.includes(item.id);

              return (
                <Card 
                  key={item.id}
                  item={item}
                  votes={votes}
                  totalVotes={total}
                  hasVoted={hasVoted}
                  onVote={(id) => handleVote(id, activeTab)}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing === item.id}
                />
              );
            })}
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="sticky bottom-8 max-w-3xl mx-auto z-40">
          <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
            <div className="flex gap-8">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Total Carros</span>
                <span className="text-xl font-orbitron text-white">{totalCarVotes} <span className="text-zinc-600 text-sm">Votos</span></span>
              </div>
              <div className="w-px h-10 bg-zinc-800"></div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Total Pistas</span>
                <span className="text-xl font-orbitron text-white">{totalTrackVotes} <span className="text-zinc-600 text-sm">Votos</span></span>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
            >
              Resetar Dados
            </button>
          </div>
        </div>
      </main>

      {/* AI Analysis Modal */}
      {analysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAnalysis(null)}></div>
          <div className="relative bg-[#1a1a1a] border border-red-900/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-2 bg-red-600"></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-robot text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black font-orbitron text-white italic">{analysis.itemTitle}</h2>
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Análise de IA Especialista</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-zinc-500 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-red-500"></i> Pontos Fortes
                  </h4>
                  <ul className="space-y-2">
                    {analysis.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-200">
                        <span className="text-red-600 font-bold">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                  <h4 className="text-zinc-500 text-xs font-bold uppercase mb-2">Pro-Tip de Pilotagem</h4>
                  <p className="text-zinc-300 text-sm italic leading-relaxed">
                    "{analysis.tips}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAnalysis(null)}
                className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
