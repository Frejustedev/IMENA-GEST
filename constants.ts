



import { Room, UserRole, RoomId, ScintigraphyExam, RadiopharmaceuticalProduct, HotLabData, Patient, PatientStatusInRoom } from './types';
import { ClipboardListIcon } from './components/icons/ClipboardListIcon';
import { CalendarDaysIcon } from './components/icons/CalendarDaysIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { CubeIcon } from './components/icons/CubeIcon';
import { BeakerIcon } from './components/icons/BeakerIcon';
import { CameraIcon } from './components/icons/CameraIcon';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import { ArchiveBoxArrowDownIcon } from './components/icons/ArchiveBoxArrowDownIcon';
import { ArchiveBoxIcon } from './components/icons/ArchiveBoxIcon';

export const USER_ROLES_CONFIG: UserRole[] = [
  UserRole.RECEPTION,
  UserRole.TECHNICIAN,
  UserRole.DOCTOR,
  UserRole.ADMIN,
];

export const SCINTIGRAPHY_EXAMS_LIST: ScintigraphyExam[] = [
  "Scintigraphie Osseuse",
  "Scintigraphie Parathyroïdienne",
  "Scintigraphie Rénale DMSA",
  "Scintigraphie Rénale DTPA/MAG3",
  "Scintigraphie Thyroïdienne",
];

export const RADIOPHARMACEUTICAL_PRODUCTS: RadiopharmaceuticalProduct[] = [
  { id: 'prod_tc99m_pertech', name: '99mTc-Pertechnetate (Éluat)', isotope: '99mTc', unit: 'GBq' },
  { id: 'prod_tc99m_mdp', name: '99mTc-MDP (Kit)', isotope: '99mTc', unit: 'MBq' },
  { id: 'prod_f18_fdg', name: '18F-FDG', isotope: '18F', unit: 'MBq' },
  { id: 'prod_ga68_dotatate', name: '68Ga-DOTATATE', isotope: '68Ga', unit: 'MBq' },
  { id: 'prod_i131_iodure', name: '131I-Iodure de Sodium', isotope: '131I', unit: 'MBq' },
];

export const INITIAL_HOT_LAB_DATA: HotLabData = {
  products: RADIOPHARMACEUTICAL_PRODUCTS,
  lots: [
    {
      id: 'lot_fdg_1',
      productId: 'prod_f18_fdg',
      lotNumber: 'FDG-202407A',
      expiryDate: '2024-12-31',
      calibrationDateTime: '2024-07-20T08:00:00',
      initialActivity: 5000,
      unit: 'MBq',
      receivedDate: '2024-07-20',
      quantityReceived: 1
    },
    {
      id: 'lot_mdp_1',
      productId: 'prod_tc99m_mdp',
      lotNumber: 'MDP-202407B',
      expiryDate: '2025-01-15',
      receivedDate: '2024-07-18',
      quantityReceived: 5,
      unit: 'MBq' // unit for kit
    }
  ],
  preparations: [
    {
      id: 'prep_1',
      tracerLotId: 'lot_fdg_1',
      patientId: 'PAT001', // Link to a patient
      // FIX: Changed "TEP-Scan Thoracique" to a valid ScintigraphyExam type.
      examType: 'Scintigraphie Osseuse',
      activityPrepared: 370,
      unit: 'MBq',
      preparationDateTime: new Date().toISOString(),
      preparedBy: 'Tech Principal'
    }
  ]
};

