import React from 'react';

export type Permission = 
  | 'view_patients'
  | 'edit_patients'
  | 'create_patients'
  | 'move_patients'
  | 'manage_appointments'
  | 'manage_users'
  | 'manage_roles'
  | 'view_hot_lab'
  | 'edit_hot_lab'
  | 'view_statistics';

export const ALL_PERMISSIONS: { id: Permission, label: string }[] = [
    { id: 'view_patients', label: 'Voir les patients' },
    { id: 'edit_patients', label: 'Modifier les patients' },
    { id: 'create_patients', label: 'Créer des patients' },
    { id: 'move_patients', label: 'Déplacer les patients' },
    { id: 'manage_appointments', label: 'Gérer les rendez-vous' },
    { id: 'manage_users', label: 'Gérer les utilisateurs' },
    { id: 'manage_roles', label: 'Gérer les rôles' },
    { id: 'view_hot_lab', label: 'Voir le labo chaud' },
    { id: 'edit_hot_lab', label: 'Modifier le labo chaud' },
    { id: 'view_statistics', label: 'Voir les statistiques' },
];

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export enum RoomId {
  REQUEST = 'DEMANDE',
  APPOINTMENT = 'RENDEZVOUS',
  CONSULTATION = 'CONSULTATION',
  GENERATOR = 'GENERATEUR', // Sera "Gestion Labo Chaud"
  INJECTION = 'INJECTION',
  EXAMINATION = 'EXAMEN',
  REPORT = 'COMPTE_RENDU',
  RETRAIT_CR_SORTIE = 'RETRAIT_CR_SORTIE',
  ARCHIVE = 'ARCHIVE',
}

export enum PatientStatusInRoom {
  WAITING = 'En attente',
  SEEN = 'Traité(e)', 
}

export interface PatientHistoryEntry {
  roomId: RoomId;
  entryDate: string;
  exitDate?: string;
  statusMessage: string;
}

export type ScintigraphyExam = 
  | "Scintigraphie Osseuse"
  | "Scintigraphie Parathyroïdienne"
  | "Scintigraphie Rénale DMSA"
  | "Scintigraphie Rénale DTPA/MAG3"
  | "Scintigraphie Thyroïdienne";


export type ReferringEntityType = 'service' | 'center' | 'doctor';

export interface ReferringEntity {
  type: ReferringEntityType;
  name: string;
  contactNumber?: string;
  contactEmail?: string;
}

export type PeriodOption = 'today' | 'thisWeek' | 'thisMonth';

export type ActiveView = 'room' | 'search' | 'daily_worklist' | 'patient_detail' | 'rooms_overview' | 'activity_feed' | 'statistics' | 'hot_lab' | 'administration' | 'exam_settings';

export type PaymentMethod = 'nonAssure' | 'assure' | 'priseEnCharge' | 'autres';

// FIX: Add NewPatientData interface for creating new patients to resolve spread operator type error.
export interface NewPatientData {
  name: string;
  dateOfBirth: string;
  address?: string;
  phone?: string;
  email?: string;
  referringEntity?: ReferringEntity;
}

// FIX: Add RequestIndications interface used in forms and patient data.
export interface RequestIndications {
  bilanExtensionInitial?: boolean;
  bilanRecidive?: boolean;
  bilanComparatif?: boolean;
  evaluation?: boolean;
  autres?: string;
}

// --- START: Exam Configuration Types ---
export type ConfigurableFieldType = 'text' | 'textarea' | 'select' | 'checkbox';

export interface ConfigurableField {
  id: string;
  label: string;
  type: ConfigurableFieldType;
  options?: string[]; // For 'select' and 'checkbox' types
}

export interface ExamConfiguration {
  id: string;
  name: string;
  fields: ConfigurableField[];
}
// --- END: Exam Configuration Types ---


// --- START: Bone Scintigraphy Form Data Types ---
export interface BoneScintigraphyData {
  formDate?: string;
  paymentMethod?: PaymentMethod;
  referringDoctor?: string;
  referringService?: string;
  nextAppointmentDate?: string;
  examiner?: string;

  clinicalExam?: {
    weight?: string;
    height?: string;
    imc?: string;
    ta?: string;
    pulse?: string;
    ddr?: string;
    isMenopausal?: boolean;
    isBreastfeeding?: boolean;
    hasContraception?: boolean;
    isPregnancyRisk?: boolean;
    hasIncontinence?: boolean;
    appealSigns?: string;
    paraneoplasticSyndrome?: string;
  };
  
