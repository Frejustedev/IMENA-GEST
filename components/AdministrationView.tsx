import React from 'react';
import { Cog8ToothIcon } from './icons/Cog8ToothIcon';

export const AdministrationView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
        <Cog8ToothIcon className="h-8 w-8 text-sky-600" />
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Administration</h2>
          <p className="text-sm text-slate-500">Gérez les utilisateurs, les rôles et les paramètres du système.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h3 className="text-xl font-semibold text-slate-700">Panneau d'Administration</h3>
        <p className="mt-2 text-slate-500">Cette section est en cours de développement. Les fonctionnalités de gestion des utilisateurs et des configurations seront disponibles ici prochainement.</p>
      </div>
    </div>
  );
};