const additionalPatients: Patient[] = [
  // Stage: REQUEST
  {
    id: 'PAT004', name: 'Luc Martin', dateOfBirth: '1978-05-20', creationDate: '2024-07-22T08:10:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING,
    history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T08:10:00Z', statusMessage: 'Patient créé.' }],
    roomSpecificData: {}
  },
  {
    id: 'PAT005', name: 'Sophie Bernard', dateOfBirth: '1992-02-14', creationDate: '2024-07-22T08:15:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.SEEN,
    history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T08:15:00Z', statusMessage: 'Patient créé.' }, { roomId: RoomId.REQUEST, entryDate: '2024-07-22T08:25:00Z', statusMessage: 'Demande complétée pour Scintigraphie Osseuse. Prêt pour RDV.' }],
    roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} } }
  },
  // ... (9 more in REQUEST)
  { id: 'PAT006', name: 'Pierre Dubois', dateOfBirth: '1963-11-30', creationDate: '2024-07-22T09:00:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T09:00:00Z', statusMessage: 'Patient créé.' }], roomSpecificData: {} },
  { id: 'PAT007', name: 'Camille Robert', dateOfBirth: '1985-07-07', creationDate: '2024-07-22T09:05:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T09:05:00Z', statusMessage: 'Patient créé.' }], roomSpecificData: {} },
  { id: 'PAT008', name: 'Julien Moreau', dateOfBirth: '1995-01-12', creationDate: '2024-07-22T09:20:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.SEEN, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T09:20:00Z', statusMessage: 'Patient créé.' }, { roomId: RoomId.REQUEST, entryDate: '2024-07-22T09:30:00Z', statusMessage: 'Demande complétée pour Scintigraphie Rénale DMSA. Prêt pour RDV.' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DMSA', indications: {} } } },
  { id: 'PAT009', name: 'Emma Laurent', dateOfBirth: '1971-09-18', creationDate: '2024-07-22T09:45:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T09:45:00Z', statusMessage: 'Patient créé.' }], roomSpecificData: {} },
  { id: 'PAT010', name: 'Nicolas Simon', dateOfBirth: '1988-03-25', creationDate: '2024-07-22T10:00:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T10:00:00Z', statusMessage: 'Patient créé.' }], roomSpecificData: {} },
  { id: 'PAT011', name: 'Léa Michel', dateOfBirth: '2000-06-01', creationDate: '2024-07-22T10:15:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.SEEN, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T10:15:00Z', statusMessage: 'Patient créé.' }, { roomId: RoomId.REQUEST, entryDate: '2024-07-22T10:25:00Z', statusMessage: 'Demande complétée pour Scintigraphie Thyroïdienne. Prêt pour RDV.' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} } } },
  { id: 'PAT012', name: 'Alexandre Leroy', dateOfBirth: '1959-12-05', creationDate: '2024-07-22T10:30:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T10:30:00Z', statusMessage: 'Patient créé.' }], roomSpecificData: {} },
  { id: 'PAT013', name: 'Manon Roux', dateOfBirth: '1999-08-22', creationDate: '2024-07-22T10:40:00Z', currentRoomId: RoomId.REQUEST, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-22T10:40:00Z', statusMessage: 'Patient créé.' }], roomSpecificData: {} },
  
  // Stage: APPOINTMENT
  {
    id: 'PAT014', name: 'Thomas David', dateOfBirth: '1981-04-11', creationDate: '2024-07-21T14:00:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING,
    history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T14:00:00Z', exitDate: '2024-07-21T14:10:00Z', statusMessage: 'Demande complétée pour Scintigraphie Osseuse.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T14:10:01Z', statusMessage: 'Entré dans Rendez-vous' }],
    roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} } }
  },
  // ... (9 more in APPOINTMENT)
  { id: 'PAT015', name: 'Chloé Bertrand', dateOfBirth: '1994-10-02', creationDate: '2024-07-21T14:30:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.SEEN, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T14:30:00Z', exitDate: '2024-07-21T14:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T14:40:01Z', statusMessage: 'RDV planifié.' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-25', heureRdv: '10:00' } } },
  { id: 'PAT016', name: 'Antoine Girard', dateOfBirth: '1975-03-19', creationDate: '2024-07-21T15:00:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T15:00:00Z', exitDate: '2024-07-21T15:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T15:10:01Z', statusMessage: 'Entré dans Rendez-vous' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Parathyroïdienne', indications: {} } } },
  { id: 'PAT017', name: 'Pauline Bonnet', dateOfBirth: '1989-08-01', creationDate: '2024-07-21T15:20:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T15:20:00Z', exitDate: '2024-07-21T15:30:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T15:30:01Z', statusMessage: 'Entré dans Rendez-vous' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DTPA/MAG3', indications: {} } } },
  { id: 'PAT018', name: 'Hugo Lefebvre', dateOfBirth: '2001-12-12', creationDate: '2024-07-21T15:45:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.SEEN, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T15:45:00Z', exitDate: '2024-07-21T15:55:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T15:55:01Z', statusMessage: 'RDV planifié.' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-26', heureRdv: '11:30' } } },
  { id: 'PAT019', name: 'Clara Fournier', dateOfBirth: '1968-06-28', creationDate: '2024-07-21T16:00:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T16:00:00Z', exitDate: '2024-07-21T16:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T16:10:01Z', statusMessage: 'Entré dans Rendez-vous' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} } } },
  { id: 'PAT020', name: 'Mathieu Andre', dateOfBirth: '1979-11-15', creationDate: '2024-07-21T16:30:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T16:30:00Z', exitDate: '2024-07-21T16:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T16:40:01Z', statusMessage: 'Entré dans Rendez-vous' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} } } },
  { id: 'PAT021', name: 'Juliette Mercier', dateOfBirth: '1996-05-09', creationDate: '2024-07-21T17:00:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.SEEN, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T17:00:00Z', exitDate: '2024-07-21T17:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T17:10:01Z', statusMessage: 'RDV planifié.' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-29', heureRdv: '09:00' } } },
  { id: 'PAT022', name: 'Romain Petit', dateOfBirth: '1984-02-17', creationDate: '2024-07-21T17:20:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T17:20:00Z', exitDate: '2024-07-21T17:30:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T17:30:01Z', statusMessage: 'Entré dans Rendez-vous' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DMSA', indications: {} } } },
  { id: 'PAT023', name: 'Eva Durand', dateOfBirth: '1990-09-03', creationDate: '2024-07-21T17:45:00Z', currentRoomId: RoomId.APPOINTMENT, statusInRoom: PatientStatusInRoom.WAITING, history: [{ roomId: RoomId.REQUEST, entryDate: '2024-07-21T17:45:00Z', exitDate: '2024-07-21T17:55:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-21T17:55:01Z', statusMessage: 'Entré dans Rendez-vous' }], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} } } },

  // Stage: CONSULTATION
  {
    id: 'PAT024', name: 'Valentin Richard', dateOfBirth: '1976-10-10', creationDate: '2024-07-20T10:00:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.WAITING,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-20T10:00:00Z', exitDate: '2024-07-20T10:10:00Z', statusMessage: 'Demande complétée.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T10:10:01Z', exitDate: '2024-07-22T08:29:59Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T08:30:00Z', statusMessage: 'Entré dans Consultation' },
    ],
    roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '08:30' } }
  },
  // ... (7 more in CONSULTATION)
  { id: 'PAT025', name: 'Alice Lambert', dateOfBirth: '1982-01-23', creationDate: '2024-07-20T11:00:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.SEEN, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T11:00:00Z', exitDate: '2024-07-20T11:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T11:10:01Z', exitDate: '2024-07-22T08:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T09:00:00Z', statusMessage: 'Consultation terminée.' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '09:00' }, [RoomId.CONSULTATION]: { resumeConsultation: 'Patient apte pour l\'examen.' } } },
  { id: 'PAT026', name: 'Théo Rousseau', dateOfBirth: '1993-07-14', creationDate: '2024-07-20T11:30:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T11:30:00Z', exitDate: '2024-07-20T11:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T11:40:01Z', exitDate: '2024-07-22T09:29:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T09:30:00Z', statusMessage: 'Entré dans Consultation' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '09:30' } } },
  { id: 'PAT027', name: 'Laura Vincent', dateOfBirth: '1969-04-05', creationDate: '2024-07-20T12:00:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T12:00:00Z', exitDate: '2024-07-20T12:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T12:10:01Z', exitDate: '2024-07-22T09:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:00:00Z', statusMessage: 'Entré dans Consultation' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DTPA/MAG3', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '10:00' } } },
  { id: 'PAT028', name: 'Quentin Muller', dateOfBirth: '1987-09-21', creationDate: '2024-07-20T12:30:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.SEEN, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T12:30:00Z', exitDate: '2024-07-20T12:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T12:40:01Z', exitDate: '2024-07-22T10:29:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:30:00Z', statusMessage: 'Consultation terminée.' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '10:30' }, [RoomId.CONSULTATION]: { resumeConsultation: 'Vérification des contre-indications.' } } },
  { id: 'PAT029', name: 'Sarah Gomez', dateOfBirth: '1998-11-11', creationDate: '2024-07-20T13:00:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T13:00:00Z', exitDate: '2024-07-20T13:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T13:10:01Z', exitDate: '2024-07-22T10:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T11:00:00Z', statusMessage: 'Entré dans Consultation' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DMSA', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '11:00' } } },
  { id: 'PAT030', name: 'Maxime Chevalier', dateOfBirth: '1965-08-16', creationDate: '2024-07-20T13:30:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T13:30:00Z', exitDate: '2024-07-20T13:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T13:40:01Z', exitDate: '2024-07-22T11:29:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T11:30:00Z', statusMessage: 'Entré dans Consultation' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '11:30' } } },
  { id: 'PAT031', name: 'Inès Lemoine', dateOfBirth: '1974-05-30', creationDate: '2024-07-20T14:00:00Z', currentRoomId: RoomId.CONSULTATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-20T14:00:00Z', exitDate: '2024-07-20T14:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T14:10:01Z', exitDate: '2024-07-22T11:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T12:00:00Z', statusMessage: 'Entré dans Consultation' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '12:00' } } },
  
  // Stage: INJECTION
  {
    id: 'PAT032', name: 'Lucas Perrin', dateOfBirth: '1991-03-08', creationDate: '2024-07-19T09:00:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.SEEN,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-19T09:00:00Z', exitDate: '2024-07-19T09:10:00Z', statusMessage: 'Demande complétée.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T09:10:01Z', exitDate: '2024-07-22T09:29:59Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T09:30:00Z', exitDate: '2024-07-22T09:50:00Z', statusMessage: 'Consultation terminée.' },
      { roomId: RoomId.INJECTION, entryDate: '2024-07-22T09:50:01Z', statusMessage: 'Injection enregistrée.' },
    ],
    roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '09:30' }, [RoomId.CONSULTATION]: { resumeConsultation: 'RAS' }, [RoomId.INJECTION]: { produitInjecte: '18F-FDG', dose: '370MBq', heureInjection: '10:05' } }
  },
  // ... (7 more in INJECTION)
  { id: 'PAT033', name: 'Jade Faure', dateOfBirth: '1986-12-24', creationDate: '2024-07-19T09:30:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T09:30:00Z', exitDate: '2024-07-19T09:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T09:40:01Z', exitDate: '2024-07-22T09:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:00:00Z', exitDate: '2024-07-22T10:20:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T10:20:01Z', statusMessage: 'Entré dans Injection' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '10:00' } } },
  { id: 'PAT034', name: 'Gabriel Meyer', dateOfBirth: '1970-02-02', creationDate: '2024-07-19T10:00:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T10:00:00Z', exitDate: '2024-07-19T10:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T10:10:01Z', exitDate: '2024-07-22T10:29:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:30:00Z', exitDate: '2024-07-22T10:50:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T10:50:01Z', statusMessage: 'Entré dans Injection' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Parathyroïdienne', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '10:30' } } },
  { id: 'PAT035', name: 'Louise Adam', dateOfBirth: '1997-07-27', creationDate: '2024-07-19T10:30:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T10:30:00Z', exitDate: '2024-07-19T10:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T10:40:01Z', exitDate: '2024-07-22T10:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T11:00:00Z', exitDate: '2024-07-22T11:20:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T11:20:01Z', statusMessage: 'Entré dans Injection' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DMSA', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '11:00' } } },
  { id: 'PAT036', name: 'Arthur Caron', dateOfBirth: '1961-09-09', creationDate: '2024-07-19T11:00:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.SEEN, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T11:00:00Z', exitDate: '2024-07-19T11:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T11:10:01Z', exitDate: '2024-07-22T11:29:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T11:30:00Z', exitDate: '2024-07-22T11:50:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T11:50:01Z', statusMessage: 'Injection enregistrée.' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '11:30' }, [RoomId.CONSULTATION]: { resumeConsultation: 'OK' }, [RoomId.INJECTION]: { produitInjecte: '99mTc-MDP', dose: '740MBq', heureInjection: '12:00' } } },
  { id: 'PAT037', name: 'Rose Henry', dateOfBirth: '2002-04-18', creationDate: '2024-07-19T11:30:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T11:30:00Z', exitDate: '2024-07-19T11:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T11:40:01Z', exitDate: '2024-07-22T11:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T12:00:00Z', exitDate: '2024-07-22T12:20:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T12:20:01Z', statusMessage: 'Entré dans Injection' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DTPA/MAG3', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '12:00' } } },
  { id: 'PAT038', name: 'Louis Garnier', dateOfBirth: '1958-08-31', creationDate: '2024-07-19T12:00:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T12:00:00Z', exitDate: '2024-07-19T12:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T12:10:01Z', exitDate: '2024-07-22T12:29:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T12:30:00Z', exitDate: '2024-07-22T12:50:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T12:50:01Z', statusMessage: 'Entré dans Injection' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Parathyroïdienne', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '12:30' } } },
  { id: 'PAT039', name: 'Anna Boyer', dateOfBirth: '1973-10-04', creationDate: '2024-07-19T12:30:00Z', currentRoomId: RoomId.INJECTION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-19T12:30:00Z', exitDate: '2024-07-19T12:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T12:40:01Z', exitDate: '2024-07-22T12:59:59Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T13:00:00Z', exitDate: '2024-07-22T13:20:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T13:20:01Z', statusMessage: 'Entré dans Injection' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.APPOINTMENT]: { dateRdv: '2024-07-22', heureRdv: '13:00' } } },

  // Stage: EXAMINATION
  {
    id: 'PAT040', name: 'Raphaël Dufour', dateOfBirth: '1966-01-15', creationDate: '2024-07-18T14:00:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.WAITING,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-18T14:00:00Z', exitDate: '2024-07-18T14:10:00Z', statusMessage: 'Demande complétée.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T14:10:01Z', exitDate: '2024-07-22T10:00:00Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:00:01Z', exitDate: '2024-07-22T10:25:00Z', statusMessage: 'Consultation terminée.' },
      { roomId: RoomId.INJECTION, entryDate: '2024-07-22T10:25:01Z', exitDate: '2024-07-22T11:30:00Z', statusMessage: 'Injection enregistrée.' },
      { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T11:30:01Z', statusMessage: 'Entré dans Examen' },
    ],
    roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.INJECTION]: { heureInjection: '10:30' } }
  },
   // ... (6 more in EXAMINATION)
  { id: 'PAT041', name: 'Margot Hubert', dateOfBirth: '1995-05-05', creationDate: '2024-07-18T14:30:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.SEEN, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-18T14:30:00Z', exitDate: '2024-07-18T14:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T14:40:01Z', exitDate: '2024-07-22T10:30:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:30:01Z', exitDate: '2024-07-22T10:55:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T10:55:01Z', exitDate: '2024-07-22T12:00:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T12:00:01Z', statusMessage: 'Examen saisi.' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.INJECTION]: { heureInjection: '11:00' }, [RoomId.EXAMINATION]: { qualiteImages: 'Bonne' } } },
  { id: 'PAT042', name: 'Baptiste Colin', dateOfBirth: '1980-08-08', creationDate: '2024-07-18T15:00:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-18T15:00:00Z', exitDate: '2024-07-18T15:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T15:10:01Z', exitDate: '2024-07-22T11:00:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T11:00:01Z', exitDate: '2024-07-22T11:25:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T11:25:01Z', exitDate: '2024-07-22T12:30:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T12:30:01Z', statusMessage: 'Entré dans Examen' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} }, [RoomId.INJECTION]: { heureInjection: '11:30' } } },
  { id: 'PAT043', name: 'Charlotte Gauthier', dateOfBirth: '1977-11-20', creationDate: '2024-07-18T15:30:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-18T15:30:00Z', exitDate: '2024-07-18T15:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T15:40:01Z', exitDate: '2024-07-22T11:30:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T11:30:01Z', exitDate: '2024-07-22T11:55:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T11:55:01Z', exitDate: '2024-07-22T13:00:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T13:00:01Z', statusMessage: 'Entré dans Examen' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.INJECTION]: { heureInjection: '12:00' } } },
  { id: 'PAT044', name: 'Enzo Marchand', dateOfBirth: '2003-02-28', creationDate: '2024-07-18T16:00:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-18T16:00:00Z', exitDate: '2024-07-18T16:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T16:10:01Z', exitDate: '2024-07-22T12:00:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T12:00:01Z', exitDate: '2024-07-22T12:25:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T12:25:01Z', exitDate: '2024-07-22T13:30:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T13:30:01Z', statusMessage: 'Entré dans Examen' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.INJECTION]: { heureInjection: '12:30' } } },
  { id: 'PAT045', name: 'Jules Masson', dateOfBirth: '1960-06-10', creationDate: '2024-07-18T16:30:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.SEEN, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-18T16:30:00Z', exitDate: '2024-07-18T16:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T16:40:01Z', exitDate: '2024-07-22T12:30:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T12:30:01Z', exitDate: '2024-07-22T12:55:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T12:55:01Z', exitDate: '2024-07-22T14:00:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T14:00:01Z', statusMessage: 'Examen saisi.' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DMSA', indications: {} }, [RoomId.INJECTION]: { heureInjection: '13:00' }, [RoomId.EXAMINATION]: { qualiteImages: 'Excellente' } } },
  { id: 'PAT046', name: 'Lina Brunet', dateOfBirth: '1983-09-01', creationDate: '2024-07-18T17:00:00Z', currentRoomId: RoomId.EXAMINATION, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-18T17:00:00Z', exitDate: '2024-07-18T17:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-18T17:10:01Z', exitDate: '2024-07-22T13:00:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T13:00:01Z', exitDate: '2024-07-22T13:25:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T13:25:01Z', exitDate: '2024-07-22T14:30:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T14:30:01Z', statusMessage: 'Entré dans Examen' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Rénale DTPA/MAG3', indications: {} }, [RoomId.INJECTION]: { heureInjection: '13:30' } } },

  // Stage: REPORT
  {
    id: 'PAT047', name: 'Axel Philippe', dateOfBirth: '1972-07-03', creationDate: '2024-07-17T09:00:00Z', currentRoomId: RoomId.REPORT, statusInRoom: PatientStatusInRoom.WAITING,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-17T09:00:00Z', exitDate: '2024-07-17T09:10:00Z', statusMessage: 'Demande complétée.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-17T09:10:01Z', exitDate: '2024-07-22T08:30:00Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T08:30:01Z', exitDate: '2024-07-22T08:55:00Z', statusMessage: 'Consultation terminée.' },
      { roomId: RoomId.INJECTION, entryDate: '2024-07-22T08:55:01Z', exitDate: '2024-07-22T10:00:00Z', statusMessage: 'Injection enregistrée.' },
      { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T10:00:01Z', exitDate: '2024-07-22T10:45:00Z', statusMessage: 'Examen saisi.' },
      { roomId: RoomId.REPORT, entryDate: '2024-07-22T10:45:01Z', statusMessage: 'Entré dans Compte Rendu' },
    ],
    roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.EXAMINATION]: { qualiteImages: 'Bonne' } }
  },
   // ... (4 more in REPORT)
  { id: 'PAT048', name: 'Lola Carpentier', dateOfBirth: '1990-12-12', creationDate: '2024-07-17T09:30:00Z', currentRoomId: RoomId.REPORT, statusInRoom: PatientStatusInRoom.SEEN, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-17T09:30:00Z', exitDate: '2024-07-17T09:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-17T09:40:01Z', exitDate: '2024-07-22T09:00:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T09:00:01Z', exitDate: '2024-07-22T09:25:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T09:25:01Z', exitDate: '2024-07-22T10:30:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T10:30:01Z', exitDate: '2024-07-22T11:15:00Z', statusMessage: 'Examen saisi.' }, { roomId: RoomId.REPORT, entryDate: '2024-07-22T11:15:01Z', statusMessage: 'CR Rédigé.' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.EXAMINATION]: { qualiteImages: 'Excellente' }, [RoomId.REPORT]: { conclusionCr: 'Absence de fixation pathologique.' } } },
  { id: 'PAT049', name: 'Yanis Schmitt', dateOfBirth: '1964-03-22', creationDate: '2024-07-17T10:00:00Z', currentRoomId: RoomId.REPORT, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-17T10:00:00Z', exitDate: '2024-07-17T10:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-17T10:10:01Z', exitDate: '2024-07-22T09:30:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T09:30:01Z', exitDate: '2024-07-22T09:55:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T09:55:01Z', exitDate: '2024-07-22T11:00:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T11:00:01Z', exitDate: '2024-07-22T11:45:00Z', statusMessage: 'Examen saisi.' }, { roomId: RoomId.REPORT, entryDate: '2024-07-22T11:45:01Z', statusMessage: 'Entré dans Compte Rendu' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} }, [RoomId.EXAMINATION]: { qualiteImages: 'Moyenne' } } },
  { id: 'PAT050', name: 'Zoé Legrand', dateOfBirth: '1988-08-14', creationDate: '2024-07-17T10:30:00Z', currentRoomId: RoomId.REPORT, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-17T10:30:00Z', exitDate: '2024-07-17T10:40:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-17T10:40:01Z', exitDate: '2024-07-22T10:00:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:00:01Z', exitDate: '2024-07-22T10:25:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T10:25:01Z', exitDate: '2024-07-22T11:30:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T11:30:01Z', exitDate: '2024-07-22T12:15:00Z', statusMessage: 'Examen saisi.' }, { roomId: RoomId.REPORT, entryDate: '2024-07-22T12:15:01Z', statusMessage: 'Entré dans Compte Rendu' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.EXAMINATION]: { qualiteImages: 'Bonne' } } },
  { id: 'PAT051', name: 'Clément Royer', dateOfBirth: '1955-04-01', creationDate: '2024-07-17T11:00:00Z', currentRoomId: RoomId.REPORT, statusInRoom: PatientStatusInRoom.WAITING, history: [ { roomId: RoomId.REQUEST, entryDate: '2024-07-17T11:00:00Z', exitDate: '2024-07-17T11:10:00Z', statusMessage: 'Demande complétée.' }, { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-17T11:10:01Z', exitDate: '2024-07-22T10:30:00Z', statusMessage: 'RDV planifié.' }, { roomId: RoomId.CONSULTATION, entryDate: '2024-07-22T10:30:01Z', exitDate: '2024-07-22T10:55:00Z', statusMessage: 'Consultation terminée.' }, { roomId: RoomId.INJECTION, entryDate: '2024-07-22T10:55:01Z', exitDate: '2024-07-22T12:00:00Z', statusMessage: 'Injection enregistrée.' }, { roomId: RoomId.EXAMINATION, entryDate: '2024-07-22T12:00:01Z', exitDate: '2024-07-22T12:45:00Z', statusMessage: 'Examen saisi.' }, { roomId: RoomId.REPORT, entryDate: '2024-07-22T12:45:01Z', statusMessage: 'Entré dans Compte Rendu' } ], roomSpecificData: { [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: {} }, [RoomId.EXAMINATION]: { qualiteImages: 'Bonne' } } },

  // Stage: RETRAIT_CR_SORTIE
  {
    id: 'PAT052', name: 'Noémie Picot', dateOfBirth: '1983-06-19', creationDate: '2024-07-16T11:00:00Z', currentRoomId: RoomId.RETRAIT_CR_SORTIE, statusInRoom: PatientStatusInRoom.WAITING,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-16T11:00:00Z', exitDate: '2024-07-16T11:10:00Z', statusMessage: 'Demande complétée.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-16T11:10:01Z', exitDate: '2024-07-21T10:00:00Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-21T10:00:01Z', exitDate: '2024-07-21T10:25:00Z', statusMessage: 'Consultation terminée.' },
      { roomId: RoomId.INJECTION, entryDate: '2024-07-21T10:25:01Z', exitDate: '2024-07-21T11:30:00Z', statusMessage: 'Injection enregistrée.' },
      { roomId: RoomId.EXAMINATION, entryDate: '2024-07-21T11:30:01Z', exitDate: '2024-07-21T12:15:00Z', statusMessage: 'Examen saisi.' },
      { roomId: RoomId.REPORT, entryDate: '2024-07-21T12:15:01Z', exitDate: '2024-07-22T09:00:00Z', statusMessage: 'CR Rédigé.' },
      { roomId: RoomId.RETRAIT_CR_SORTIE, entryDate: '2024-07-22T09:00:01Z', statusMessage: 'Entré dans Retrait CR et Sortie' },
    ],
    roomSpecificData: { [RoomId.REPORT]: { conclusionCr: 'Examen dans les limites de la normale.' } }
  },
  {
    id: 'PAT053', name: 'Maël Da Silva', dateOfBirth: '1999-01-01', creationDate: '2024-07-16T12:00:00Z', currentRoomId: RoomId.RETRAIT_CR_SORTIE, statusInRoom: PatientStatusInRoom.SEEN,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-16T12:00:00Z', exitDate: '2024-07-16T12:10:00Z', statusMessage: 'Demande complétée.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-16T12:10:01Z', exitDate: '2024-07-21T10:30:00Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-21T10:30:01Z', exitDate: '2024-07-21T10:55:00Z', statusMessage: 'Consultation terminée.' },
      { roomId: RoomId.INJECTION, entryDate: '2024-07-21T10:55:01Z', exitDate: '2024-07-21T12:00:00Z', statusMessage: 'Injection enregistrée.' },
      { roomId: RoomId.EXAMINATION, entryDate: '2024-07-21T12:00:01Z', exitDate: '2024-07-21T12:45:00Z', statusMessage: 'Examen saisi.' },
      { roomId: RoomId.REPORT, entryDate: '2024-07-21T12:45:01Z', exitDate: '2024-07-22T09:30:00Z', statusMessage: 'CR Rédigé.' },
      { roomId: RoomId.RETRAIT_CR_SORTIE, entryDate: '2024-07-22T09:30:01Z', statusMessage: 'Retrait CR Effectué.' },
    ],
    roomSpecificData: { [RoomId.REPORT]: { conclusionCr: 'RAS' }, [RoomId.RETRAIT_CR_SORTIE]: { retirePar: 'Patient' } }
  },
];


export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT001',
    name: 'Jean Dupont',
    dateOfBirth: '1965-03-15',
    creationDate: '2024-07-19T09:00:00Z',
    currentRoomId: RoomId.INJECTION,
    statusInRoom: PatientStatusInRoom.WAITING,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-19T09:00:00Z', statusMessage: 'Patient créé.' },
      { roomId: RoomId.REQUEST, entryDate: '2024-07-19T09:15:00Z', exitDate: '2024-07-19T10:00:00Z', statusMessage: 'Demande complétée pour Scintigraphie Osseuse.' },
      { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-19T10:00:01Z', exitDate: '2024-07-19T10:05:00Z', statusMessage: 'RDV planifié.' },
      { roomId: RoomId.CONSULTATION, entryDate: '2024-07-20T08:30:00Z', exitDate: '2024-07-20T08:55:00Z', statusMessage: 'Consultation terminée.' },
      { roomId: RoomId.INJECTION, entryDate: '2024-07-20T09:00:00Z', statusMessage: 'Entré dans Injection' }
    ],
    roomSpecificData: {
      [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: { bilanExtensionInitial: true } },
      [RoomId.APPOINTMENT]: { dateRdv: '2024-07-20', heureRdv: '08:30' },
      [RoomId.CONSULTATION]: { resumeConsultation: 'Patient apte pour l\'examen.' }
    }
  },
  {
    id: 'PAT002',
    name: 'Marie Curie',
    dateOfBirth: '1950-11-07',
    creationDate: '2024-07-20T10:00:00Z',
    currentRoomId: RoomId.REQUEST,
    statusInRoom: PatientStatusInRoom.SEEN,
    history: [
      { roomId: RoomId.REQUEST, entryDate: '2024-07-20T10:00:00Z', statusMessage: 'Patient créé.' },
      { roomId: RoomId.REQUEST, entryDate: '2024-07-20T10:10:00Z', statusMessage: 'Demande complétée pour Scintigraphie Osseuse. Prêt pour RDV.' }
    ],
    roomSpecificData: {
      [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Osseuse', indications: { autres: 'Douleurs osseuses diffuses.' } }
    }
  },
  {
    id: 'PAT003',
    name: 'Louis Pasteur',
    dateOfBirth: '1982-08-25',
    creationDate: '2024-07-20T11:00:00Z',
    currentRoomId: RoomId.APPOINTMENT,
    statusInRoom: PatientStatusInRoom.WAITING,
    history: [
       { roomId: RoomId.REQUEST, entryDate: '2024-07-20T11:00:00Z', exitDate: '2024-07-20T11:15:00Z', statusMessage: 'Patient créé et demande complétée pour Scintigraphie Thyroïdienne.' },
       { roomId: RoomId.APPOINTMENT, entryDate: '2024-07-20T11:15:01Z', statusMessage: 'Entré dans Rendez-vous' }
    ],
    roomSpecificData: {
       [RoomId.REQUEST]: { requestedExam: 'Scintigraphie Thyroïdienne', indications: {} }
    }
  },
  ...additionalPatients
];

export const ROOMS_CONFIG: Room[] = [
  {
    id: RoomId.REQUEST,
    name: 'Accueil et Demandes',
    description: 'Création des patients et enregistrement des demandes d\'examens.',
    icon: ClipboardListIcon,
    allowedRoles: [UserRole.RECEPTION, UserRole.ADMIN],
    nextRoomId: RoomId.APPOINTMENT,
  },
  {
    id: RoomId.APPOINTMENT,
    name: 'Rendez-vous',
    description: 'Planification et gestion des rendez-vous.',
    icon: CalendarDaysIcon,
    allowedRoles: [UserRole.RECEPTION, UserRole.ADMIN],
    nextRoomId: RoomId.CONSULTATION,
  },
  {
    id: RoomId.CONSULTATION,
    name: 'Consultation',
    description: 'Consultations pré-examen avec les médecins.',
    icon: UsersIcon,
    allowedRoles: [UserRole.DOCTOR, UserRole.ADMIN],
    nextRoomId: RoomId.INJECTION,
  },
  {
    id: RoomId.GENERATOR, // Maintenant "Gestion Labo Chaud"
    name: 'Gestion Labo Chaud', 
    description: 'Gestion des produits radiopharmaceutiques, lots et préparations.',
    icon: CubeIcon, 
    allowedRoles: [UserRole.TECHNICIAN, UserRole.ADMIN],
    nextRoomId: null, // Ce n'est plus une étape patient séquentielle.
  },
  {
    id: RoomId.INJECTION,
    name: 'Injection',
    description: 'Administration des traceurs aux patients.',
    icon: BeakerIcon, 
    allowedRoles: [UserRole.TECHNICIAN, UserRole.DOCTOR, UserRole.ADMIN],
    nextRoomId: RoomId.EXAMINATION,
  },
  {
    id: RoomId.EXAMINATION,
    name: 'Examen',
    description: 'Réalisation des examens de médecine nucléaire.',
    icon: CameraIcon, 
    allowedRoles: [UserRole.TECHNICIAN, UserRole.DOCTOR, UserRole.ADMIN],
    nextRoomId: RoomId.REPORT,
  },
  {
    id: RoomId.REPORT,
    name: 'Compte Rendu',
    description: 'Rédaction et validation des comptes rendus.',
    icon: DocumentTextIcon,
    allowedRoles: [UserRole.DOCTOR, UserRole.ADMIN],
    nextRoomId: RoomId.RETRAIT_CR_SORTIE, 
  },
  {
    id: RoomId.RETRAIT_CR_SORTIE,
    name: 'Retrait CR et Sortie',
    description: 'Remise du compte rendu au patient et finalisation du dossier.',
    icon: ArchiveBoxArrowDownIcon,
    allowedRoles: [UserRole.RECEPTION, UserRole.ADMIN],
    nextRoomId: RoomId.ARCHIVE,
  },
  {
    id: RoomId.ARCHIVE,
    name: 'Archives',
    description: 'Dossiers des patients archivés.',
    icon: ArchiveBoxIcon,
    allowedRoles: [UserRole.RECEPTION, UserRole.DOCTOR, UserRole.ADMIN],
    nextRoomId: null,
  }
];