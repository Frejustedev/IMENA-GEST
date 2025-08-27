import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Patient, RenalDTPAMAG3ScintigraphyData } from '../../types';
import { BeakerIcon } from '../icons/BeakerIcon';

interface RenalDTPAMAG3FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RenalDTPAMAG3ScintigraphyData) => void;
  patient: Patient;
  initialData?: RenalDTPAMAG3ScintigraphyData;
}

type Tab = "info" | "anamnesis" | "bio" | "tech" | "synthesis";

export const RenalDTPAMAG3Form: React.FC<RenalDTPAMAG3FormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [formData, setFormData] = useState<RenalDTPAMAG3ScintigraphyData>(initialData || {});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        const newState = JSON.parse(JSON.stringify(prev)); // Deep copy for simplicity
        let currentLevel: any = newState;
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!currentLevel[part]) {
            currentLevel[part] = {};
          }
          currentLevel = currentLevel[part];
        }
        currentLevel[parts[parts.length - 1]] = finalValue;
        return newState;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  if (!isOpen) return null;

  const commonInputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const commonLabelClass = "block text-sm font-medium text-gray-700";
  const commonCheckboxLabelClass = "flex items-center space-x-2 text-sm text-gray-700";
  const commonTextareaClass = `${commonInputClass} min-h-[60px]`;
  
  const renderTabContent = () => {
    // Content for each tab
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-4">
            <fieldset className="border p-3 rounded-md">
              <legend className="text-md font-semibold px-1">En-tête</legend>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={commonLabelClass}>Date</label><input type="date" name="formDate" value={formData.formDate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                <div><label className={commonLabelClass}>Médecin Traitant</label><input type="text" name="referringDoctor" value={formData.referringDoctor || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                <div><label className={commonLabelClass}>Service Référant</label><input type="text" name="referringService" value={formData.referringService || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                <div><label className={commonLabelClass}>Examinateur</label><input type="text" name="examiner" value={formData.examiner || ''} onChange={handleInputChange} className={commonInputClass}/></div>
              </div>
            </fieldset>
            <fieldset className="border p-3 rounded-md">
              <legend className="text-md font-semibold px-1">Examen Clinique</legend>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={commonLabelClass}>Poids (kg)</label><input type="text" name="clinicalExam.weight" value={formData.clinicalExam?.weight || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                <div><label className={commonLabelClass}>Taille (m)</label><input type="text" name="clinicalExam.height" value={formData.clinicalExam?.height || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                <div><label className={commonLabelClass}>IMC</label><input type="text" name="clinicalExam.imc" value={formData.clinicalExam?.imc || ''} onChange={handleInputChange} className={commonInputClass}/></div>
              </div>
            </fieldset>
          </div>
        );
      case 'anamnesis':
        return (
            <div className="space-y-4">
                <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Antécédents</legend>
                    <div className="space-y-2">
                        <div><label className={commonLabelClass}>Anténataux</label><textarea name="antecedents.antenatal" value={formData.antecedents?.antenatal || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Postnataux</label><textarea name="antecedents.postnatal" value={formData.antecedents?.postnatal || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Malformation</label><textarea name="antecedents.malformation" value={formData.antecedents?.malformation || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                    </div>
                </fieldset>
                 <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Indication</legend>
                    <fieldset className="border p-2 rounded-md"><legend>Évaluation geste chirurgical</legend>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.surgicalEvaluation.preOperative" checked={!!formData.indication?.surgicalEvaluation?.preOperative} onChange={handleInputChange}/>Pré-opératoire</label>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.surgicalEvaluation.postOperative" checked={!!formData.indication?.surgicalEvaluation?.postOperative} onChange={handleInputChange}/>Post-opératoire</label>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.surgicalEvaluation.dfg" checked={!!formData.indication?.surgicalEvaluation?.dfg} onChange={handleInputChange}/>DFG</label>
                        <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.surgicalEvaluation.captoprilTest" checked={!!formData.indication?.surgicalEvaluation?.captoprilTest} onChange={handleInputChange}/>Test au captopril</label>
                    </fieldset>
                </fieldset>
            </div>
        );
      case 'bio':
        return (
          <div className="space-y-4">
            <fieldset className="border p-3 rounded-md">
                <legend className="text-md font-semibold px-1">Laboratoire</legend>
                <div className="grid grid-cols-3 gap-4">
                    <div><label className={commonLabelClass}>Urée</label><input type="text" name="laboratory.urea" value={formData.laboratory?.urea || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                    <div><label className={commonLabelClass}>Créatinine</label><input type="text" name="laboratory.creatinine" value={formData.laboratory?.creatinine || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                    <div><label className={commonLabelClass}>DFG</label><input type="text" name="laboratory.dfg" value={formData.laboratory?.dfg || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                    <div><label className={commonLabelClass}>ECBU</label><input type="text" name="laboratory.ecbu" value={formData.laboratory?.ecbu || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                    <div className="col-span-2"><label className={commonLabelClass}>Autres</label><input type="text" name="laboratory.others" value={formData.laboratory?.others || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                </div>
            </fieldset>
            <fieldset className="border p-3 rounded-md">
                <legend className="text-md font-semibold px-1">Imagerie</legend>
                 <div className="space-y-2">
                    <div><label className={commonLabelClass}>Echographie</label><textarea name="imaging.echography" value={formData.imaging?.echography || ''} onChange={handleInputChange} className={commonTextareaClass}/></div>
                    <div><label className={commonLabelClass}>Uroscanner</label><textarea name="imaging.uroscanner" value={formData.imaging?.uroscanner || ''} onChange={handleInputChange} className={commonTextareaClass}/></div>
                 </div>
            </fieldset>
          </div>
        );
      case 'tech':
        return (
            <div className="space-y-4">
                <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Injection</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={commonLabelClass}>Molécule Froide</label><input type="text" name="injectionDetails.coldMolecule" value={formData.injectionDetails?.coldMolecule || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Activité Prescrite</label><input type="text" name="injectionDetails.prescribedActivity" value={formData.injectionDetails?.prescribedActivity || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Heure Injection</label><input type="time" name="injectionDetails.injectionTime" value={formData.injectionDetails?.injectionTime || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Activité Injectée</label><input type="text" name="injectionDetails.injectedActivity" value={formData.injectionDetails?.injectedActivity || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Point d'injection</label><input type="text" name="injectionDetails.injectionPoint" value={formData.injectionDetails?.injectionPoint || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Technicien</label><input type="text" name="injectionDetails.technician" value={formData.injectionDetails?.technician || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                    </div>
                </fieldset>
                 <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Acquisitions</legend>
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className={commonLabelClass}>Heure Entrée</label><input type="time" name="acquisitions.entryTime" value={formData.acquisitions?.entryTime || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Heure Acquisition</label><input type="time" name="acquisitions.acquisitionTime" value={formData.acquisitions?.acquisitionTime || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Heure Sortie</label><input type="time" name="acquisitions.exitTime" value={formData.acquisitions?.exitTime || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                    </div>
                     <div className="mt-4"><label className={commonLabelClass}>Acquisition dynamique</label><input type="text" name="acquisitions.dynamicAcquisition" value={formData.acquisitions?.dynamicAcquisition || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                    <div className="mt-4"><label className={commonCheckboxLabelClass}><input type="checkbox" name="acquisitions.preMicturition" checked={!!formData.acquisitions?.preMicturition} onChange={handleInputChange} /><span>Pré-mictionnelle ou fin d'examen dynamique</span></label></div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                         <div><label className={commonLabelClass}>Post-mictionnelle précoce</label>
                            <select name="acquisitions.postMicturitionEarly" value={formData.acquisitions?.postMicturitionEarly || ''} onChange={handleInputChange} className={commonInputClass}>
                                <option value="">Choisir...</option><option value="15mn">15 Mn</option><option value="30mn">30 Mn</option>
                            </select>
                        </div>
                         <div><label className={commonLabelClass}>Post-mictionnelle tardive</label>
                            <select name="acquisitions.postMicturitionLate" value={formData.acquisitions?.postMicturitionLate || ''} onChange={handleInputChange} className={commonInputClass}>
                                <option value="">Choisir...</option><option value="1H">1 H</option><option value="2H">2 H</option><option value="3H">3 H</option><option value="4H">4 H</option>
                            </select>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
      case 'synthesis':
        return (
            <div className="space-y-4">
                 <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Autre Observation</legend>
                    <textarea name="otherObservation" value={formData.otherObservation || ''} onChange={handleInputChange} className={commonTextareaClass}/>
                </fieldset>
                <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Traitement</legend>
                    <div><label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.medical.has" checked={!!formData.treatment?.medical?.has} onChange={handleInputChange}/><span>Traitement Médical</span></label></div>
                    {formData.treatment?.medical?.has && <div className="grid grid-cols-2 gap-4 pl-6"><input type="date" name="treatment.medical.date" value={formData.treatment?.medical.date || ''} onChange={handleInputChange} className={commonInputClass}/><input placeholder="Lequel ?" type="text" name="treatment.medical.which" value={formData.treatment?.medical.which || ''} onChange={handleInputChange} className={commonInputClass}/></div>}
                    <div className="mt-2"><label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.surgical.has" checked={!!formData.treatment?.surgical?.has} onChange={handleInputChange}/><span>Traitement Chirurgical</span></label></div>
                    {formData.treatment?.surgical?.has && <div className="grid grid-cols-2 gap-4 pl-6"><input type="date" name="treatment.surgical.date" value={formData.treatment?.surgical.date || ''} onChange={handleInputChange} className={commonInputClass}/><input placeholder="Type" type="text" name="treatment.surgical.type" value={formData.treatment?.surgical.type || ''} onChange={handleInputChange} className={commonInputClass}/></div>}
                </fieldset>
                <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Consultation Chaude</legend>
                    <div><label className={commonLabelClass}>Examinateur</label><input type="text" name="hotConsultation.examiner" value={formData.hotConsultation?.examiner || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                    <div className="mt-2"><label className={commonLabelClass}>Détails</label><textarea name="hotConsultation.details" value={formData.hotConsultation?.details || ''} onChange={handleInputChange} className={commonTextareaClass}/></div>
                </fieldset>
                 <fieldset className="border p-3 rounded-md">
                    <legend className="text-md font-semibold px-1">Analyse, Conclusion & Recommandation</legend>
                    <div><label className={commonLabelClass}>Analyse Contextuelle</label><textarea name="contextualAnalysis" value={formData.contextualAnalysis || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                    <div className="mt-2"><label className={commonLabelClass}>Résultat-Conclusion-Recommandation</label><textarea name="conclusion" value={formData.conclusion || ''} onChange={handleInputChange} className={commonTextareaClass}/></div>
                 </fieldset>
            </div>
        );
      default:
        return <div>Contenu non défini</div>;
    }
  };

  const TabButton: React.FC<{tabId: Tab, label: string}> = ({tabId, label}) => (
      <button type="button" onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabId ? 'border-b-2 border-sky-500 text-sky-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4 bg-white rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2"><BeakerIcon className="h-6 w-6 text-sky-600"/><span>Fiche Scintigraphie Rénale DTPA/MAG3: {patient.name}</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="border-b border-gray-200 bg-white -mt-px"><nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                <TabButton tabId="info" label="Infos & Clinique" />
                <TabButton tabId="anamnesis" label="Anamnèse" />
                <TabButton tabId="bio" label="Biologie & Imagerie" />
                <TabButton tabId="tech" label="Technique" />
                <TabButton tabId="synthesis" label="Synthèse" />
          </nav></div>
          <div className="p-6 flex-grow overflow-y-auto">{renderTabContent()}</div>
          <div className="p-4 border-t bg-white rounded-b-lg flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm">Terminer Consultation</button>
          </div>
        </form>
      </div>
    </div>
  );
};