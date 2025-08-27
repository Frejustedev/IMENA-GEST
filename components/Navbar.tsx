import React from 'react';
import { User, PeriodOption, ActiveView } from '../types';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';
import { Cog8ToothIcon } from './icons/Cog8ToothIcon';

interface NavbarProps {
  currentUser: User;
  currentUserRoleName: string;
  onLogout: () => void;
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser,
  currentUserRoleName,
  onLogout,
  selectedPeriod,
  onPeriodChange,
  searchTerm,
  onSearchChange,
}) => {

  return (
    <header className="bg-slate-800 text-white p-4 shadow-md flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 no-print">
      <h1 className="text-2xl font-bold tracking-tight text-center sm:text-left">
        Gestion Parcours Patient MN
      </h1>
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="search"
            name="globalSearch"
            id="globalSearch"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher patient (ID, Nom...)"
            className="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            aria-label="Rechercher un patient"
          />
        </div>
        <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="period-filter" className="sr-only">Période:</label>
              <select
                id="period-filter"
                value={selectedPeriod}
                onChange={(e) => onPeriodChange(e.target.value as PeriodOption)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                aria-label="Sélectionner la période pour les statistiques"
              >
                <option value="today">Aujourd'hui</option>
                <option value="thisWeek">Cette Semaine</option>
                <option value="thisMonth">Ce Mois-ci</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-600">
                <div className="text-right">
                    <p className="font-semibold text-white text-sm truncate" title={currentUser.name}>{currentUser.name}</p>
                    <p className="text-xs text-sky-300">{currentUserRoleName}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-white hover:bg-slate-700 transition-colors"
                    title="Déconnexion"
                    aria-label="Déconnexion"
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};