  anatomoPathology?: {
    tumorSize?: string;
    ggInvasion?: string; 
    rStatus?: string; 
    histologicalType?: string;
    histoPrognosticGrade?: string;
    pTNMClassification?: string;
    gleasonScore?: string;
    isup?: string;
    immunohistochemistry?: {
      re?: string;
      rp?: string;
      her2?: string;
      ki67?: string;
    };
  };

  mskHistory?: {
    trauma?: string;
    surgery?: string;
    articularProsthesis?: string;
    buccodentalStatus?: string;
    boneBiopsy?: string;
    others?: string;
  };
  
  otherHistoryAndLifestyle?: {
    hta?: boolean;
    diabetes?: boolean;
    alcohol?: boolean;
  };
  
  imaging?: {
    tdm?: string;
    irm?: string;
    scintigraphy?: string;
  };

  laboratory?: {
    psa?: string;
    ca15_3?: string;
    ca125?: string;
    ca19_9?: string;
    ace?: string;
    afp?: string;
    pal?: string;
    ca?: string;
    thyroglobulin?: string;
    acAntiTg?: string;
    others?: string;
  };
  
  injectionDetails?: {
    coldMolecule?: string;
    prescribedActivity?: string;
    injectionTime?: string;
    injectedActivity?: string;
    technician?: string;
    injectionPoint?: string;
  };
  
  treatment?: {
    chrType?: string;
    chrDate?: string;
    cthType?: string;
    cthCureCount?: string;
    cthLastCureDate?: string;
    rthType?: string;
    rthSessionCount?: string;
    rthSite?: string;
    rthLastSessionDate?: string;
    hormonotherapy?: string;
    targetedTherapy?: string;
    bisphosphonate?: string;
    corticosteroid?: string;
    others?: string;
  };
  
  acquisitions?: {
    entryTime?: string;
    acquisitionTime?: string;
    exitTime?: string;
    threePhaseDynamic?: string;
    threePhaseEarly?: string;
    threePhaseStatic?: string;
    threePhaseWholeBody?: string;
    twoPhaseEarly?: string;
    twoPhaseStatic?: string;
    twoPhaseWholeBody?: string;
    wholeBody?: string;
    staticClichés?: string;
    spect?: string;
  };
  
  hotConsultation?: {
    examiner?: string;
    details?: string;
  };
  
  contextualAnalysis?: string;
  conclusion?: string;
}
// --- END: Bone Scintigraphy Form Data Types ---


// --- START: Parathyroid Scintigraphy Form Data Types ---
export interface ParathyroidScintigraphyData {
  formDate?: string;
  paymentMethod?: PaymentMethod;
  referringDoctor?: string;
  referringDoctorEmail?: string;
  referringService?: string;
  nextAppointmentDate?: string;
  examiner?: string;

  clinicalExam?: {
    weight?: string;
    height?: string;
    imc?: string;
    ddr?: string;
    isMenopausal?: boolean;
    hasContraception?: boolean;
    isPregnancyRisk?: boolean;
    appealSigns?: string;
    hasIncontinence?: boolean;
    comments?: string;
  };

  antecedents?: {
    medicalThyroidReins?: string;
    surgeryThyroidReinsDigestive?: string;
    cytoponctionThyroid?: string;
    others?: string;
  };
  
  indication?: {
    hptI?: boolean;
    hptII?: boolean;
    hptIII?: boolean;
    others?: string;
  };

  injectionDetails?: {
    technetiumFreeActivity?: string;
    mibiInjectedActivity?: string;
    injectionTime99mTc?: string;
    injectionTimeMIBI?: string;
    injectionPoint?: string;
    technician?: string;
  };
  
  treatment?: {
    ongoingATS?: boolean;
    ongoingThyroidHormone?: boolean;
    ongoingIodine?: boolean;
    ongoingIodinatedContrast?: boolean;
    dciOrCommercialName?: string;
    duration?: string;
    stopDate?: string;
    windowDuration?: string;
  };

  laboratory?: {
    pth?: string;
    calcemia?: string;
    phosphoremia?: string;
    calciuria?: string;
    phosphaturia?: string;
    vitaminD?: string;
    tshus?: string;
    t4l?: string;
    t3l?: string;
  };
  
  echographyImena?: string;
  echographyPrecedent?: string;
  tdm?: string;

  acquisitions?: {
    entryTime?: string;
    acquisitionTime?: string;
    exitTime?: string;
    protocolSubtraction?: boolean;
    protocolDoublePhase?: boolean;
    anteriorCervicalClichés?: string;
    mediastinalImage?: string;
    profile?: string;
    spect?: string;
    lateImage?: string;
  };

