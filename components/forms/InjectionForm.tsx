import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Patient } from '../../types';
import { BeakerIcon } from '../icons/BeakerIcon';

// This will contain the fields for the injection details. It will be a union of all possible fields.
type InjectionDetails = {
    [key: string]: any;
};

interface InjectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InjectionDetails) => void;
  patient: Patient;
}

export const InjectionForm: React.FC<InjectionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
}) => {
  const [formData, setFormData] = useState<InjectionDetails>({});

  const requestedExam = patient.roomSpecificData?.DEMANDE?.requestedExam;

  // Load initial data when the component mounts or patient changes
  useEffect(() => {
    if (!isOpen) return;
    let initialData = {};
    const consultationData = patient.roomSpecificData?.CONSULTATION;
    if (consultationData) {
        switch(requestedExam) {
            case "Scintigraphie Thyroïdienne": initialData = consultationData.thyroidData?.injectionDetails || {}; break;
            case "Scintigraphie Osseuse": initialData = consultationData.boneData?.injectionDetails || {}; break;
            case "Scintigraphie Parathyroïdienne": initialData = consultationData.parathyroidData?.injectionDetails || {}; break;
            case "Scintigraphie Rénale DMSA": initialData = consultationData.renalDMSAData?.injectionDetails || {}; break;
            case "Scintigraphie Rénale DTPA/MAG3": initialData = consultationData.renalDTPAMAG3Data?.injectionDetails || {}; break;
        }
    }
    setFormData(initialData);
  }, [isOpen, patient, requestedExam]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const commonInputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const commonLabelClass = "block text-sm font-medium text-gray-700";

  const renderFormFields = () => {
      // Common fields
      const commonFields = (
          <>
              <div><label className={commonLabelClass}>Heure d'injection</label><input type="time" name="injectionTime" value={formData.injectionTime || ''} onChange={handleInputChange} className={commonInputClass} required/></div>
              <div><label className={commonLabelClass}>Activité injectée (MBq)</label><input type="text" name="injectedActivity" value={formData.injectedActivity || ''} onChange={handleInputChange} className={commonInputClass} required/></div>
              <div><label className={commonLabelClass}>Infirmier / Technicien</label><input type="text" name="technician" value={formData.technician || ''} onChange={handleInputChange} className={commonInputClass}/></div>
              <div><label className={commonLabelClass}>Point d'injection</label><input type="text" name={ requestedExam === "Scintigraphie Thyroïdienne" ? "injectionSite" : "injectionPoint"} value={formData.injectionSite || formData.injectionPoint || ''} onChange={handleInputChange} className={commonInputClass}/></div>
          </>
      );
      
      switch (requestedExam) {
          case "Scintigraphie Osseuse":
          case "Scintigraphie Rénale DMSA":
          case "Scintigraphie Rénale DTPA/MAG3":
              return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={commonLabelClass}>Molécule froide</label><input type="text" name="coldMolecule" value={formData.coldMolecule || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                      <div><label className={commonLabelClass}>Activité prescrite</label><input type="text" name="prescribedActivity" value={formData.prescribedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                      {commonFields}
                  </div>
              );
           case "Scintigraphie Parathyroïdienne":
               return (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div><label className={commonLabelClass}>Activité technétium libre</label><input type="text" name="technetiumFreeActivity" value={formData.technetiumFreeActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                       <div><label className={commonLabelClass}>Activité MIBI injectée</label><input type="text" name="mibiInjectedActivity" value={formData.mibiInjectedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                       <div><label className={commonLabelClass}>Heure injection 99mTc</label><input type="time" name="injectionTime99mTc" value={formData.injectionTime99mTc || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                       <div><label className={commonLabelClass}>Heure injection MIBI</label><input type="time" name="injectionTimeMIBI" value={formData.injectionTimeMIBI || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                       <div><label className={commonLabelClass}>Point d'injection</label><input type="text" name="injectionPoint" value={formData.injectionPoint || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                       <div><label className={commonLabelClass}>Infirmier / Technicien</label><input type="text" name="technician" value={formData.technician || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                   </div>
               );
          case "Scintigraphie Thyroïdienne":
              return (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={commonLabelClass}>Activité prescrite</label><input type="text" name="prescribedActivity" value={formData.prescribedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                      {commonFields}
                  </div>
              );
          default:
              return (
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-700">Aucun formulaire d'injection spécifique pour cet examen.</p>
                    <p className="text-xs text-amber-600 mt-1">Vous pouvez valider pour continuer le parcours patient.</p>
                </div>
              );
      }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4 bg-white rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <BeakerIcon className="h-6 w-6 text-sky-600"/>
            <span>Enregistrer l'injection: {patient.name}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            <div className="p-6 flex-grow overflow-y-auto space-y-4">
                <div className="p-3 bg-sky-100 border border-sky-200 rounded-md text-sm">
                    <p><strong>Examen :</strong> {requestedExam || 'Non spécifié'}</p>
                </div>
                {renderFormFields()}
            </div>
            <div className="p-4 border-t bg-white rounded-b-lg flex justify-end space-x-3 mt-auto">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm">Valider Injection</button>
            </div>
        </form>
      </div>
    </div>
  );
};