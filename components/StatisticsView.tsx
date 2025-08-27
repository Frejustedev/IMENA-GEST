
import React from 'react';
import { Patient, Room, RoomId, PeriodOption, PatientHistoryEntry, ScintigraphyExam } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ClockIcon } from './icons/ClockIcon'; // Assuming you have or will create this
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon'; // Assuming you have or will create this
import { isDateInPeriod } from '../utils/dateUtils';
import { calculateTimeDiff, formatDuration } from '../utils/delayUtils'; // Import from new utility

interface StatisticsViewProps {
  allPatients: Patient[];
  selectedPeriod: PeriodOption;
  roomsConfig: Room[];
  calculateTimeDiff: (start?: string, end?: string) => number | null;
  formatDuration: (ms: number) => string;
}

interface DelaySegment {
  startRoom: RoomId;
  endRoom: RoomId;
  label: string;
}

const delaySegments: DelaySegment[] = [
  { startRoom: RoomId.CONSULTATION, endRoom: RoomId.INJECTION, label: "Consultation → Injection" },
  { startRoom: RoomId.INJECTION, endRoom: RoomId.EXAMINATION, label: "Injection → Examen" },
  { startRoom: RoomId.EXAMINATION, endRoom: RoomId.REPORT, label: "Examen → Compte Rendu" },
  { startRoom: RoomId.REPORT, endRoom: RoomId.RETRAIT_CR_SORTIE, label: "Compte Rendu → Retrait CR" },
];

// Helper to find the relevant history entry time (could be co-located or imported if used elsewhere)
const findTimeFromHistory = (history: PatientHistoryEntry[], roomId: RoomId, type: 'entry' | 'exit', afterTimestamp?: string): string | undefined => {
    const relevantEntries = history.filter(entry => entry.roomId === roomId);
    if (type === 'entry') {
      const firstEntry = relevantEntries
          .filter(e => !afterTimestamp || new Date(e.entryDate) > new Date(afterTimestamp))
          .sort((a,b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime())[0];
      return firstEntry?.entryDate;
    } else { // 'exit'
      // Find the latest exit from the room, optionally after a certain timestamp
      const lastExit = relevantEntries
          .filter(e => e.exitDate && (!afterTimestamp || new Date(e.exitDate) > new Date(afterTimestamp)))
          .sort((a,b) => new Date(b.exitDate!).getTime() - new Date(a.exitDate!).getTime())[0];
      return lastExit?.exitDate;
    }
  };

export const StatisticsView: React.FC<StatisticsViewProps> = ({ 
    allPatients, 
    selectedPeriod, 
    roomsConfig,
    calculateTimeDiff,
    formatDuration
}) => {
  
  const averageDelays = delaySegments.map(segment => {
    const delays: number[] = [];
    let lastExitTimeForSegment: string | undefined = undefined;

    allPatients.forEach(patient => {
      const startTime = findTimeFromHistory(patient.history, segment.startRoom, 'exit', lastExitTimeForSegment);
      if (!startTime) return;
      
      lastExitTimeForSegment = startTime;
      const endTime = findTimeFromHistory(patient.history, segment.endRoom, 'entry', startTime);
      
      if (endTime && isDateInPeriod(endTime, selectedPeriod)) { // Check if the end of the segment falls into the period
        const diff = calculateTimeDiff(startTime, endTime);
        if (diff !== null) {
          delays.push(diff);
        }
      }
      lastExitTimeForSegment = endTime; // for the next patient in the same segment analysis, reset if needed
    });

    const average = delays.length > 0 ? delays.reduce((sum, val) => sum + val, 0) / delays.length : null;
    return {
      label: segment.label,
      average: average !== null ? formatDuration(average) : 'N/A',
      count: delays.length,
    };
  });

  const examTypeStats: { [key in ScintigraphyExam]?: number } = {};
  allPatients.forEach(patient => {
    const requestData = patient.roomSpecificData?.[RoomId.REQUEST];
    if (requestData?.requestedExam) {
      // Check if the request was completed in the selected period
      const requestCompletedEntry = patient.history.find(
        h => h.roomId === RoomId.REQUEST && 
             h.statusMessage.toLowerCase().startsWith('demande complétée pour') &&
             isDateInPeriod(h.entryDate, selectedPeriod)
      );
      if (requestCompletedEntry) {
        examTypeStats[requestData.requestedExam] = (examTypeStats[requestData.requestedExam] || 0) + 1;
      }
    }
  });
  const sortedExamTypeStats = Object.entries(examTypeStats).sort(([,a], [,b]) => b - a);


  const periodLabel = selectedPeriod === 'today' ? "Aujourd'hui" 
                    : selectedPeriod === 'thisWeek' ? "Cette Semaine" 
                    : "Ce Mois-ci";

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
        <ChartBarIcon className="h-8 w-8 text-sky-600" />
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Statistiques du Service</h2>
            <p className="text-sm text-slate-500">Analyse des délais et des types d'examens pour la période: <span className="font-semibold">{periodLabel}</span></p>
        </div>
      </div>

      {/* Average Delays Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2 mb-4 border-b pb-2">
            <ClockIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-slate-700">Moyennes des Délais Inter-Salles</h3>
        </div>
        {averageDelays.length === 0 ? (
          <p className="text-slate-500 italic">Aucune donnée de délai disponible pour la période sélectionnée.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {averageDelays.map(delay => (
              <div key={delay.label} className="bg-slate-50 p-3 rounded-md shadow-sm">
                <p className="text-sm font-medium text-slate-600">{delay.label}</p>
                <p className="text-lg font-semibold text-sky-700">{delay.average}</p>
                <p className="text-xs text-slate-500">(Basé sur {delay.count} parcours complétés)</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Types Statistics Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2 mb-4 border-b pb-2">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-700">Répartition des Types d'Examens Demandés</h3>
        </div>
        {sortedExamTypeStats.length === 0 ? (
          <p className="text-slate-500 italic">Aucun examen demandé pour la période sélectionnée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type d'Examen
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nombre
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {sortedExamTypeStats.map(([examType, count]) => (
                  <tr key={examType}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-800">{examType}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder for icons if not already created
// You should have these or similar icons in your components/icons/ folder

if (!globalThis.ClockIcon) {
    globalThis.ClockIcon = ({ className = "h-6 w-6" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

if (!globalThis.ClipboardDocumentCheckIcon) {
    globalThis.ClipboardDocumentCheckIcon = ({ className = "h-6 w-6" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
        </svg>
    );
}