  hotConsultation?: {
    examiner?: string;
    details?: string;
  };
  
  contextualAnalysis?: string;
  conclusion?: string;
}
// --- END: Parathyroid Scintigraphy Form Data Types ---


// --- START: Renal DMSA Scintigraphy Form Data Types ---
export interface RenalDMSAScintigraphyData {
  formDate?: string;
  paymentMethod?: PaymentMethod;
  referringDoctor?: string;
  referringService?: string;
  nextAppointmentDate?: string;
  examiner?: string;
  antecedents?: string;

  clinicalExam?: {
    weight?: string;
    height?: string;
    imc?: string;
    ddr?: string;
    isMenopausal?: boolean;
    isBreastfeeding?: boolean;
    hasContraception?: boolean;
    isPregnancyRisk?: boolean;
    appealSigns?: {
        fever?: boolean;
        dysuria?: boolean;
        pollakiuria?: boolean;
        mictionalBurns?: boolean;
        urineTroubles?: boolean;
        hematuria?: boolean;
        lumbarAbdominalPain?: boolean;
    };
  };

  indication?: {
    side?: 'droit' | 'gauche';
    congenitalAnomaly?: {
        jpuSyndrome?: boolean;
        renalDysplasia?: boolean;
        rvu?: boolean;
        renalDuplication?: boolean;
        upValve?: boolean;
        ectopy?: boolean;
        megaureter?: boolean;
        refluxNephropathy?: boolean;
        ureterohydronephrosis?: boolean;
        hydronephrosis?: boolean;
        horseshoeKidney?: boolean;
        smallKidney?: boolean;
    };
    organDonation?: boolean;
    infectionOrOther?: {
        pna?: boolean;
        scarResearch?: boolean;
        sequelaeResearch?: boolean;
        urinaryInfection?: boolean;
    };
    surgicalEvaluation?: {
        preOperative?: boolean;
        postOperative?: boolean;
    };
    morphologicalLesion?: {
        abscess?: boolean;
        cyst?: boolean;
        corticalInfarction?: boolean;
        renalContusion?: boolean;
        renalTumor?: boolean;
    };
  };

  laboratory?: {
    urea?: string;
    creatinine?: string;
    dfg?: string;
    ecbu?: string;
    others?: string;
  };

  imaging?: {
    echography?: string;
    uroscanner?: string;
    uiv?: string;
    scintigraphy?: string;
  };
  
  injectionDetails?: {
    coldMolecule?: string;
    prescribedActivity?: string;
    injectionTime?: string;
    injectedActivity?: string;
    technician?: string;
  };

  treatment?: {
    ongoing?: string;
    medical?: {
        has: boolean;
        date?: string;
        which?: string;
    };
    surgical?: {
        has: boolean;
        date?: string;
        type?: string;
    };
    other?: string;
  };

  acquisitions?: {
    entryTime?: string;
    acquisitionTime?: string;
    exitTime?: string;
    staticViews?: string; // FA/FP/OAD/OPG...
    spect?: boolean;
    delayInjectionAcquisition?: '3H' | '4H' | '5H' | '6H' | 'sup6H';
    lateAcquisition24H?: boolean;
  };

  hotConsultation?: {
    examiner?: string;
    details?: string;
  };
  
  contextualAnalysis?: string;
  conclusion?: string;
}
// --- END: Renal DMSA Scintigraphy Form Data Types ---


// --- START: Renal DTPA/MAG3 Scintigraphy Form Data Types ---
export interface RenalDTPAMAG3ScintigraphyData {
  formDate?: string;
  paymentMethod?: PaymentMethod;
  referringDoctor?: string;
  referringService?: string;
  nextAppointmentDate?: string;
  examiner?: string;
  otherObservation?: string;

  clinicalExam?: {
    weight?: string;
    height?: string;
    imc?: string;
    ddr?: string;
    isMenopausal?: boolean;
    isBreastfeeding?: boolean;
    hasContraception?: boolean;
    isPregnancyRisk?: boolean;
    fever?: boolean;
    diarrhea?: boolean;
    vomiting?: boolean;
    dehydrationSigns?: boolean;
    urinaryLithiasis?: boolean;
    postDrinkPain?: boolean;
  };

  indication?: {
    side?: 'droit' | 'gauche';
    congenitalAnomaly?: {
        jpuSyndrome?: boolean;
        renalDysplasia?: boolean;
        rvu?: boolean;
        renalDuplication?: boolean;
        upValve?: boolean;
        ectopy?: boolean;
        megaureter?: boolean;
        horseshoeKidney?: boolean;
        ureterohydronephrosis?: boolean;
        hydronephrosis?: boolean;
    };
    organDonation?: boolean;
    surgicalEvaluation?: {
        preOperative?: boolean;
        postOperative?: boolean;
        dfg?: boolean;
        captoprilTest?: boolean;
    };
  };
  
