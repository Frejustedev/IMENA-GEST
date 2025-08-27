import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RoomNavigation } from './components/RoomNavigation';
import { RoomView } from './components/RoomView';
import { PatientFormModal } from './components/PatientFormModal';
import { CreatePatientModal } from './components/CreatePatientModal';
import { GlobalSearchView } from './components/GlobalSearchView';
import { DailyWorklistView } from './components/DailyWorklistView';
import { PatientDetailView } from './components/PatientDetailView';
import { RoomsOverview } from './components/RoomsOverview';
import { ActivityFeedView } from './components/ActivityFeedView';
import { StatisticsView } from './components/StatisticsView';
import { HotLabView } from './components/HotLabView';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AdministrationView } from './components/AdministrationView';
// FIX: Import TracerLot and PreparationLog to fix type errors in Hot Lab data handlers.
import { 
  Patient, Room, UserRole, RoomId, PatientStatusInRoom, PatientHistoryEntry, 
  PeriodOption, ActiveView, HotLabData, User, TracerLot, PreparationLog,
  ReferringEntity, RequestIndications
} from './types';
import { ROOMS_CONFIG, INITIAL_PATIENTS, INITIAL_HOT_LAB_DATA } from './constants';
import { calculateTimeDiff, formatDuration } from './utils/delayUtils';
import { calculateAge } from './utils/dateUtils';

// --- Auth Service (simulated with localStorage) ---
const USERS_STORAGE_KEY = 'gestion_patient_mn_users';
const SESSION_STORAGE_KEY = 'gestion_patient_mn_session';

const getInitialUsers = (): User[] => {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) return JSON.parse(savedUsers);
    
    // Default admin user if none exist
    const initialAdmin: User = {
      id: 'admin_user_01',
      name: 'Admin Principal',
      email: 'admin@mn.com',
      passwordHash: 'admin123', // PLAIN TEXT for this simulation
      role: UserRole.ADMIN,
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([initialAdmin]));
    return [initialAdmin];
  } catch (error) {
    console.error("Erreur lors de l'initialisation des utilisateurs:", error);
    return [];
  }
};

const authService = {
  login: (email: string, password: string): User | null => {
    const users = getInitialUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
    if (user) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },
  register: (name: string, email: string, password: string, role: UserRole): { success: boolean, message?: string, user?: User } => {
    const users = getInitialUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Un utilisateur avec cet email existe déjà." };
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: password, // Not hashed in this simulation
      role
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },
  logout: () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  },
  getCurrentUser: (): User | null => {
    try {
      const session = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      return null;
    }
  }
};

