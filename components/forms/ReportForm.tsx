import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Patient } from '../../types';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

interface ReportFormData {
  texteCompteRendu?: string;
  conclusionCr?: string;
}

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
  patient: Patient;
  initialData?: ReportFormData;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  initialData,
}) => {
  const [formData, setFormData] = useState<ReportFormData>(
    initialData || {
      texteCompteRendu: '',
      conclusionCr: '',
    }
  );

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const commonLabelClass = "block text-sm font-medium text-gray-700";
  const commonTextareaClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm min-h-[150px]";
  
  const requestedExam = patient.roomSpecificData?.DEMANDE?.requestedExam || 'Non spécifié';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="report-form-title">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4 bg-white rounded-t-lg">
          <h3 id="report-form-title" className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <DocumentTextIcon className="h-6 w-6 text-sky-600"/>
            <span>Rédiger le Compte Rendu: {patient.name}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            <div className="p-6 flex-grow overflow-y-auto space-y-4">
                 <div className="p-3 bg-sky-100 border border-sky-200 rounded-md text-sm">
                    <p><strong>Examen :</strong> {requestedExam}</p>
                </div>
                <div>
                    <label htmlFor="texteCompteRendu" className={commonLabelClass}>Texte du Compte Rendu</label>
                    <textarea
                        name="texteCompteRendu"
                        id="texteCompteRendu"
                        value={formData.texteCompteRendu || ''}
                        onChange={handleInputChange}
                        className={commonTextareaClass}
                        placeholder="Description détaillée des résultats de l'examen..."
                    />
                </div>
                 <div>
                    <label htmlFor="conclusionCr" className={commonLabelClass}>Conclusion</label>
                    <textarea
                        name="conclusionCr"
                        id="conclusionCr"
                        value={formData.conclusionCr || ''}
                        onChange={handleInputChange}
                        className={`${commonTextareaClass} min-h-[80px]`}
                        placeholder="Conclusion synthétique de l'examen..."
                    />
                </div>
            </div>
            <div className="p-4 border-t bg-white rounded-b-lg flex justify-end space-x-3 mt-auto">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm">Finaliser Compte Rendu</button>
            </div>
        </form>
      </div>
    </div>
  );
};