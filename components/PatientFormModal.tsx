import React from 'react';
import { Patient, Room, RoomId, ExamConfiguration } from '../types';
import { ThyroidScintigraphyForm } from './forms/ThyroidScintigraphyForm';
import { BoneScintigraphyForm } from './forms/BoneScintigraphyForm';
import { ParathyroidScintigraphyForm } from './forms/ParathyroidScintigraphyForm';
import { RenalDMSAForm } from './forms/RenalDMSAForm';
import { RenalDTPAMAG3Form } from './forms/RenalDTPAMAG3Form';
import { RequestForm } from './forms/RequestForm';
import { AppointmentForm } from './forms/AppointmentForm';
import { InjectionForm } from './forms/InjectionForm';
import { ExaminationForm } from './forms/ExaminationForm';
import { ReportForm } from './forms/ReportForm';
import { RetraitCRSortieForm } from './forms/RetraitCRSortieForm';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientId: string, roomId: RoomId, formData: any) => void;
  patient: Patient;
  room: Room;
  examConfigurations: ExamConfiguration[];
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  room,
  examConfigurations
}) => {
  if (!isOpen || !patient || !room) return null;

  // Dispatcher based on Room ID
  switch (room.id) {
    case RoomId.REQUEST:
      return (
        <RequestForm
          isOpen={isOpen}
          onClose={onClose}
          patient={patient}
          initialData={patient.roomSpecificData?.[RoomId.REQUEST]}
          onSubmit={(data) => onSubmit(patient.id, room.id, data)}
          examConfigurations={examConfigurations}
        />
      );

    case RoomId.APPOINTMENT:
      return (
        <AppointmentForm
          isOpen={isOpen}
          onClose={onClose}
          patient={patient}
          initialData={patient.roomSpecificData?.[RoomId.APPOINTMENT]}
          onSubmit={(data) => onSubmit(patient.id, room.id, data)}
        />
      );
    
    case RoomId.INJECTION:
        return (
            <InjectionForm
                isOpen={isOpen}
                onClose={onClose}
                patient={patient}
                onSubmit={(data) => onSubmit(patient.id, room.id, data)}
            />
        );

    case RoomId.EXAMINATION:
      return (
        <ExaminationForm
          isOpen={isOpen}
          onClose={onClose}
          patient={patient}
          initialData={patient.roomSpecificData?.[RoomId.EXAMINATION]}
          onSubmit={(data) => onSubmit(patient.id, room.id, data)}
        />
      );

    case RoomId.REPORT:
      return (
        <ReportForm
          isOpen={isOpen}
          onClose={onClose}
          patient={patient}
          initialData={patient.roomSpecificData?.[RoomId.REPORT]}
          onSubmit={(data) => onSubmit(patient.id, room.id, data)}
        />
      );
      
    case RoomId.RETRAIT_CR_SORTIE:
      return (
        <RetraitCRSortieForm
          isOpen={isOpen}
          onClose={onClose}
          patient={patient}
          initialData={patient.roomSpecificData?.[RoomId.RETRAIT_CR_SORTIE]}
          onSubmit={(data) => onSubmit(patient.id, room.id, data)}
        />
      );

    case RoomId.CONSULTATION: {
      const requestedExam = patient.roomSpecificData?.[RoomId.REQUEST]?.requestedExam;
      const consultationData = patient.roomSpecificData?.[RoomId.CONSULTATION];

      const handleSpecializedSubmit = (specializedData: any, dataKey: keyof Patient['roomSpecificData'][RoomId.CONSULTATION]) => {
        const updatedRoomData = {
          ...(consultationData || {}),
          [dataKey]: specializedData,
        };
        onSubmit(patient.id, room.id, updatedRoomData);
      };

      switch (requestedExam) {
        case "Scintigraphie Thyroïdienne":
          return (
            <ThyroidScintigraphyForm
              isOpen={isOpen}
              onClose={onClose}
              patient={patient}
              initialData={consultationData?.thyroidData}
              onSubmit={(data) => handleSpecializedSubmit(data, 'thyroidData')}
            />
          );
        case "Scintigraphie Osseuse":
           return (
            <BoneScintigraphyForm
              isOpen={isOpen}
              onClose={onClose}
              patient={patient}
              initialData={consultationData?.boneData}
              onSubmit={(data) => handleSpecializedSubmit(data, 'boneData')}
            />
          );
        case "Scintigraphie Parathyroïdienne":
           return (
            <ParathyroidScintigraphyForm
              isOpen={isOpen}
              onClose={onClose}
              patient={patient}
              initialData={consultationData?.parathyroidData}
              onSubmit={(data) => handleSpecializedSubmit(data, 'parathyroidData')}
            />
          );
        case "Scintigraphie Rénale DMSA":
           return (
            <RenalDMSAForm
              isOpen={isOpen}
              onClose={onClose}
              patient={patient}
              initialData={consultationData?.renalDMSAData}
              onSubmit={(data) => handleSpecializedSubmit(data, 'renalDMSAData')}
            />
          );
        case "Scintigraphie Rénale DTPA/MAG3":
           return (
            <RenalDTPAMAG3Form
              isOpen={isOpen}
              onClose={onClose}
              patient={patient}
              initialData={consultationData?.renalDTPAMAG3Data}
              onSubmit={(data) => handleSpecializedSubmit(data, 'renalDTPAMAG3Data')}
            />
          );
        default:
          return (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-6">
                      <h3 className="text-lg font-semibold">Consultation Générique</h3>
                      <p className="my-4">Aucun formulaire spécialisé n'est disponible pour cet examen: "{requestedExam || 'Non spécifié'}".</p>
                      <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Fermer</button>
                  </div>
              </div>
          );
      }
    }

    default:
      // Render Generic Forms for other rooms
      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold">Formulaire pour {room.name}</h3>
            <p className="my-4">Formulaire générique pour la salle actuelle. L'implémentation des champs spécifiques est requise.</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
                 <button onClick={() => onSubmit(patient.id, room.id, {})} className="px-4 py-2 bg-sky-600 text-white rounded">Soumettre</button>
            </div>
          </div>
        </div>
      );
  }
};