// --- Main App Component ---
function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS.map(p => ({...p, age: calculateAge(p.dateOfBirth)})));
  const [activeRoomId, setActiveRoomId] = useState<RoomId | null>(RoomId.REQUEST);
  const [activeView, setActiveView] = useState<ActiveView>('rooms_overview');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientFormModalOpen, setIsPatientFormModalOpen] = useState(false);
  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{ patientId: string; roomId: RoomId } | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [hotLabData, setHotLabData] = useState<HotLabData>(INITIAL_HOT_LAB_DATA);

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // --- Authentication Handlers ---
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const user = authService.login(email, password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  
  const handleRegister = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; message?: string }> => {
    const result = authService.register(name, email, password, role);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  };
  
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  // --- Derived State and Data Filtering ---
  const visibleRooms = ROOMS_CONFIG.filter(room => currentUser && room.allowedRoles.includes(currentUser.role));
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term.trim() !== '') {
      setActiveView('search');
    } else if (activeView === 'search') {
      setActiveView('rooms_overview'); // Return to default view when search is cleared
    }
  };
  
  const searchResults = searchTerm.trim() 
    ? patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];

  const patientsInRoom = patients.filter(p => p.currentRoomId === activeRoomId);
  const currentRoom = visibleRooms.find(room => room.id === activeRoomId);

  // --- Modal Handlers ---
  const handleOpenPatientFormModal = (patientId: string, roomId: RoomId) => {
    setModalContext({ patientId, roomId });
    setIsPatientFormModalOpen(true);
  };
  
  const handleOpenCreatePatientModal = () => setIsCreatePatientModalOpen(true);
  
  // --- Patient Data Handlers ---
  const getCompletionMessage = (roomId: RoomId, roomData: any): string => {
    switch (roomId) {
        case RoomId.REQUEST:
            return `Demande complétée pour ${roomData.requestedExam || 'examen non spécifié'}.`;
        case RoomId.APPOINTMENT:
            return `RDV planifié pour le ${roomData.dateRdv || 'N/A'} à ${roomData.heureRdv || 'N/A'}.`;
        case RoomId.CONSULTATION:
            return "Consultation terminée.";
        case RoomId.INJECTION:
            const injected = roomData.injectedActivity || roomData.mibiInjectedActivity;
            const product = roomData.coldMolecule || (roomData.mibiInjectedActivity ? 'MIBI' : 'N/A');
            return `Injection de ${injected || 'N/A'} (${product}) enregistrée.`;
        case RoomId.EXAMINATION:
            return `Examen saisi (Qualité: ${roomData.qualiteImages || 'N/A'}).`;
        case RoomId.REPORT:
            return "Compte Rendu rédigé.";
        case RoomId.RETRAIT_CR_SORTIE:
            return `Retrait CR effectué par ${roomData.retirePar || 'N/A'}. Le dossier du patient a été archivé.`;
        default:
            return `Action complétée.`;
    }
  };
  
  const handlePatientFormSubmit = (patientId: string, roomId: RoomId, formData: any) => {
    const roomConfig = ROOMS_CONFIG.find(r => r.id === roomId);
    if (!roomConfig) return;

    const nextRoomId = roomConfig.nextRoomId;
    const now = new Date().toISOString();

    setPatients(prevPatients => {
        const patientIndex = prevPatients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return prevPatients;

        const updatedPatients = [...prevPatients];
        let patientToUpdate = { ...updatedPatients[patientIndex] };
        
        if (roomId === RoomId.INJECTION) {
            const requestedExam = patientToUpdate.roomSpecificData?.[RoomId.REQUEST]?.requestedExam;
            let dataKey: keyof NonNullable<Patient['roomSpecificData']>[RoomId.CONSULTATION] | null = null;
            switch(requestedExam) {
                case "Scintigraphie Thyroïdienne": dataKey = 'thyroidData'; break;
                case "Scintigraphie Osseuse": dataKey = 'boneData'; break;
                case "Scintigraphie Parathyroïdienne": dataKey = 'parathyroidData'; break;
                case "Scintigraphie Rénale DMSA": dataKey = 'renalDMSAData'; break;
                case "Scintigraphie Rénale DTPA/MAG3": dataKey = 'renalDTPAMAG3Data'; break;
            }

            if (dataKey) {
                const existingConsultationData = patientToUpdate.roomSpecificData?.[RoomId.CONSULTATION] || {};
                const existingExamData = existingConsultationData[dataKey] || {};
                
                patientToUpdate.roomSpecificData = {
                    ...patientToUpdate.roomSpecificData,
                    [RoomId.CONSULTATION]: {
                        ...existingConsultationData,
                        [dataKey]: {
                            ...existingExamData,
                            injectionDetails: formData,
                        }
                    },
                    [RoomId.INJECTION]: {
                        produitInjecte: formData.coldMolecule || formData.mibiInjectedActivity || formData.injectedActivity || 'N/A',
                        dose: formData.injectedActivity || formData.mibiInjectedActivity || 'N/A',
                        heureInjection: formData.injectionTime || formData.injectionTimeMIBI || 'N/A',
                        voieAdministration: formData.injectionPoint || formData.injectionSite || 'N/A'
                    }
                };
            }
        } else {
             patientToUpdate.roomSpecificData = {
                ...patientToUpdate.roomSpecificData,
                [roomId]: formData,
            };
        }

        let newHistory = [...patientToUpdate.history];

        const lastHistoryEntry = newHistory[newHistory.length - 1];
        if (lastHistoryEntry && lastHistoryEntry.roomId === roomId && !lastHistoryEntry.exitDate) {
             lastHistoryEntry.exitDate = now;
        }

        const completionMessage = getCompletionMessage(roomId, formData);
        newHistory.push({
            roomId: roomId,
            entryDate: now,
            exitDate: nextRoomId ? now : undefined,
            statusMessage: completionMessage,
        });
        
        if (nextRoomId) {
            patientToUpdate.currentRoomId = nextRoomId;
            patientToUpdate.statusInRoom = PatientStatusInRoom.WAITING;
            
            const nextRoomConfig = ROOMS_CONFIG.find(r => r.id === nextRoomId);
            const entryMessage = `Entré dans ${nextRoomConfig?.name || nextRoomId}`;
            
            newHistory.push({
                roomId: nextRoomId,
                entryDate: now,
                statusMessage: entryMessage,
            });

            if (nextRoomId === RoomId.ARCHIVE) {
                patientToUpdate.statusInRoom = PatientStatusInRoom.SEEN;
                const archiveEntry = newHistory[newHistory.length-1];
                archiveEntry.statusMessage = "Dossier archivé.";
                archiveEntry.exitDate = now;
            }
        } else {
            patientToUpdate.statusInRoom = PatientStatusInRoom.SEEN;
        }

        patientToUpdate.history = newHistory;
        updatedPatients[patientIndex] = patientToUpdate;
        return updatedPatients;
    });
    
    setIsPatientFormModalOpen(false);
  };

  const handleCreatePatient = (
    patientData: {
      name: string;
      dateOfBirth: string;
      address?: string;
      phone?: string;
      email?: string;
      referringEntity?: ReferringEntity;
    },
    requestData: {
      requestedExam?: any;
      indications?: RequestIndications;
    }
  ) => {
    const now = new Date().toISOString();
    const newPatient: Patient = {
      id: `PAT${String(Date.now()).slice(-4)}${String(patients.length + 1)}`,
      ...patientData,
      age: calculateAge(patientData.dateOfBirth),
      creationDate: now,
      currentRoomId: RoomId.REQUEST,
      statusInRoom: PatientStatusInRoom.WAITING,
      history: [{
        roomId: RoomId.REQUEST,
        entryDate: now,
        statusMessage: 'Patient créé.'
      }],
      roomSpecificData: {}
    };

    if (!requestData.requestedExam) {
        setPatients(prev => [...prev, newPatient]);
        setIsCreatePatientModalOpen(false);
        return;
    }
    
    newPatient.roomSpecificData = { [RoomId.REQUEST]: requestData };
    newPatient.history[0].exitDate = now;
    
    const completionMessage = `Demande complétée pour ${requestData.requestedExam}.`;
    newPatient.history.push({
        roomId: RoomId.REQUEST,
        entryDate: now,
        exitDate: now,
        statusMessage: completionMessage,
    });

    const requestRoomConfig = ROOMS_CONFIG.find(r => r.id === RoomId.REQUEST)!;
    const nextRoomId = requestRoomConfig.nextRoomId!;
    const nextRoomConfig = ROOMS_CONFIG.find(r => r.id === nextRoomId)!;

    newPatient.currentRoomId = nextRoomId;
    newPatient.statusInRoom = PatientStatusInRoom.WAITING;
    newPatient.history.push({
        roomId: nextRoomId,
        entryDate: now,
        statusMessage: `Entré dans ${nextRoomConfig.name}`
    });
    
    setPatients(prev => [...prev, newPatient]);
    setIsCreatePatientModalOpen(false);
  };

  const handleMovePatient = useCallback((patientId: string, targetRoomId: RoomId) => {
    setPatients(prevPatients => {
        const patientIndex = prevPatients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return prevPatients;

        const updatedPatients = [...prevPatients];
        const patientToUpdate = { ...updatedPatients[patientIndex] };
        const now = new Date().toISOString();
        const currentRoomId = patientToUpdate.currentRoomId;
        const targetRoomConfig = ROOMS_CONFIG.find(r => r.id === targetRoomId);

        let newHistory = [...patientToUpdate.history];
        const lastEntryIndex = newHistory.map(h => h.roomId).lastIndexOf(currentRoomId);
        if (lastEntryIndex > -1) {
            newHistory[lastEntryIndex] = { ...newHistory[lastEntryIndex], exitDate: now };
        }
        
        newHistory.push({
            roomId: targetRoomId,
            entryDate: now,
            statusMessage: `Entré dans ${targetRoomConfig?.name || targetRoomId}`,
        });

        patientToUpdate.currentRoomId = targetRoomId;
        patientToUpdate.statusInRoom = PatientStatusInRoom.WAITING;
        patientToUpdate.history = newHistory;
        
        updatedPatients[patientIndex] = patientToUpdate;
        return updatedPatients;
    });
  }, []);

  // --- Hot Lab Data Handlers ---
  const handleAddTracerLot = (newLot: Omit<TracerLot, 'id'>) => {
    const lotWithId: TracerLot = {
      ...newLot,
      id: `lot_${Date.now()}`
    };
    setHotLabData(prev => ({
      ...prev,
      lots: [...prev.lots, lotWithId]
    }));
  };
  
  const handleAddPreparationLog = (newPreparation: Omit<PreparationLog, 'id'>) => {
    const prepWithId: PreparationLog = {
      ...newPreparation,
      id: `prep_${Date.now()}`
    };
    setHotLabData(prev => ({
      ...prev,
      preparations: [...prev.preparations, prepWithId]
    }));
  };

  // --- View Rendering Logic ---
  const renderContent = () => {
    if (selectedPatient) {
      return <PatientDetailView patient={selectedPatient} onCloseDetailView={() => setSelectedPatient(null)} roomsConfig={ROOMS_CONFIG} />;
    }
    
    switch (activeView) {
      case 'room':
        if (currentRoom?.id === RoomId.GENERATOR) {
            return <HotLabView hotLabData={hotLabData} onAddTracerLot={handleAddTracerLot} onAddPreparationLog={handleAddPreparationLog} allPatients={patients}/>
        }
        return currentRoom ? 
          <RoomView 
            room={currentRoom} 
            patientsInRoom={patientsInRoom} 
            allPatients={patients}
            onOpenPatientFormModal={handleOpenPatientFormModal}
            onMovePatient={handleMovePatient}
            onOpenCreatePatientModal={currentRoom.id === RoomId.REQUEST ? handleOpenCreatePatientModal : undefined}
            selectedPeriod={selectedPeriod}
            onViewPatientDetail={setSelectedPatient}
          /> 
          : <div className="text-center p-8">Veuillez sélectionner une salle.</div>;
      case 'search':
        return <GlobalSearchView searchResults={searchResults} onViewPatientDetail={setSelectedPatient} searchTerm={searchTerm} />;
      case 'daily_worklist':
        return <DailyWorklistView allPatients={patients} onViewPatientDetail={setSelectedPatient} />;
      case 'rooms_overview':
        return <RoomsOverview visibleRooms={visibleRooms} allPatients={patients} onSelectRoom={(roomId) => { setActiveRoomId(roomId); setActiveView('room'); }} onViewPatientDetail={setSelectedPatient} onMovePatient={handleMovePatient} hotLabData={hotLabData}/>;
      case 'activity_feed':
        return <ActivityFeedView allPatients={patients} selectedPeriod={selectedPeriod} onViewPatientDetail={setSelectedPatient} roomsConfig={ROOMS_CONFIG}/>;
      case 'statistics':
        return <StatisticsView allPatients={patients} selectedPeriod={selectedPeriod} roomsConfig={ROOMS_CONFIG} calculateTimeDiff={calculateTimeDiff} formatDuration={formatDuration} />;
      case 'administration':
        return <AdministrationView />;
      default:
        return <div>Vue non trouvée</div>;
    }
  };
  
  const modalPatient = patients.find(p => p.id === modalContext?.patientId);
  const modalRoom = ROOMS_CONFIG.find(r => r.id === modalContext?.roomId);

  if (!currentUser) {
    return authView === 'login' 
      ? <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
      : <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-200">
      <Navbar 
        currentUser={currentUser}
        onLogout={handleLogout}
        selectedPeriod={selectedPeriod} 
        onPeriodChange={(p) => setSelectedPeriod(p as PeriodOption)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentView={activeView}
        onShowAdministrationView={() => { setActiveView('administration'); setSelectedPatient(null); }}
      />
      <div className="flex flex-grow overflow-hidden">
        <RoomNavigation 
          rooms={visibleRooms} 
          activeRoomId={activeRoomId} 
          currentView={activeView}
          onSelectRoom={(roomId) => { setActiveRoomId(roomId); setActiveView('room'); setSelectedPatient(null); }}
          onShowDailyWorklist={() => { setActiveView('daily_worklist'); setSelectedPatient(null); }}
          onShowRoomsOverview={() => { setActiveView('rooms_overview'); setSelectedPatient(null); }}
          onShowActivityFeed={() => { setActiveView('activity_feed'); setSelectedPatient(null); }}
          onShowStatisticsView={() => { setActiveView('statistics'); setSelectedPatient(null); }}
        />
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      {isPatientFormModalOpen && modalPatient && modalRoom && (
        <PatientFormModal
          isOpen={isPatientFormModalOpen}
          onClose={() => setIsPatientFormModalOpen(false)}
          onSubmit={handlePatientFormSubmit}
          patient={modalPatient}
          room={modalRoom}
        />
      )}
      {isCreatePatientModalOpen && (
         <CreatePatientModal
          isOpen={isCreatePatientModalOpen}
          onClose={() => setIsCreatePatientModalOpen(false)}
          onCreatePatient={handleCreatePatient}
          allPatients={patients}
        />
      )}
    </div>
  );
}

export default App;