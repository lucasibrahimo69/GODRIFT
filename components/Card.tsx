
import React from 'react';
import { RacingItem, AIAnalysis } from '../types';

interface CardProps {
  item: RacingItem;
  votes: number;
  totalVotes: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onAnalyze: (item: RacingItem) => void;
  isAnalyzing: boolean;
}

const Card: React.FC<CardProps> = ({ item, votes, totalVotes, hasVoted, onVote, onAnalyze, isAnalyzing }) => {
  const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/5 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute top-0 right-0 p-3">
          <span className="bg-red-600 text-white font-orbitron px-3 py-1 rounded text-xs">
            {votes} VOTOS
          </span>
        </div>
        {item.spec && (
          <div className="absolute bottom-0 left-0 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] text-zinc-300 font-medium">
            {item.spec}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-orbitron text-lg font-bold text-white mb-2">{item.name}</h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{item.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">
            <span>Popularidade</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-red-500 h-full transition-all duration-1000" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onVote(item.id)}
            disabled={hasVoted}
            className={`flex items-center justify-center gap-2 py-2 rounded font-bold text-sm transition-all ${
              hasVoted 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
            }`}
          >
            <i className={`fa-solid ${hasVoted ? 'fa-check' : 'fa-hand-pointer'}`}></i>
            {hasVoted ? 'Votado' : 'Votar'}
          </button>
          
          <button
            onClick={() => onAnalyze(item)}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 py-2 rounded font-bold text-sm border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-microchip"></i>
            )}
            Dicas AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
