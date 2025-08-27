import React from 'react';
import { Room, RoomId, ActiveView } from '../types';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { Squares2X2Icon } from './icons/Squares2X2Icon'; 
import { ArchiveBoxIcon } from './icons/ArchiveBoxIcon';
import { CalendarClockIcon } from './icons/CalendarClockIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { Cog8ToothIcon } from './icons/Cog8ToothIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';


interface RoomNavigationProps {
  rooms: Room[];
  activeRoomId: RoomId | null;
  currentView: ActiveView;
  onSelectRoom: (roomId: RoomId) => void;
  onShowDailyWorklist: () => void;
  onShowRoomsOverview: () => void;
  onShowActivityFeed: () => void;
  onShowStatisticsView: () => void;
  onShowDatabaseView: () => void;
  isUserAdmin: boolean;
  onShowAdministrationView: () => void;
  onShowExamSettingsView: () => void;
  onShowReportTemplatesSettingsView: () => void;
}

export const RoomNavigation: React.FC<RoomNavigationProps> = ({ 
  rooms, 
  activeRoomId, 
  currentView,
  onSelectRoom,
  onShowDailyWorklist,
  onShowRoomsOverview,
  onShowActivityFeed,
  onShowStatisticsView,
  onShowDatabaseView,
  isUserAdmin,
  onShowAdministrationView,
  onShowExamSettingsView,
  onShowReportTemplatesSettingsView
}) => {
  const baseButtonClass = "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-150";
  const activeClass = "bg-sky-600 text-white shadow-md";
  const inactiveClass = "hover:bg-slate-600 hover:text-white focus:bg-slate-600 focus:text-white";
  const activeIconClass = "text-white";
  const inactiveIconClass = "text-sky-300";

  const navItems = [
    { 
      id: 'rooms_overview', 
      label: "Vue d'ensemble", 
      icon: Squares2X2Icon, 
      action: onShowRoomsOverview,
      viewType: 'rooms_overview' as ActiveView
    },
    { 
      id: 'daily_worklist', 
      label: "Vacation du Jour", 
      icon: CalendarClockIcon, 
      action: onShowDailyWorklist,
      viewType: 'daily_worklist' as ActiveView
    },
    { 
      id: 'activity_feed', 
      label: "Flux d'activités", 
      icon: ArchiveBoxIcon, 
      action: onShowActivityFeed,
      viewType: 'activity_feed' as ActiveView
    },
    { 
      id: 'statistics', 
      label: "Statistiques", 
      icon: ChartBarIcon, 
      action: onShowStatisticsView,
      viewType: 'statistics' as ActiveView
    },
     { 
      id: 'database', 
      label: "Base de Données", 
      icon: DatabaseIcon, 
      action: onShowDatabaseView,
      viewType: 'database' as ActiveView
    },
  ];

  return (
    <aside className="w-72 bg-slate-700 text-slate-200 p-4 space-y-1.5 overflow-y-auto flex-shrink-0 no-print">
      <h2 className="text-lg font-semibold text-slate-100 mb-2 border-b border-slate-600 pb-2">Navigation Principale</h2>
      
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={item.action}
          className={`${baseButtonClass} ${currentView === item.viewType ? activeClass : inactiveClass}`}
          aria-current={currentView === item.viewType ? 'page' : undefined}
        >
          <item.icon className={`h-5 w-5 flex-shrink-0 ${currentView === item.viewType ? activeIconClass : inactiveIconClass}`} />
          <span className="truncate">{item.label}</span>
        </button>
      ))}
      

      {rooms.length > 0 && (
        <div className="pt-2 mt-2 border-t border-slate-600">
          <h3 className="text-md font-semibold text-slate-100 mb-2">Salles Disponibles</h3>
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`${baseButtonClass} 
                ${currentView === 'room' && activeRoomId === room.id 
                  ? activeClass 
                  : inactiveClass
                }
              `}
              aria-current={currentView === 'room' && activeRoomId === room.id ? 'page' : undefined}
            >
              <room.icon className={`h-5 w-5 flex-shrink-0 ${currentView === 'room' && activeRoomId === room.id ? activeIconClass : inactiveIconClass}`} />
              <span className="truncate">{room.name}</span>
            </button>
          ))}
        </div>
      )}

      {isUserAdmin && (
          <div className="pt-2 mt-2 border-t border-slate-600">
            <h3 className="text-md font-semibold text-slate-100 mb-2">Configuration</h3>
            
            <button
                onClick={onShowExamSettingsView}
                className={`${baseButtonClass} ${currentView === 'exam_settings' ? activeClass : inactiveClass}`}
                aria-current={currentView === 'exam_settings' ? 'page' : undefined}
            >
                <WrenchScrewdriverIcon className={`h-5 w-5 flex-shrink-0 ${currentView === 'exam_settings' ? activeIconClass : inactiveIconClass}`} />
                <span className="truncate">Paramètres des Examens</span>
            </button>
            
            <button
                onClick={onShowReportTemplatesSettingsView}
                className={`${baseButtonClass} ${currentView === 'report_templates_settings' ? activeClass : inactiveClass}`}
                aria-current={currentView === 'report_templates_settings' ? 'page' : undefined}
            >
                <ClipboardDocumentListIcon className={`h-5 w-5 flex-shrink-0 ${currentView === 'report_templates_settings' ? activeIconClass : inactiveIconClass}`} />
                <span className="truncate">Modèles de CR</span>
            </button>

            <button
                onClick={onShowAdministrationView}
                className={`${baseButtonClass} ${currentView === 'administration' ? activeClass : inactiveClass}`}
                aria-current={currentView === 'administration' ? 'page' : undefined}
            >
                <Cog8ToothIcon className={`h-5 w-5 flex-shrink-0 ${currentView === 'administration' ? activeIconClass : inactiveIconClass}`} />
                <span className="truncate">Administration</span>
            </button>
          </div>
      )}
    </aside>
  );
};