import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Patient, ThyroidScintigraphyData } from '../../types';
import { BeakerIcon } from '../icons/BeakerIcon';

interface ThyroidScintigraphyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ThyroidScintigraphyData) => void;
  patient: Patient;
  initialData?: ThyroidScintigraphyData;
}

type Tab = "info" | "anamnesis" | "bio" | "tech" | "synthesis";

export const ThyroidScintigraphyForm: React.FC<ThyroidScintigraphyFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [formData, setFormData] = useState<ThyroidScintigraphyData>(initialData || {});

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
  const commonTextareaClass = `${commonInputClass} min-h-[80px]`;
  
  const renderTabContent = () => {
    switch (activeTab) {
        case "info": // Infos Générales
            return (
                <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">En-tête</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Date</label><input type="date" name="formDate" value={formData.formDate || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Modalité de Paiement</label><select name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleInputChange} className={commonInputClass}><option>Choisir...</option><option value="nonAssure">Non Assuré</option><option value="assure">Assuré</option><option value="priseEnCharge">Prise en Charge</option><option value="autres">Autres</option></select></div>
                            <div><label className={commonLabelClass}>Médecin Traitant</label><input type="text" name="referringDoctor" value={formData.referringDoctor || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Service Référant</label><input type="text" name="referringService" value={formData.referringService || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Examinateur</label><input type="text" name="examiner" value={formData.examiner || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Examen Clinique</legend>
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className={commonLabelClass}>Poids (kg)</label><input type="text" name="clinicalExam.weight" value={formData.clinicalExam?.weight || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>Taille (cm)</label><input type="text" name="clinicalExam.height" value={formData.clinicalExam?.height || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>IMC</label><input type="text" name="clinicalExam.imc" value={formData.clinicalExam?.imc || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>TA</label><input type="text" name="clinicalExam.ta" value={formData.clinicalExam?.ta || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>Pouls</label><input type="text" name="clinicalExam.pulse" value={formData.clinicalExam?.pulse || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>DDR</label><input type="date" name="clinicalExam.ddr" value={formData.clinicalExam?.ddr || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isMenopausal" checked={!!formData.clinicalExam?.isMenopausal} onChange={handleInputChange}/><span>Ménopause</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isBreastfeeding" checked={!!formData.clinicalExam?.isBreastfeeding} onChange={handleInputChange}/><span>Allaitement</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasContraception" checked={!!formData.clinicalExam?.hasContraception} onChange={handleInputChange}/><span>Contraception</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.isPregnancyRisk" checked={!!formData.clinicalExam?.isPregnancyRisk} onChange={handleInputChange}/><span>Risque de grossesse</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasExophthalmia" checked={!!formData.clinicalExam?.hasExophthalmia} onChange={handleInputChange}/><span>Exophtalmie</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasAnteriorCervicalSwelling" checked={!!formData.clinicalExam?.hasAnteriorCervicalSwelling} onChange={handleInputChange}/><span>Tuméfaction cervicale ant.</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="clinicalExam.hasLymphNodeStatus" checked={!!formData.clinicalExam?.hasLymphNodeStatus} onChange={handleInputChange}/><span>Statut ganglionnaire</span></label>
                        </div>
                        <div className="mt-4"><label className={commonLabelClass}>Autres</label><textarea name="clinicalExam.otherClinicalInfo" value={formData.clinicalExam?.otherClinicalInfo || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                    </fieldset>
                </div>
            );
        case "anamnesis": // Anamnèse
             return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Indication</legend>
                        <div className="grid grid-cols-2 gap-2">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isHyperthyroidism" checked={!!formData.indication?.isHyperthyroidism} onChange={handleInputChange}/><span>Hyperthyroïdie</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isHyperthyroidismNodule" checked={!!formData.indication?.isHyperthyroidismNodule} onChange={handleInputChange}/><span>Hyperthyroïdie + Nodule</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isBasedow" checked={!!formData.indication?.isBasedow} onChange={handleInputChange}/><span>Basedow</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isBasedowNodule" checked={!!formData.indication?.isBasedowNodule} onChange={handleInputChange}/><span>Basedow + Nodule</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isGMHN" checked={!!formData.indication?.isGMHN} onChange={handleInputChange}/><span>GMHN</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isNodule" checked={!!formData.indication?.isNodule} onChange={handleInputChange}/><span>Nodule</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isEctopic" checked={!!formData.indication?.isEctopic} onChange={handleInputChange}/><span>Ectopie</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isNeonatalHypothyroidism" checked={!!formData.indication?.isNeonatalHypothyroidism} onChange={handleInputChange}/><span>Hypothyroïdie néo-natale</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="indication.isStromaOvarii" checked={!!formData.indication?.isStromaOvarii} onChange={handleInputChange}/><span>Stroma ovarien</span></label>
                        </div>
                     </fieldset>
                      <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Antécédents</legend>
                        <div className="grid grid-cols-2 gap-2">
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="antecedents.hasThyroiditis" checked={!!formData.antecedents?.hasThyroiditis} onChange={handleInputChange}/><span>Thyroïdite</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="antecedents.hasThyroidSurgery" checked={!!formData.antecedents?.hasThyroidSurgery} onChange={handleInputChange}/><span>Chirurgie thyroïdienne</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="antecedents.hasCervicalRadiotherapy" checked={!!formData.antecedents?.hasCervicalRadiotherapy} onChange={handleInputChange}/><span>Radiothérapie cervicale</span></label>
                            <label className={commonCheckboxLabelClass}><input type="checkbox" name="antecedents.hasHereditaryThyroid" checked={!!formData.antecedents?.hasHereditaryThyroid} onChange={handleInputChange}/><span>Hérédité thyroïdienne</span></label>
                        </div>
                        <div className="mt-4"><label className={commonLabelClass}>Biopsie / Cytoponction</label><textarea name="antecedents.biopsyCytopunction" value={formData.antecedents?.biopsyCytopunction || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                     </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Histoire de la Maladie</legend>
                         <div className="mb-2"><label className={commonLabelClass}>Durée d'évolution</label><input type="text" name="illnessHistory.duration" value={formData.illnessHistory?.duration || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        <div className="grid grid-cols-3 gap-2">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="illnessHistory.isHyperthyroidism" checked={!!formData.illnessHistory?.isHyperthyroidism} onChange={handleInputChange}/><span>Hyperthyroïdie</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="illnessHistory.isHypothyroidism" checked={!!formData.illnessHistory?.isHypothyroidism} onChange={handleInputChange}/><span>Hypothyroïdie</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="illnessHistory.isEuthyroidism" checked={!!formData.illnessHistory?.isEuthyroidism} onChange={handleInputChange}/><span>Euthyroïdie</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="illnessHistory.hasGoiter" checked={!!formData.illnessHistory?.hasGoiter} onChange={handleInputChange}/><span>Goître</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="illnessHistory.hasNodule" checked={!!formData.illnessHistory?.hasNodule} onChange={handleInputChange}/><span>Nodule</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="illnessHistory.hasADP" checked={!!formData.illnessHistory?.hasADP} onChange={handleInputChange}/><span>ADP</span></label>
                        </div>
                     </fieldset>
                 </div>
            );
        case "bio": // Biologie & Traitements
            return (
                 <div className="space-y-4">
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Laboratoire</legend>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className={commonLabelClass}>TSHus</label><input type="text" name="laboratory.tshus" value={formData.laboratory?.tshus || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>T3L</label><input type="text" name="laboratory.t3l" value={formData.laboratory?.t3l || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>T4L</label><input type="text" name="laboratory.t4l" value={formData.laboratory?.t4l || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Tg</label><input type="text" name="laboratory.tg" value={formData.laboratory?.tg || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Calcitonine</label><input type="text" name="laboratory.calcitonin" value={formData.laboratory?.calcitonin || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Ac anti-TPO</label><input type="text" name="laboratory.acAntiTPO" value={formData.laboratory?.acAntiTPO || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Ac anti-TSH</label><input type="text" name="laboratory.acAntiTSH" value={formData.laboratory?.acAntiTSH || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Ac anti-Tg</label><input type="text" name="laboratory.acAntiTg" value={formData.laboratory?.acAntiTg || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div className="mt-4"><label className={commonLabelClass}>Autres</label><input type="text" name="laboratory.otherLabInfo" value={formData.laboratory?.otherLabInfo || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                     </fieldset>
                     <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Traitement</legend>
                        <p className="text-sm font-medium mb-2">En cours :</p>
                        <div className="grid grid-cols-2 gap-2">
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingATS" checked={!!formData.treatment?.ongoingATS} onChange={handleInputChange}/><span>ATS</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingHormone" checked={!!formData.treatment?.ongoingHormone} onChange={handleInputChange}/><span>Hormone thyroïdienne</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingIodine" checked={!!formData.treatment?.ongoingIodine} onChange={handleInputChange}/><span>Iode</span></label>
                           <label className={commonCheckboxLabelClass}><input type="checkbox" name="treatment.ongoingContrast" checked={!!formData.treatment?.ongoingContrast} onChange={handleInputChange}/><span>Produit de contraste iodé</span></label>
                        </div>
                        <p className="text-sm font-medium mt-4 mb-2">Traitement antérieur :</p>
                        <div className="space-y-2">
                           <div><label className={commonLabelClass}>Irathérapie</label><textarea name="treatment.previousIratherapy" value={formData.treatment?.previousIratherapy || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                           <div><label className={commonLabelClass}>Autres</label><textarea name="treatment.previousOther" value={formData.treatment?.previousOther || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        </div>
                     </fieldset>
                 </div>
            );
        case "tech": // Technique
            return (
                <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Injection: Pertechnétate de sodium</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Heure d'injection</label><input type="time" name="injectionDetails.injectionTime" value={formData.injectionDetails?.injectionTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Activité injectée</label><input type="text" name="injectionDetails.injectedActivity" value={formData.injectionDetails?.injectedActivity || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Infirmier / Technicien</label><input type="text" name="injectionDetails.technician" value={formData.injectionDetails?.technician || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Point d'injection</label><input type="text" name="injectionDetails.injectionSite" value={formData.injectionDetails?.injectionSite || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Acquisitions</legend>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div><label className={commonLabelClass}>Heure / entrée</label><input type="time" name="acquisitions.entryTime" value={formData.acquisitions?.entryTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure d'acquisition</label><input type="time" name="acquisitions.acquisitionTime" value={formData.acquisitions?.acquisitionTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                            <div><label className={commonLabelClass}>Heure de sortie</label><input type="time" name="acquisitions.exitTime" value={formData.acquisitions?.exitTime || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                        <div><label className={commonLabelClass}>Clichés statiques face antérieure</label><textarea name="acquisitions.staticAnteriorClichés" value={formData.acquisitions?.staticAnteriorClichés || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Clichés statiques profil</label><textarea name="acquisitions.staticProfileClichés" value={formData.acquisitions?.staticProfileClichés || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                         <div className="grid grid-cols-2 gap-4 mt-2">
                           <div><label className={commonLabelClass}>Nombre de coups</label><input type="text" name="acquisitions.shotCount" value={formData.acquisitions?.shotCount || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                           <div><label className={commonLabelClass}>SPECT</label><input type="text" name="acquisitions.spect" value={formData.acquisitions?.spect || ''} onChange={handleInputChange} className={commonInputClass}/></div>
                        </div>
                    </fieldset>
                </div>
            );
        case "synthesis": // Synthèse
             return (
                 <div className="space-y-4">
                    <fieldset className="border p-3 rounded-md">
                        <legend className="text-md font-semibold px-1">Autres Informations</legend>
                        <div><label className={commonLabelClass}>Cytologie-Anatomo-Pathologie</label><textarea name="cytologyPathology" value={formData.cytologyPathology || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
                        <div><label className={commonLabelClass}>Imagerie (Echographie, TDM/IRM, Scintigraphie)</label><textarea name="imaging.scintigraphy" value={formData.imaging?.scintigraphy || ''} onChange={handleInputChange} className={commonTextareaClass} /></div>
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
      <button
        type="button"
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === tabId
            ? 'border-b-2 border-sky-500 text-sky-600 bg-white'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4 bg-white rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <BeakerIcon className="h-6 w-6 text-sky-600"/>
            <span>Fiche Scintigraphie Thyroïdienne: {patient.name}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="border-b border-gray-200 bg-white -mt-px">
            <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                <TabButton tabId="info" label="Infos Générales" />
                <TabButton tabId="anamnesis" label="Anamnèse" />
                <TabButton tabId="bio" label="Biologie & Traitements" />
                <TabButton tabId="tech" label="Technique" />
                <TabButton tabId="synthesis" label="Synthèse" />
            </nav>
          </div>
          
          <div className="p-6 flex-grow overflow-y-auto">
            {renderTabContent()}
          </div>
          
          <div className="p-4 border-t bg-white rounded-b-lg flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm">Terminer Consultation</button>
          </div>
        </form>
      </div>
    </div>
  );
};