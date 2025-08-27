import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Patient, BoneScintigraphyData } from '../../types';
import { BeakerIcon } from '../icons/BeakerIcon';

interface BoneScintigraphyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BoneScintigraphyData) => void;
  patient: Patient;
  initialData?: BoneScintigraphyData;
}

type Tab = "info" | "anamnesis" | "bio" | "tech" | "synthesis";

export const BoneScintigraphyForm: React.FC<BoneScintigraphyFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [formData, setFormData] = useState<BoneScintigraphyData>(initialData || {});

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
        case "info": // Infos Générales & Examen Clinique
            return (
                <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">En-tête</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Date Fiche</label><input type="date" name="formDate" value={formData.formDate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Médecin Traitant</label><input type="text" name="referringDoctor" value={formData.referringDoctor || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Service Référant</label><input type="text" name="referringService" value={formData.referringService || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Examinateur</label><input type="text" name="examiner" value={formData.examiner || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Date prochain RDV</label><input type="date" name="nextAppointmentDate" value={formData.nextAppointmentDate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Examen Clinique</legend>
                        <div className="grid grid-cols-3 gap-4">
                           <div><label className={commonLabelClass}>Poids (kg)</label><input type="text" name="clinicalExam.weight" value={formData.clinicalExam?.weight || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>Taille (m)</label><input type="text" name="clinicalExam.height" value={formData.clinicalExam?.height || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>IMC</label><input type="text" name="clinicalExam.imc" value={formData.clinicalExam?.imc || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>TA</label><input type="text" name="clinicalExam.ta" value={formData.clinicalExam?.ta || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>Pouls</label><input type="text" name="clinicalExam.pulse" value={formData.clinicalExam?.pulse || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>DDR</label><input type="date" name="clinicalExam.ddr" value={formData.clinicalExam?.ddr || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isMenopausal" checked={!!formData.clinicalExam?.isMenopausal} onChange={handleInputChange}/><span>Ménopause</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isBreastfeeding" checked={!!formData.clinicalExam?.isBreastfeeding} onChange={handleInputChange}/><span>Allaitement</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasContraception" checked={!!formData.clinicalExam?.hasContraception} onChange={handleInputChange}/><span>Contraception</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isPregnancyRisk" checked={!!formData.clinicalExam?.isPregnancyRisk} onChange={handleInputChange}/><span>Risque de grossesse</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasIncontinence" checked={!!formData.clinicalExam?.hasIncontinence} onChange={handleInputChange}/><span>Incontinence</span></label>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                           <div><label className={commonLabelClass}>Signes d'appel</label><textarea name="clinicalExam.appealSigns" value={formData.clinicalExam?.appealSigns || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                           <div><label className={commonLabelClass}>Syndrome paranéoplasique</label><textarea name="clinicalExam.paraneoplasticSyndrome" value={formData.clinicalExam?.paraneoplasticSyndrome || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        </div>
                    </fieldset>
                </div>
            );
        case "anamnesis": // Anamnèse
             return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Antécédents MSK</legend>
                        <div><label className={commonLabelClass}>Traumatisme</label><textarea name="mskHistory.trauma" value={formData.mskHistory?.trauma || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Chirurgie</label><textarea name="mskHistory.surgery" value={formData.mskHistory?.surgery || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Prothèse articulaire</label><textarea name="mskHistory.articularProsthesis" value={formData.mskHistory?.articularProsthesis || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Statut bucco-dentaire</label><textarea name="mskHistory.buccodentalStatus" value={formData.mskHistory?.buccodentalStatus || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Biopsie osseuse</label><textarea name="mskHistory.boneBiopsy" value={formData.mskHistory?.boneBiopsy || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Autres</label><textarea name="mskHistory.others" value={formData.mskHistory?.others || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                     </fieldset>
                      <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Autres Antécédents et Mode de Vie</legend>
                        <div className="flex space-x-6">
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="otherHistoryAndLifestyle.hta" checked={!!formData.otherHistoryAndLifestyle?.hta} onChange={handleInputChange}/><span>HTA</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="otherHistoryAndLifestyle.diabetes" checked={!!formData.otherHistoryAndLifestyle?.diabetes} onChange={handleInputChange}/><span>Diabète</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="otherHistoryAndLifestyle.alcohol" checked={!!formData.otherHistoryAndLifestyle?.alcohol} onChange={handleInputChange}/><span>Alcool</span></label>
                        </div>
                     </fieldset>
                 </div>
            );
        case "bio": // Anatomo-Pathologie & Biologie
            return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Anatomo-Pathologie</legend>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div><label className={commonLabelClass}>Taille tumeur</label><input type="text" name="anatomoPathology.tumorSize" value={formData.anatomoPathology?.tumorSize || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Envahissement gg</label><input type="text" name="anatomoPathology.ggInvasion" value={formData.anatomoPathology?.ggInvasion || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Statut R</label><input type="text" name="anatomoPathology.rStatus" value={formData.anatomoPathology?.rStatus || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Type histologique</label><input type="text" name="anatomoPathology.histologicalType" value={formData.anatomoPathology?.histologicalType || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Grade histo-pronostique</label><input type="text" name="anatomoPathology.histoPrognosticGrade" value={formData.anatomoPathology?.histoPrognosticGrade || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Classification pTNM</label><input type="text" name="anatomoPathology.pTNMClassification" value={formData.anatomoPathology?.pTNMClassification || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Score Gleason</label><input type="text" name="anatomoPathology.gleasonScore" value={formData.anatomoPathology?.gleasonScore || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>ISUP</label><input type="text" name="anatomoPathology.isup" value={formData.anatomoPathology?.isup || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <fieldset className="border p-2 rounded-md mt-4">
                            <legend className="text-sm font-medium px-1">Immunohistochimie</legend>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div><label className={commonLabelClass}>RE</label><input type="text" name="anatomoPathology.immunohistochemistry.re" value={formData.anatomoPathology?.immunohistochemistry?.re || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                                <div><label className={commonLabelClass}>RP</label><input type="text" name="anatomoPathology.immunohistochemistry.rp" value={formData.anatomoPathology?.immunohistochemistry?.rp || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                                <div><label className={commonLabelClass}>HER2</label><input type="text" name="anatomoPathology.immunohistochemistry.her2" value={formData.anatomoPathology?.immunohistochemistry?.her2 || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                                <div><label className={commonLabelClass}>Ki67</label><input type="text" name="anatomoPathology.immunohistochemistry.ki67" value={formData.anatomoPathology?.immunohistochemistry?.ki67 || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            </div>
                        </fieldset>
                     </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Laboratoire</legend>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><label className={commonLabelClass}>PSA</label><input type="text" name="laboratory.psa" value={formData.laboratory?.psa || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>CA15-3</label><input type="text" name="laboratory.ca15_3" value={formData.laboratory?.ca15_3 || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>CA125</label><input type="text" name="laboratory.ca125" value={formData.laboratory?.ca125 || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>CA 19-9</label><input type="text" name="laboratory.ca19_9" value={formData.laboratory?.ca19_9 || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>ACE</label><input type="text" name="laboratory.ace" value={formData.laboratory?.ace || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>AFP</label><input type="text" name="laboratory.afp" value={formData.laboratory?.afp || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>PAL</label><input type="text" name="laboratory.pal" value={formData.laboratory?.pal || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Ca</label><input type="text" name="laboratory.ca" value={formData.laboratory?.ca || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Thyroglobuline (Tg)</label><input type="text" name="laboratory.thyroglobulin" value={formData.laboratory?.thyroglobulin || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Ac anti-Tg</label><input type="text" name="laboratory.acAntiTg" value={formData.laboratory?.acAntiTg || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                     </fieldset>
                 </div>
            );
        case "tech": // Technique
            return (
                <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Injection</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Molécule froide</label><input type="text" name="injectionDetails.coldMolecule" value={formData.injectionDetails?.coldMolecule || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Activité prescrite</label><input type="text" name="injectionDetails.prescribedActivity" value={formData.injectionDetails?.prescribedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure d'injection</label><input type="time" name="injectionDetails.injectionTime" value={formData.injectionDetails?.injectionTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Activité injectée</label><input type="text" name="injectionDetails.injectedActivity" value={formData.injectionDetails?.injectedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Infirmier / Technicien</label><input type="text" name="injectionDetails.technician" value={formData.injectionDetails?.technician || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Point d'injection</label><input type="text" name="injectionDetails.injectionPoint" value={formData.injectionDetails?.injectionPoint || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Acquisitions</legend>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div><label className={commonLabelClass}>Heure / entrée</label><input type="time" name="acquisitions.entryTime" value={formData.acquisitions?.entryTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure d'acquisition</label><input type="time" name="acquisitions.acquisitionTime" value={formData.acquisitions?.acquisitionTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure de sortie</label><input type="time" name="acquisitions.exitTime" value={formData.acquisitions?.exitTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div><label className={commonLabelClass}>Clichés statiques</label><textarea name="acquisitions.staticClichés" value={formData.acquisitions?.staticClichés || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>SPECT</label><textarea name="acquisitions.spect" value={formData.acquisitions?.spect || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                    </fieldset>
                </div>
            );
        case "synthesis": // Synthèse
             return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Traitement</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Hormonothérapie</label><input type="text" name="treatment.hormonotherapy" value={formData.treatment?.hormonotherapy || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Thérapie ciblée</label><input type="text" name="treatment.targetedTherapy" value={formData.treatment?.targetedTherapy || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Biphosphonate</label><input type="text" name="treatment.bisphosphonate" value={formData.treatment?.bisphosphonate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Corticoïde</label><input type="text" name="treatment.corticosteroid" value={formData.treatment?.corticosteroid || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div className="mt-2"><label className={commonLabelClass}>Autres Traitements</label><textarea name="treatment.others" value={formData.treatment?.others || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
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
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2"><BeakerIcon className="h-6 w-6 text-sky-600"/><span>Fiche Scintigraphie Osseuse: {patient.name}</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="border-b border-gray-200 bg-white -mt-px"><nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                <TabButton tabId="info" label="Infos & Clinique" />
                <TabButton tabId="anamnesis" label="Anamnèse" />
                <TabButton tabId="bio" label="Anapath & Bio" />
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