  antecedents?: {
    antenatal?: string;
    postnatal?: string;
    malformation?: string;
  };

  laboratory?: {
    urea?: string;
    creatinine?: string;
    dfg?: string;
    ecbu?: string;
    others?: string;
  };

  imaging?: {
    echography?: string;
    uroscanner?: string;
    uiv?: string;
    scintigraphy?: string;
  };
  
  injectionDetails?: {
    coldMolecule?: string;
    prescribedActivity?: string;
    injectionTime?: string;
    injectedActivity?: string;
    technician?: string;
    injectionPoint?: string;
  };
  
  treatment?: {
    medical?: {
        has: boolean;
        date?: string;
        which?: string;
    };
    surgical?: {
        has: boolean;
        date?: string;
        type?: string;
    };
  };

  acquisitions?: {
    entryTime?: string;
    acquisitionTime?: string;
    exitTime?: string;
    dynamicAcquisition?: string;
    preMicturition?: boolean;
    postMicturitionEarly?: '15mn' | '30mn';
    postMicturitionLate?: '1H' | '2H' | '3H' | '4H';
  };
  
  hotConsultation?: {
    examiner?: string;
    details?: string;
  };
  
  contextualAnalysis?: string;
  conclusion?: string;
}
// --- END: Renal DTPA/MAG3 Scintigraphy Form Data Types ---


// --- START: Thyroid Scintigraphy Form Data Types ---
export interface ThyroidScintigraphyData {
  // Section en-tête
  formDate?: string;
  paymentMethod?: PaymentMethod;
  referringDoctor?: string;
  referringService?: string;
  nextAppointmentDate?: string;
  examiner?: string;

  // Section Examen Clinique
  clinicalExam?: {
    weight?: string;
    height?: string;
    imc?: string;
    ta?: string;
    pulse?: string;
    ddr?: string;
    isMenopausal?: boolean;
    isBreastfeeding?: boolean;
    hasContraception?: boolean;
    isPregnancyRisk?: boolean;
    hasExophthalmia?: boolean;
    hasAnteriorCervicalSwelling?: boolean;
    hasLymphNodeStatus?: boolean; // Assuming this is a checkbox for presence
    otherClinicalInfo?: string;
  };

  // Section Indication
  indication?: {
    isHyperthyroidism?: boolean;
    isHyperthyroidismNodule?: boolean;
    isBasedow?: boolean;
    isBasedowNodule?: boolean;
    isGMHN?: boolean; // Goitre Multi-Hétéro-Nodulaire
    isNodule?: boolean;
    isEctopic?: boolean;
    isNeonatalHypothyroidism?: boolean;
    isStromaOvarii?: boolean;
  };

  // Section Cytologie-Anatomo-Pathologie
  cytologyPathology?: string;

  // Section Antécédents
  antecedents?: {
    hasThyroiditis?: boolean;
    hasThyroidSurgery?: boolean;
    hasCervicalRadiotherapy?: boolean;
    hasHereditaryThyroid?: boolean;
    biopsyCytopunction?: string;
  };

  // Section Imagerie
  imaging?: {
    ultrasound?: string;
    ctMri?: string;
    scintigraphy?: string;
  };

  // Section Histoire de la maladie
  illnessHistory?: {
    duration?: string;
    isHyperthyroidism?: boolean;
    isHypothyroidism?: boolean;
    isEuthyroidism?: boolean;
    hasGoiter?: boolean;
    hasNodule?: boolean;
    hasADP?: boolean; // Adénopathie
  };

  // Section Laboratoire
  laboratory?: {
    tshus?: string;
    t3l?: string;
    t4l?: string;
    tg?: string;
    calcitonin?: string;
    acAntiTPO?: string;
    acAntiTSH?: string;
    acAntiTg?: string;
    otherLabInfo?: string;
  };

  // Section Injection (détails sur la fiche de consult)
  injectionDetails?: {
    prescribedActivity?: string;
    injectedActivity?: string;
    injectionTime?: string;
    technician?: string;
    injectionSite?: string;
  };

  // Section Traitement
  treatment?: {
    // En cours
    ongoingATS?: boolean;
    ongoingHormone?: boolean;
    ongoingIodine?: boolean;
    ongoingContrast?: boolean;
    ongoingDCIName?: string;
    ongoingDuration?: string;
    ongoingStopDate?: string;
    ongoingWindowDuration?: string;
    // Anterieur
    previousIratherapy?: string;
    previousOther?: string;
  };
  
