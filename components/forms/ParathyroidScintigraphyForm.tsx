import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Patient, ParathyroidScintigraphyData } from '../../types';
import { BeakerIcon } from '../icons/BeakerIcon';

interface ParathyroidScintigraphyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParathyroidScintigraphyData) => void;
  patient: Patient;
  initialData?: ParathyroidScintigraphyData;
}

type Tab = "info" | "anamnesis" | "bio" | "tech" | "synthesis";

export const ParathyroidScintigraphyForm: React.FC<ParathyroidScintigraphyFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [formData, setFormData] = useState<ParathyroidScintigraphyData>(initialData || {});

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
    switch (activeTab) {
        case "info":
            return (
                <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">En-tête & Médecins</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Date</label><input type="date" name="formDate" value={formData.formDate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Médecin Traitant</label><input type="text" name="referringDoctor" value={formData.referringDoctor || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Email Médecin</label><input type="email" name="referringDoctorEmail" value={formData.referringDoctorEmail || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Service Référant</label><input type="text" name="referringService" value={formData.referringService || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Date prochain RDV</label><input type="date" name="nextAppointmentDate" value={formData.nextAppointmentDate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
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
                        <div className="grid grid-cols-2 gap-2 mt-4">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isMenopausal" checked={!!formData.clinicalExam?.isMenopausal} onChange={handleInputChange}/><span>Ménopause</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasContraception" checked={!!formData.clinicalExam?.hasContraception} onChange={handleInputChange}/><span>Contraception</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isPregnancyRisk" checked={!!formData.clinicalExam?.isPregnancyRisk} onChange={handleInputChange}/><span>Risque de grossesse</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasIncontinence" checked={!!formData.clinicalExam?.hasIncontinence} onChange={handleInputChange}/><span>Incontinence</span></label>
                        </div>
                        <div className="mt-4"><label className={commonLabelClass}>Signes d'appel</label><textarea name="clinicalExam.appealSigns" value={formData.clinicalExam?.appealSigns || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div className="mt-2"><label className={commonLabelClass}>Commentaires</label><textarea name="clinicalExam.comments" value={formData.clinicalExam?.comments || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                    </fieldset>
                </div>
            );
        case "anamnesis":
             return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Antécédents</legend>
                        <div><label className={commonLabelClass}>Médicaux (thyroïde / reins)</label><textarea name="antecedents.medicalThyroidReins" value={formData.antecedents?.medicalThyroidReins || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Chirurgie (thyroïde / reins / digestive)</label><textarea name="antecedents.surgeryThyroidReinsDigestive" value={formData.antecedents?.surgeryThyroidReinsDigestive || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Cytoponction (thyroïde)</label><textarea name="antecedents.cytoponctionThyroid" value={formData.antecedents?.cytoponctionThyroid || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Autres</label><textarea name="antecedents.others" value={formData.antecedents?.others || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                     </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Indication</legend>
                        <div className="flex space-x-6">
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.hptI" checked={!!formData.indication?.hptI} onChange={handleInputChange}/><span>HPT I</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.hptII" checked={!!formData.indication?.hptII} onChange={handleInputChange}/><span>HPT II</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.hptIII" checked={!!formData.indication?.hptIII} onChange={handleInputChange}/><span>HPT III</span></label>
                        </div>
                        <div className="mt-4"><label className={commonLabelClass}>Autres</label><input type="text" name="indication.others" value={formData.indication?.others || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                     </fieldset>
                 </div>
            );
        case "bio":
            return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Laboratoire</legend>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className={commonLabelClass}>PTH</label><input type="text" name="laboratory.pth" value={formData.laboratory?.pth || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Calcémie</label><input type="text" name="laboratory.calcemia" value={formData.laboratory?.calcemia || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Phosphorémie</label><input type="text" name="laboratory.phosphoremia" value={formData.laboratory?.phosphoremia || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Calciurie</label><input type="text" name="laboratory.calciuria" value={formData.laboratory?.calciuria || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Phosphaturie</label><input type="text" name="laboratory.phosphaturia" value={formData.laboratory?.phosphaturia || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Vitamine D</label><input type="text" name="laboratory.vitaminD" value={formData.laboratory?.vitaminD || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>TSHus</label><input type="text" name="laboratory.tshus" value={formData.laboratory?.tshus || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>T4L</label><input type="text" name="laboratory.t4l" value={formData.laboratory?.t4l || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>T3L</label><input type="text" name="laboratory.t3l" value={formData.laboratory?.t3l || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                     </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Traitement</legend>
                        <p className="text-sm font-medium mb-2">En cours :</p>
                        <div className="grid grid-cols-2 gap-2">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingATS" checked={!!formData.treatment?.ongoingATS} onChange={handleInputChange}/><span>ATS</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingThyroidHormone" checked={!!formData.treatment?.ongoingThyroidHormone} onChange={handleInputChange}/><span>Hormone thyroïdienne</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingIodine" checked={!!formData.treatment?.ongoingIodine} onChange={handleInputChange}/><span>Iode</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingIodinatedContrast" checked={!!formData.treatment?.ongoingIodinatedContrast} onChange={handleInputChange}/><span>Produit de contraste iodé</span></label>
                        </div>
                     </fieldset>
                 </div>
            );
        case "tech":
            return (
                <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Injection</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Activité technétium libre</label><input type="text" name="injectionDetails.technetiumFreeActivity" value={formData.injectionDetails?.technetiumFreeActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Activité MIBI injectée</label><input type="text" name="injectionDetails.mibiInjectedActivity" value={formData.injectionDetails?.mibiInjectedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure injection 99mTc</label><input type="time" name="injectionDetails.injectionTime99mTc" value={formData.injectionDetails?.injectionTime99mTc || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure injection MIBI</label><input type="time" name="injectionDetails.injectionTimeMIBI" value={formData.injectionDetails?.injectionTimeMIBI || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Point d'injection</label><input type="text" name="injectionDetails.injectionPoint" value={formData.injectionDetails?.injectionPoint || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Infirmier / Technicien</label><input type="text" name="injectionDetails.technician" value={formData.injectionDetails?.technician || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Acquisitions</legend>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div><label className={commonLabelClass}>Heure / entrée</label><input type="time" name="acquisitions.entryTime" value={formData.acquisitions?.entryTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure d'acquisition</label><input type="time" name="acquisitions.acquisitionTime" value={formData.acquisitions?.acquisitionTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure de sortie</label><input type="time" name="acquisitions.exitTime" value={formData.acquisitions?.exitTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div className="flex space-x-6"><label className={commonLabelClass}>Protocole:</label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="acquisitions.protocolSubtraction" checked={!!formData.acquisitions?.protocolSubtraction} onChange={handleInputChange}/><span>Soustraction</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="acquisitions.protocolDoublePhase" checked={!!formData.acquisitions?.protocolDoublePhase} onChange={handleInputChange}/><span>Double phase</span></label>
                        </div>
                    </fieldset>
                </div>
            );
        case "synthesis":
             return (
                 <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Imagerie</legend>
                        <div><label className={commonLabelClass}>Echographie IMENA</label><textarea name="echographyImena" value={formData.echographyImena || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Echographie Précédente</label><textarea name="echographyPrecedent" value={formData.echographyPrecedent || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>TDM</label><textarea name="tdm" value={formData.tdm || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                    </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Consultation Chaude</legend>
                        <div><label className={commonLabelClass}>Examinateur</label><input type="text" name="hotConsultation.examiner" value={formData.hotConsultation?.examiner || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        <div><label className={commonLabelClass}>Détails</label><textarea name="hotConsultation.details" value={formData.hotConsultation?.details || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                     </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Analyse, Conclusion & Recommandation</legend>
                        <div><label className={commonLabelClass}>Analyse Contextuelle</label><textarea name="contextualAnalysis" value={formData.contextualAnalysis || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Résultat-Conclusion-Recommandation</label><textarea name="conclusion" value={formData.conclusion || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                     </fieldset>
                 </div>
            );
    }
  }

  const TabButton: React.FC<{tabId: Tab, label: string}> = ({tabId, label}) => (
      <button type="button" onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabId ? 'border-b-2 border-sky-500 text-sky-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4 bg-white rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2"><BeakerIcon className="h-6 w-6 text-sky-600"/><span>Fiche Scintigraphie Parathyroïdienne: {patient.name}</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="border-b border-gray-200 bg-white -mt-px"><nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                <TabButton tabId="info" label="Infos & Clinique" />
                <TabButton tabId="anamnesis" label="Anamnèse" />
                <TabButton tabId="bio" label="Biologie & Traitement" />
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