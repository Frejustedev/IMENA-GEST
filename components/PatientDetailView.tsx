import React from 'react';
import { Patient, Room, RoomId, PatientHistoryEntry } from '../types'; 
import { ROOMS_CONFIG } from '../constants';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { calculateTimeDiff, formatDuration } from '../utils/delayUtils';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ThyroidScintigraphyDataView } from './forms/ThyroidScintigraphyDataView';
import { BoneScintigraphyDataView } from './forms/BoneScintigraphyDataView';
import { ParathyroidScintigraphyDataView } from './forms/ParathyroidScintigraphyDataView';
import { RenalDMSADataView } from './forms/RenalDMSADataView';
import { RenalDTPAMAG3DataView } from './forms/RenalDTPAMAG3DataView';


interface PatientDetailViewProps {
  patient: Patient;
  onCloseDetailView: () => void;
  roomsConfig: Room[];
}

// Helper function to format field keys for display
const formatFieldKey = (key: string): string => {
  const words = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

// Helper to find the relevant history entry time
const findTimeFromHistory = (history: PatientHistoryEntry[], roomId: RoomId, type: 'entry' | 'exit', afterTimestamp?: string): string | undefined => {
  const relevantEntries = history.filter(entry => entry.roomId === roomId);
  if (type === 'entry') {
    const firstEntry = relevantEntries
        .filter(e => !afterTimestamp || new Date(e.entryDate) > new Date(afterTimestamp))
        .sort((a,b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime())[0];
    return firstEntry?.entryDate;
  } else { // 'exit'
    const lastExit = relevantEntries
        .filter(e => e.exitDate && (!afterTimestamp || new Date(e.exitDate) > new Date(afterTimestamp)))
        .sort((a,b) => new Date(b.exitDate!).getTime() - new Date(a.exitDate!).getTime())[0];
    return lastExit?.exitDate;
  }
};


export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onCloseDetailView, roomsConfig }) => {
  const patientAgeDisplay = patient.age !== undefined ? ` (${patient.age} ans)` : '';

  const delaySegments = [
    { startRoom: RoomId.CONSULTATION, endRoom: RoomId.INJECTION, label: "Consultation → Injection" },
    { startRoom: RoomId.INJECTION, endRoom: RoomId.EXAMINATION, label: "Injection → Examen" },
    { startRoom: RoomId.EXAMINATION, endRoom: RoomId.REPORT, label: "Examen → Compte Rendu" },
    { startRoom: RoomId.REPORT, endRoom: RoomId.RETRAIT_CR_SORTIE, label: "Compte Rendu → Retrait CR" },
  ];

  const renderDelays = () => {
    let lastExitTime: string | undefined = undefined;
    return delaySegments.map(segment => {
      const startTime = findTimeFromHistory(patient.history, segment.startRoom, 'exit', lastExitTime);
      if (!startTime) return <div key={segment.label} className="text-xs text-slate-500">{segment.label}: En attente de sortie de {roomsConfig.find(r=>r.id === segment.startRoom)?.name || segment.startRoom}</div>;
      
      lastExitTime = startTime; // Update lastExitTime for the next segment's entry search
      const endTime = findTimeFromHistory(patient.history, segment.endRoom, 'entry', startTime);
      
      if (!endTime) return <div key={segment.label} className="text-xs text-slate-500">{segment.label}: En attente d'entrée à {roomsConfig.find(r=>r.id === segment.endRoom)?.name || segment.endRoom}</div>;

      const diff = calculateTimeDiff(startTime, endTime);
      lastExitTime = endTime; // Next segment's exit should be after this entry if relevant

      return (
        <div key={segment.label} className="flex justify-between text-xs">
          <span className="text-slate-600">{segment.label}:</span>
          <span className="font-medium text-sky-700">{diff !== null ? formatDuration(diff) : 'N/A'}</span>
        </div>
      );
    });
  };

  const timelineEntries = [...patient.history].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

  const consultationData = patient.roomSpecificData?.[RoomId.CONSULTATION];
  const thyroidData = consultationData?.thyroidData;
  const boneData = consultationData?.boneData;
  const parathyroidData = consultationData?.parathyroidData;
  const renalDMSAData = consultationData?.renalDMSAData;
  const renalDTPAMAG3Data = consultationData?.renalDTPAMAG3Data;


  const renderSpecializedData = () => {
    if (thyroidData) return <ThyroidScintigraphyDataView data={thyroidData} />;
    if (boneData) return <BoneScintigraphyDataView data={boneData} />;
    if (parathyroidData) return <ParathyroidScintigraphyDataView data={parathyroidData} />;
    if (renalDMSAData) return <RenalDMSADataView data={renalDMSAData} />;
    if (renalDTPAMAG3Data) return <RenalDTPAMAG3DataView data={renalDTPAMAG3Data} />;
    return null; // No specialized data to render
  };
  const specializedDataComponent = renderSpecializedData();

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <UserCircleIcon className="h-12 w-12 text-sky-600" />
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{patient.name}</h2>
            <p className="text-sm text-slate-500">ID: {patient.id} - Né(e) le: {patient.dateOfBirth}{patientAgeDisplay}</p>
          </div>
        </div>
        <button
          onClick={onCloseDetailView}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md shadow-sm transition-colors"
        >
          &larr; Retour
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-slate-700 mb-2 border-b pb-1">Informations Générales</h3>
          <dl className="space-y-1 text-sm text-slate-600">
            {patient.address && <div><dt className="font-medium text-slate-500 inline">Adresse: </dt><dd className="inline ml-2">{patient.address}</dd></div>}
            {patient.phone && <div><dt className="font-medium text-slate-500 inline">Téléphone: </dt><dd className="inline ml-2">{patient.phone}</dd></div>}
            {patient.email && <div><dt className="font-medium text-slate-500 inline">Email: </dt><dd className="inline ml-2">{patient.email}</dd></div>}
            {patient.referringEntity && (
              <div>
                <dt className="font-medium text-slate-500 inline">Référant: </dt>
                <dd className="inline ml-2">
                  {patient.referringEntity.name} ({patient.referringEntity.type})
                  {patient.referringEntity.contactNumber && ` - Tél: ${patient.referringEntity.contactNumber}`}
                  {patient.referringEntity.contactEmail && ` - Mail: ${patient.referringEntity.contactEmail}`}
                </dd>
              </div>
            )}
            <div><dt className="font-medium text-slate-500 inline">Patient Créé le: </dt><dd className="inline ml-2">{new Date(patient.creationDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</dd></div>
          </dl>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-slate-700 mb-2 border-b pb-1">Statut Actuel</h3>
           <dl className="space-y-1 text-sm text-slate-600">
            <div><dt className="font-medium text-slate-500">Salle Actuelle:</dt><dd className="ml-2 font-semibold text-sky-700">{ROOMS_CONFIG.find(r => r.id === patient.currentRoomId)?.name || patient.currentRoomId}</dd></div>
            <div><dt className="font-medium text-slate-500">Statut dans la Salle:</dt><dd className="ml-2">{patient.statusInRoom}</dd></div>
          </dl>
          <h3 className="text-lg font-semibold text-slate-700 mt-3 mb-2 border-b pb-1">Délais du Parcours</h3>
          <div className="space-y-1">
            {renderDelays()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Frise Chronologique du Parcours</h3>
            {timelineEntries.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Aucun historique disponible.</p>
            ) : (
                <div className="relative pl-4 border-l-2 border-slate-200">
                {timelineEntries.map((entry, index) => {
                    const room = roomsConfig.find(r => r.id === entry.roomId);
                    const Icon = room ? room.icon : DocumentTextIcon;

                    return (
                    <div key={index} className="mb-8 relative last:mb-0">
                        <div className="absolute -left-[23px] top-1 flex items-center justify-center bg-white">
                        <span className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center ring-4 ring-white">
                            <Icon className="h-5 w-5" />
                        </span>
                        </div>
                        <div className="ml-8">
                        <p className="font-semibold text-md text-slate-800">{room?.name || entry.roomId}</p>
                        <p className="text-sm text-slate-600">{entry.statusMessage}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {new Date(entry.entryDate).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                            {entry.exitDate && ` → ${new Date(entry.exitDate).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}`}
                        </p>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
        </div>

        <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Données Spécifiques par Salle</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {specializedDataComponent}

                {roomsConfig.map(room => {
                  if (room.id === RoomId.CONSULTATION && specializedDataComponent) return null; // Don't render generic if specialized exists
                  
                  const roomData = patient.roomSpecificData?.[room.id];
                  if (!roomData || Object.keys(roomData).length === 0) return null;
                  
                  return (
                      <div key={room.id} className="p-4 bg-slate-50 rounded-lg shadow-inner">
                      <h4 className="text-md font-semibold text-sky-600 mb-2">{room.name}</h4>
                      <dl className="space-y-1 text-xs text-slate-600">
                          {Object.entries(roomData as Record<string, any>).map(([key, value]) => {
                          if (value === null || value === undefined || value === '' || typeof value === 'object') return null; // Hide objects as they are handled by specialized views
                          return (
                              <div key={key}>
                              <dt className="font-medium text-slate-500">{formatFieldKey(key)}:</dt>
                              <dd className="ml-2 whitespace-pre-wrap">{String(value)}</dd>
                              </div>
                          );
                          })}
                      </dl>
                      </div>
                  );
                })}

                {(!patient.roomSpecificData || Object.values(patient.roomSpecificData).every(data => !data || Object.keys(data).length === 0)) && (
                    <p className="text-sm text-slate-500 italic">Aucune donnée spécifique enregistrée.</p>
                )}
            </div>
        </div>

      </div>

       <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