  // Section Echographie IMENA
  imenaUltrasound?: {
    examiner?: string;
    details?: string;
  };

  // Section Acquisitions
  acquisitions?: {
    entryTime?: string;
    acquisitionTime?: string;
    exitTime?: string;
    staticAnteriorClichés?: string;
    staticProfileClichés?: string;
    shotCount?: string; // Nombre de coups
    spect?: string;
  };

  // Section Consultation Chaude
  hotConsultation?: {
    examiner?: string;
    details?: string;
  };
  
  // Section Analyse Contextuelle
  contextualAnalysis?: string;
  
  // Section Résultat-Conclusion-Recommandation
  conclusion?: string;
}
// --- END: Thyroid Scintigraphy Form Data Types ---

export interface PatientDocument {
  id: string;
  name: string;
  fileType: string;
  uploadDate: string;
  dataUrl: string; // base64 encoded file with MIME type
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age?: number;
  address?: string;
  phone?: string;
  email?: string;
  referringEntity?: ReferringEntity;
  creationDate: string;
  currentRoomId: RoomId;
  statusInRoom: PatientStatusInRoom;
  history: PatientHistoryEntry[];
  documents?: PatientDocument[];
  roomSpecificData?: {
    [RoomId.REQUEST]?: {
      requestedExam?: string; // Changed from ScintigraphyExam
      // FIX: Add fields from RequestForm to align with application logic.
      indications?: RequestIndications;
      medicalHistory?: string;
      illnessHistory?: string;
      paraclinicalExams?: string;
      // FIX: Relax customFields type to 'any' to match usage and prevent type conflicts.
      customFields?: { [fieldId: string]: any };
    };
    [RoomId.APPOINTMENT]?: {
      dateRdv?: string;
      heureRdv?: string;
      consignesSpecifiques?: string;
    };
    [RoomId.CONSULTATION]?: {
      resumeConsultation?: string;
      decisionSuite?: string;
      // START: Specialized Consultation Data
      thyroidData?: ThyroidScintigraphyData;
      boneData?: BoneScintigraphyData;
      parathyroidData?: ParathyroidScintigraphyData;
      renalDMSAData?: RenalDMSAScintigraphyData;
      renalDTPAMAG3Data?: RenalDTPAMAG3ScintigraphyData;
      // END: Specialized Consultation Data
    };
    [RoomId.INJECTION]?: {
      produitInjecte?: string;
      dose?: string;
      heureInjection?: string;
      voieAdministration?: string;
    };
    [RoomId.EXAMINATION]?: {
      parametresExamen?: string;
      commentairesTechnicien?: string;
      qualiteImages?: 'Excellente' | 'Bonne' | 'Moyenne' | 'Médiocre' | '';
    };
    [RoomId.REPORT]?: {
      texteCompteRendu?: string;
      conclusionCr?: string;
    };
    [RoomId.RETRAIT_CR_SORTIE]?: {
      dateRetrait?: string;
      heureRetrait?: string;
      retirePar?: string;
      commentairesSortie?: string;
    };
  };
}

// --- Specific Data types for Rooms ---
export interface TracerLot {
  id: string;
  productId: string;
  lotNumber: string;
  expiryDate: string;
  calibrationDateTime?: string;
  initialActivity?: number;
  unit: 'MBq' | 'mCi' | 'GBq';
  receivedDate: string;
  quantityReceived: number;
  notes?: string;
}

export interface PreparationLog {
  id: string;
  tracerLotId: string;
  patientId?: string;
  examType?: ScintigraphyExam;
  activityPrepared: number;
  unit: 'MBq' | 'mCi';
  preparationDateTime: string;
  preparedBy: string;
  notes?: string;
}

export interface RadiopharmaceuticalProduct {
  id: string;
  name: string;
  isotope: string;
  unit: 'MBq' | 'mCi' | 'GBq';
}

export interface HotLabData {
  products: RadiopharmaceuticalProduct[];
  lots: TracerLot[];
  preparations: PreparationLog[];
}


export interface Room {
  id: RoomId;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  allowedRoleIds: string[];
  nextRoomId: RoomId | null;
}

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string; // In a real app, this should be a hash.
    roleId: string;
}

export type TimelineEventType = 'appointment' | 'injection' | 'examination';

export interface TimelineEvent {
    id: string;
    time: string; // "HH:mm"
    patient: Patient;
    type: TimelineEventType;
    description: string;
}