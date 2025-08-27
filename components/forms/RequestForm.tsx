import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Patient, RequestIndications, ScintigraphyExam } from '../../types';
import { SCINTIGRAPHY_EXAMS_LIST } from '../../constants';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';

interface RequestFormData {
  requestedExam?: ScintigraphyExam;
  indications?: RequestIndications;
  medicalHistory?: string;
  illnessHistory?: string;
  paraclinicalExams?: string;
}

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestFormData) => void;
  patient: Patient;
  initialData?: RequestFormData;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  initialData,
}) => {
  const [formData, setFormData] = useState<RequestFormData>(
    initialData || {
      requestedExam: undefined,
      indications: { bilanExtensionInitial: false, bilanRecidive: false, bilanComparatif: false, evaluation: false, autres: '' },
      medicalHistory: '',
      illnessHistory: '',
      paraclinicalExams: '',
    }
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    if (name.startsWith('indications.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
            ...prev,
            indications: {
                ...(prev.indications || { bilanExtensionInitial: false, bilanRecidive: false, bilanComparatif: false, evaluation: false, autres: '' }),
                [field]: finalValue
            }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.requestedExam) {
        alert("Veuillez sélectionner un examen demandé.");
        return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const commonInputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const commonLabelClass = "block text-sm font-medium text-gray-700";
  const commonCheckboxLabelClass = "flex items-center space-x-2 text-sm text-gray-700";
  const commonTextareaClass = `${commonInputClass} min-h-[80px]`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4 bg-white rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <ClipboardListIcon className="h-6 w-6 text-sky-600"/>
            <span>Compléter la demande d'examen: {patient.name}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            <div className="p-6 flex-grow overflow-y-auto space-y-4">
                <div>
                    <label htmlFor="requestedExam" className={commonLabelClass}>Examen demandé <span className="text-red-500">*</span></label>
                    <select name="requestedExam" id="requestedExam" value={formData.requestedExam || ''} onChange={handleInputChange} className={commonInputClass} required>
                        <option value="" disabled>Sélectionner un examen...</option>
                        {SCINTIGRAPHY_EXAMS_LIST.map(exam => ( <option key={exam} value={exam}>{exam}</option>))}
                    </select>
                </div>

                <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Indications</legend>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indications.bilanExtensionInitial" checked={!!formData.indications?.bilanExtensionInitial} onChange={handleInputChange}/><span>Bilan d'extension initial</span></label>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indications.bilanRecidive" checked={!!formData.indications?.bilanRecidive} onChange={handleInputChange}/><span>Bilan de récidive</span></label>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indications.bilanComparatif" checked={!!formData.indications?.bilanComparatif} onChange={handleInputChange}/><span>Bilan comparatif</span></label>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indications.evaluation" checked={!!formData.indications?.evaluation} onChange={handleInputChange}/><span>Évaluation</span></label>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="indications.autres" className={`${commonLabelClass} text-xs`}>Autres indications</label>
                        <textarea name="indications.autres" id="indications.autres" value={formData.indications?.autres || ''} onChange={handleInputChange} className={commonTextareaClass} />
                    </div>
                </fieldset>

                <div>
                    <label htmlFor="medicalHistory" className={commonLabelClass}>Antécédents médicaux</label>
                    <textarea name="medicalHistory" id="medicalHistory" value={formData.medicalHistory || ''} onChange={handleInputChange} className={commonTextareaClass} />
                </div>
                <div>
                    <label htmlFor="illnessHistory" className={commonLabelClass}>Histoire de la maladie</label>
                    <textarea name="illnessHistory" id="illnessHistory" value={formData.illnessHistory || ''} onChange={handleInputChange} className={commonTextareaClass} />
                </div>
                <div>
                    <label htmlFor="paraclinicalExams" className={commonLabelClass}>Examens paracliniques</label>
                    <textarea name="paraclinicalExams" id="paraclinicalExams" value={formData.paraclinicalExams || ''} onChange={handleInputChange} className={commonTextareaClass} />
                </div>
            </div>

            <div className="p-4 border-t bg-white rounded-b-lg flex justify-end space-x-3 mt-auto">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm">Enregistrer Demande</button>
            </div>
        </form>
      </div>
    </div>
  );
};
