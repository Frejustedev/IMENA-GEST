
import React, { useState, FormEvent } from 'react';
import { HotLabData, RadiopharmaceuticalProduct, TracerLot, PreparationLog, Patient, ScintigraphyExam } from '../types';
import { SCINTIGRAPHY_EXAMS_LIST } from '../constants'; // Import SCINTIGRAPHY_EXAMS_LIST
import { CubeIcon } from './icons/CubeIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';

interface HotLabViewProps {
  hotLabData: HotLabData;
  onAddTracerLot: (newLot: Omit<TracerLot, 'id'>) => void;
  onAddPreparationLog: (newPreparation: Omit<PreparationLog, 'id'>) => void;
  allPatients: Patient[]; // Pour lier les préparations aux patients
}

export const HotLabView: React.FC<HotLabViewProps> = ({ 
    hotLabData, 
    onAddTracerLot, 
    onAddPreparationLog,
    allPatients
}) => {
  const [newLotData, setNewLotData] = useState<Partial<Omit<TracerLot, 'id'>>>({
    productId: hotLabData.products[0]?.id || '',
    unit: hotLabData.products[0]?.unit || 'MBq',
    expiryDate: new Date().toISOString().split('T')[0],
    calibrationDateTime: new Date().toISOString().slice(0, 16), // Format for datetime-local
    receivedDate: new Date().toISOString().split('T')[0],
    lotNumber: '',
    initialActivity: 0,
    quantityReceived: 0,
    notes: ''
  });
  const [newPrepData, setNewPrepData] = useState<Partial<Omit<PreparationLog, 'id'>>>({
    tracerLotId: '',
    unit: 'MBq',
    preparationDateTime: new Date().toISOString().slice(0, 16),
    activityPrepared: 0,
    preparedBy: '',
    patientId: '',
    examType: undefined,
    notes: ''
  });

  const handleLotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLotData(prev => ({ ...prev, [name]: name === 'initialActivity' || name === 'quantityReceived' ? parseFloat(value) || 0 : value }));
     if (name === 'productId') {
      const selectedProduct = hotLabData.products.find(p => p.id === value);
      setNewLotData(prev => ({ ...prev, unit: selectedProduct?.unit || 'MBq' }));
    }
  };

  const handlePrepChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPrepData(prev => ({ ...prev, [name]: name === 'activityPrepared' ? parseFloat(value) || 0 : value }));
  };

  const handleAddLotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newLotData.productId || !newLotData.lotNumber || !newLotData.expiryDate || !newLotData.unit ) {
        alert("Veuillez remplir tous les champs obligatoires pour le lot (Produit, N° Lot, Date Expiration, Unité).");
        return;
    }
    onAddTracerLot(newLotData as Omit<TracerLot, 'id'>);
    setNewLotData({ 
        productId: hotLabData.products[0]?.id || '', 
        lotNumber: '', 
        expiryDate: new Date().toISOString().split('T')[0],
        initialActivity: 0,
        calibrationDateTime: new Date().toISOString().slice(0, 16),
        unit: hotLabData.products[0]?.unit || 'MBq',
        notes: '',
        quantityReceived: 0,
        receivedDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddPrepSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPrepData.tracerLotId || !newPrepData.activityPrepared || !newPrepData.preparationDateTime || !newPrepData.preparedBy) {
        alert("Veuillez remplir tous les champs obligatoires pour la préparation (Lot, Activité, Date/Heure Prépa, Préparé par).");
        return;
    }
    onAddPreparationLog(newPrepData as Omit<PreparationLog, 'id'>);
    setNewPrepData({ 
        tracerLotId: '', 
        activityPrepared: 0,
        unit: 'MBq',
        preparationDateTime: new Date().toISOString().slice(0, 16),
        preparedBy: '',
        patientId: '',
        examType: undefined,
        notes: '' 
    });
  };

  const commonInputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const commonLabelClass = "block text-sm font-medium text-gray-700";
  const commonTextareaClass = `${commonInputClass} min-h-[60px]`;

  const todayISO = new Date().toISOString().split('T')[0];
  const availableLots = hotLabData.lots.filter(lot => lot.expiryDate >= todayISO);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
        <CubeIcon className="h-8 w-8 text-sky-600" />
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestion Labo Chaud</h2>
          <p className="text-sm text-slate-500">Administration des produits radiopharmaceutiques, lots et préparations.</p>
        </div>
      </div>

      {/* Section Produits Radiopharmaceutiques */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2 mb-4 border-b pb-2">
          <ListBulletIcon className="h-6 w-6 text-indigo-500" />
          <h3 className="text-xl font-semibold text-slate-700">Produits Radiopharmaceutiques Disponibles</h3>
        </div>
        {hotLabData.products.length === 0 ? (
          <p className="text-slate-500 italic">Aucun produit défini.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 pl-5">
            {hotLabData.products.map(product => (
              <li key={product.id} className="text-sm text-slate-600">
                <span className="font-medium">{product.name}</span> (Isotope: {product.isotope}, Unité par défaut: {product.unit})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Section Lots de Traceurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b pb-2">
            <PlusCircleIcon className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-700">Ajouter un Nouveau Lot de Traceur</h3>
          </div>
          <form onSubmit={handleAddLotSubmit} className="space-y-4">
            <div>
              <label htmlFor="productId" className={commonLabelClass}>Produit</label>
              <select name="productId" id="productId" value={newLotData.productId} onChange={handleLotChange} className={commonInputClass} required>
                {hotLabData.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lotNumber" className={commonLabelClass}>Numéro de Lot <span className="text-red-500">*</span></label>
              <input type="text" name="lotNumber" id="lotNumber" value={newLotData.lotNumber || ''} onChange={handleLotChange} className={commonInputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className={commonLabelClass}>Date d'Expiration <span className="text-red-500">*</span></label>
                <input type="date" name="expiryDate" id="expiryDate" value={newLotData.expiryDate} onChange={handleLotChange} className={commonInputClass} required />
              </div>
              <div>
                <label htmlFor="receivedDate" className={commonLabelClass}>Date de Réception</label>
                <input type="date" name="receivedDate" id="receivedDate" value={newLotData.receivedDate} onChange={handleLotChange} className={commonInputClass} />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="initialActivity" className={commonLabelClass}>Activité Initiale</label>
                    <input type="number" step="any" name="initialActivity" id="initialActivity" value={newLotData.initialActivity || ''} onChange={handleLotChange} className={commonInputClass} />
                </div>
                <div>
                    <label htmlFor="quantityReceived" className={commonLabelClass}>Quantité Reçue (ex: nb flacons)</label>
                    <input type="number" step="any" name="quantityReceived" id="quantityReceived" value={newLotData.quantityReceived || ''} onChange={handleLotChange} className={commonInputClass} />
                </div>
             </div>
            <div>
                <label htmlFor="calibrationDateTime" className={commonLabelClass}>Date et Heure de Calibration</label>
                <input type="datetime-local" name="calibrationDateTime" id="calibrationDateTime" value={newLotData.calibrationDateTime} onChange={handleLotChange} className={commonInputClass} />
            </div>
             <div>
              <label htmlFor="unitLot" className={commonLabelClass}>Unité <span className="text-red-500">*</span></label>
              <select name="unit" id="unitLot" value={newLotData.unit} onChange={handleLotChange} className={commonInputClass} required>
                <option value="MBq">MBq</option>
                <option value="mCi">mCi</option>
                <option value="GBq">GBq</option>
              </select>
            </div>
            <div>
              <label htmlFor="notesLot" className={commonLabelClass}>Notes</label>
              <textarea name="notes" id="notesLot" value={newLotData.notes || ''} onChange={handleLotChange} className={commonTextareaClass} />
            </div>
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors">
              Ajouter Lot
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b pb-2">
            <ListBulletIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-slate-700">Lots de Traceurs Existants ({hotLabData.lots.length})</h3>
          </div>
          {hotLabData.lots.length === 0 ? (<p className="text-slate-500 italic">Aucun lot enregistré.</p>) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {hotLabData.lots.map(lot => {
                const product = hotLabData.products.find(p => p.id === lot.productId);
                const isExpired = lot.expiryDate < todayISO;
                return (
                  <li key={lot.id} className={`p-3 rounded-md border ${isExpired ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="font-semibold text-sm text-slate-700">{product?.name || 'Produit inconnu'} - Lot: {lot.lotNumber}</p>
                    <p className={`text-xs ${isExpired ? 'text-red-600' : 'text-slate-500'}`}>Expire le: {new Date(lot.expiryDate).toLocaleDateString('fr-FR')} {isExpired ? '(Périmé)' : ''}</p>
                    {lot.initialActivity && <p className="text-xs text-slate-500">Activité Init.: {lot.initialActivity} {lot.unit} (Calib: {lot.calibrationDateTime ? new Date(lot.calibrationDateTime).toLocaleString('fr-FR') : 'N/A'})</p>}
                     {lot.notes && <p className="text-xs text-slate-500 mt-1"><i>Notes: {lot.notes}</i></p>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Section Préparations de Doses */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b pb-2">
            <PlusCircleIcon className="h-6 w-6 text-teal-500" />
            <h3 className="text-xl font-semibold text-slate-700">Enregistrer une Nouvelle Préparation</h3>
          </div>
          <form onSubmit={handleAddPrepSubmit} className="space-y-4">
            <div>
              <label htmlFor="tracerLotId" className={commonLabelClass}>Lot de Traceur Utilisé <span className="text-red-500">*</span></label>
              <select name="tracerLotId" id="tracerLotId" value={newPrepData.tracerLotId} onChange={handlePrepChange} className={commonInputClass} required>
                <option value="" disabled>Sélectionner un lot...</option>
                {availableLots.map(lot => {
                    const product = hotLabData.products.find(p => p.id === lot.productId);
                    return <option key={lot.id} value={lot.id}>{product?.name} - Lot: {lot.lotNumber} (Exp: {lot.expiryDate})</option>;
                })}
              </select>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="activityPrepared" className={commonLabelClass}>Activité Préparée <span className="text-red-500">*</span></label>
                    <input type="number" step="any" name="activityPrepared" id="activityPrepared" value={newPrepData.activityPrepared || ''} onChange={handlePrepChange} className={commonInputClass} required />
                </div>
                <div>
                    <label htmlFor="unitPrep" className={commonLabelClass}>Unité <span className="text-red-500">*</span></label>
                    <select name="unit" id="unitPrep" value={newPrepData.unit} onChange={handlePrepChange} className={commonInputClass} required>
                        <option value="MBq">MBq</option>
                        <option value="mCi">mCi</option>
                    </select>
                </div>
            </div>
            <div>
              <label htmlFor="preparationDateTime" className={commonLabelClass}>Date et Heure de Préparation <span className="text-red-500">*</span></label>
              <input type="datetime-local" name="preparationDateTime" id="preparationDateTime" value={newPrepData.preparationDateTime} onChange={handlePrepChange} className={commonInputClass} required />
            </div>
            <div>
              <label htmlFor="preparedBy" className={commonLabelClass}>Préparé par (Technicien) <span className="text-red-500">*</span></label>
              <input type="text" name="preparedBy" id="preparedBy" value={newPrepData.preparedBy || ''} onChange={handlePrepChange} className={commonInputClass} required />
            </div>
            <div>
              <label htmlFor="patientIdPrep" className={commonLabelClass}>Patient Associé (Optionnel)</label>
              <select name="patientId" id="patientIdPrep" value={newPrepData.patientId || ''} onChange={handlePrepChange} className={commonInputClass}>
                <option value="">Aucun patient</option>
                {allPatients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="examTypePrep" className={commonLabelClass}>Type d'Examen Prévu (Optionnel)</label>
              <select name="examType" id="examTypePrep" value={newPrepData.examType || ''} onChange={handlePrepChange} className={commonInputClass}>
                 <option value="">Non spécifié</option>
                {SCINTIGRAPHY_EXAMS_LIST.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notesPrep" className={commonLabelClass}>Notes</label>
              <textarea name="notes" id="notesPrep" value={newPrepData.notes || ''} onChange={handlePrepChange} className={commonTextareaClass} />
            </div>
            <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors">
              Enregistrer Préparation
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b pb-2">
            <ListBulletIcon className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-slate-700">Préparations Récentes ({hotLabData.preparations.length})</h3>
          </div>
           {hotLabData.preparations.length === 0 ? (<p className="text-slate-500 italic">Aucune préparation enregistrée.</p>) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {hotLabData.preparations.slice().reverse().map(prep => { // Show recent first
                const lot = hotLabData.lots.find(l => l.id === prep.tracerLotId);
                const product = lot ? hotLabData.products.find(p => p.id === lot.productId) : null;
                const patient = prep.patientId ? allPatients.find(p => p.id === prep.patientId) : null;
                return (
                  <li key={prep.id} className="p-3 rounded-md border bg-slate-50 border-slate-200">
                    <p className="font-semibold text-sm text-slate-700">
                      Act: {prep.activityPrepared} {prep.unit} pour {patient ? patient.name : (prep.examType || 'Usage général')}
                    </p>
                    <p className="text-xs text-slate-500">
                        Lot: {product?.name || 'Produit inconnu'} / {lot?.lotNumber || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500">Préparé par: {prep.preparedBy} le {new Date(prep.preparationDateTime).toLocaleString('fr-FR')}</p>
                    {prep.notes && <p className="text-xs text-slate-500 mt-1"><i>Notes: {prep.notes}</i></p>}
                  </li>
                );
              })}
            </ul>
           )}
        </div>
      </div>
    </div>
  );
};