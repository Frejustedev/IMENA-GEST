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
import { ExamSettingsView } from './components/ExamSettingsView';
import { 
  Patient, Room, RoomId, PatientStatusInRoom, PatientHistoryEntry, 
  PeriodOption, ActiveView, HotLabData, User, TracerLot, PreparationLog,
  ReferringEntity, RequestIndications, PatientDocument, Role, ExamConfiguration,
  NewPatientData
} from './types';
import { ROOMS_CONFIG, INITIAL_PATIENTS, INITIAL_HOT_LAB_DATA, INITIAL_ROLES, INITIAL_EXAM_CONFIGURATIONS } from './constants';
import { calculateAge } from './utils/dateUtils';

// --- Auth Service (simulated with localStorage) ---
const USERS_STORAGE_KEY = 'gestion_patient_mn_users';
const ROLES_STORAGE_KEY = 'gestion_patient_mn_roles';
const SESSION_STORAGE_KEY = 'gestion_patient_mn_session';
const EXAM_CONFIGS_STORAGE_KEY = 'gestion_patient_mn_exam_configs';


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
      roleId: 'role_admin',
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([initialAdmin]));
    return [initialAdmin];
  } catch (error) {
    console.error("Erreur lors de l'initialisation des utilisateurs:", error);
    return [];
  }
};

const getInitialRoles = (): Role[] => {
    try {
        const savedRoles = localStorage.getItem(ROLES_STORAGE_KEY);
        if (savedRoles) return JSON.parse(savedRoles);
        localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(INITIAL_ROLES));
        return INITIAL_ROLES;
    } catch (error) {
        console.error("Erreur lors de l'initialisation des rôles:", error);
        return [];
    }
};

const getInitialExamConfigs = (): ExamConfiguration[] => {
    try {
        const saved = localStorage.getItem(EXAM_CONFIGS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
        localStorage.setItem(EXAM_CONFIGS_STORAGE_KEY, JSON.stringify(INITIAL_EXAM_CONFIGURATIONS));
        return INITIAL_EXAM_CONFIGURATIONS;
    } catch (error) {
        console.error("Erreur lors de l'initialisation des configurations d'examen:", error);
        return [];
    }
};


const sessionService = {
  login: (user: User) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
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

  // --- Auth & Roles State ---
  const [users, setUsers] = useState<User[]>(getInitialUsers);
  const [roles, setRoles] = useState<Role[]>(getInitialRoles);
  const [currentUser, setCurrentUser] = useState<User | null>(() => sessionService.getCurrentUser());
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  // --- Exam Configuration State ---
  const [examConfigurations, setExamConfigurations] = useState<ExamConfiguration[]>(getInitialExamConfigs);


  // Persist users and roles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem(EXAM_CONFIGS_STORAGE_KEY, JSON.stringify(examConfigurations));
  }, [examConfigurations]);


  // --- Authentication Handlers ---
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
    if (user) {
      sessionService.login(user);
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  
  const handleRegister = async (name: string, email: string, password: string, roleId: string): Promise<{ success: boolean; message?: string }> => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Un utilisateur avec cet email existe déjà." };
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: password,
      roleId
    };
    setUsers(prev => [...prev, newUser]);
    sessionService.login(newUser);
    setCurrentUser(newUser);
    return { success: true };
  };
  
  const handleLogout = () => {
    sessionService.logout();
    setCurrentUser(null);
  };

  // --- User Management Handlers ---
  const handleSaveUser = (userData: User | Omit<User, 'id'>) => {
    setUsers(prevUsers => {
      if ('id' in userData && userData.id) {
        // Edit existing user
        return prevUsers.map(u => u.id === userData.id ? { ...u, ...userData, passwordHash: userData.passwordHash || u.passwordHash } : u);
      } else {
        // Add new user
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          passwordHash: userData.passwordHash || 'password', // Fallback, should be required by form
          roleId: userData.roleId!
        };
        return [...prevUsers, newUser];
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      alert("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  };
  
  // --- Role Management Handlers ---
  const handleSaveRole = (roleData: Role | Omit<Role, 'id'>) => {
    setRoles(prevRoles => {
        if ('id' in roleData && roleData.id) {
            // Edit existing role
            return prevRoles.map(r => r.id === roleData.id ? { ...r, ...roleData } : r);
        } else {
            // Add new role
            const newRole: Role = {
                ...roleData,
                id: `role_${Date.now()}`,
                permissions: roleData.permissions || [],
            };
            return [...prevRoles, newRole];
        }
    });
  };

  const handleDeleteRole = (roleId: string) => {
      if (users.some(user => user.roleId === roleId)) {
          alert("Ce rôle est assigné à des utilisateurs et ne peut pas être supprimé.");
          return;
      }
      setRoles(prevRoles => prevRoles.filter(r => r.id !== roleId));
  };
  
    // --- Exam Configuration Handlers ---
    const handleSaveExamConfiguration = (configData: ExamConfiguration | Omit<ExamConfiguration, 'id'>) => {
        setExamConfigurations(prev => {
            if ('id' in configData && configData.id) {
                // Edit existing
                return prev.map(c => c.id === configData.id ? { ...c, ...configData } : c);
            } else {
                // Add new
                const newConfig: ExamConfiguration = {
                    ...configData,
                    id: `exam_${Date.now()}`,
                    fields: configData.fields || []
                };
                return [...prev, newConfig];
            }
        });
    };

    const handleDeleteExamConfiguration = (configId: string) => {
        setExamConfigurations(prev => prev.filter(c => c.id !== configId));
    };


  // --- Document Management Handler ---
  const handleAttachDocument = (patientId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (readEvent) => {
        const dataUrl = readEvent.target?.result as string;
        if (dataUrl) {
            const newDocument: PatientDocument = {
                id: `doc_${Date.now()}`,
                name: file.name,
                fileType: file.type,
                uploadDate: new Date().toISOString(),
                dataUrl,
            };
            setPatients(prevPatients => prevPatients.map(p => {
                if (p.id === patientId) {
                    const updatedDocuments = [...(p.documents || []), newDocument];
                    return { ...p, documents: updatedDocuments };
                }
                return p;
            }));
        }
    };
    reader.onerror = (error) => {
        console.error("Erreur de lecture du fichier:", error);
        alert("Une erreur est survenue lors de la lecture du fichier.");
    };
    reader.readAsDataURL(file);
  };


  // --- Derived State and Data Filtering ---
  const currentUserRole = roles.find(r => r.id === currentUser?.roleId);
  const currentUserRoleName = currentUserRole?.name || 'N/A';
  
  const visibleRooms = ROOMS_CONFIG.filter(room => 
      currentUserRole && room.allowedRoleIds.includes(currentUserRole.id)
  );
  
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
    patientData: NewPatientData,
    requestData: {
      requestedExam?: string;
      customFields?: { [key: string]: any };
    }
  ) => {
    const now = new Date().toISOString();
    const newPatient: Patient = {
      id: `PAT${String(Date.now()).slice(-4)}${String(patients.length + 1)}`,
      // FIX: Spread operator was causing a type error. Using a strongly-typed object resolves it.
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
      return <PatientDetailView patient={selectedPatient} onCloseDetailView={() => setSelectedPatient(null)} roomsConfig={ROOMS_CONFIG} onAttachDocument={handleAttachDocument} examConfigurations={examConfigurations} />;
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
        return <StatisticsView allPatients={patients} selectedPeriod={selectedPeriod} roomsConfig={ROOMS_CONFIG} />;
      case 'administration':
        return <AdministrationView users={users} roles={roles} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} onSaveRole={handleSaveRole} onDeleteRole={handleDeleteRole} />;
      case 'exam_settings':
        return <ExamSettingsView examConfigurations={examConfigurations} onSave={handleSaveExamConfiguration} onDelete={handleDeleteExamConfiguration} />;
      default:
        return <div>Vue non trouvée</div>;
    }
  };
  
  const modalPatient = patients.find(p => p.id === modalContext?.patientId);
  const modalRoom = ROOMS_CONFIG.find(r => r.id === modalContext?.roomId);

  if (!currentUser) {
    return authView === 'login' 
      ? <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
      : <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} roles={roles}/>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-200">
      <Navbar 
        currentUser={currentUser}
        currentUserRoleName={currentUserRoleName}
        onLogout={handleLogout}
        selectedPeriod={selectedPeriod} 
        onPeriodChange={(p) => setSelectedPeriod(p as PeriodOption)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <div className="flex flex-grow overflow-hidden">
        <RoomNavigation 
          rooms={visibleRooms} 
          activeRoomId={activeRoomId} 
          currentView={activeView}
          isUserAdmin={currentUserRole?.name === 'Administrateur(trice)'}
          onSelectRoom={(roomId) => { setActiveRoomId(roomId); setActiveView('room'); setSelectedPatient(null); }}
          onShowDailyWorklist={() => { setActiveView('daily_worklist'); setSelectedPatient(null); }}
          onShowRoomsOverview={() => { setActiveView('rooms_overview'); setSelectedPatient(null); }}
          onShowActivityFeed={() => { setActiveView('activity_feed'); setSelectedPatient(null); }}
          onShowStatisticsView={() => { setActiveView('statistics'); setSelectedPatient(null); }}
          onShowAdministrationView={() => { setActiveView('administration'); setSelectedPatient(null); }}
          onShowExamSettingsView={() => { setActiveView('exam_settings'); setSelectedPatient(null); }}
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
          examConfigurations={examConfigurations}
        />
      )}
      {isCreatePatientModalOpen && (
         <CreatePatientModal
          isOpen={isCreatePatientModalOpen}
          onClose={() => setIsCreatePatientModalOpen(false)}
          onCreatePatient={handleCreatePatient}
          allPatients={patients}
          examConfigurations={examConfigurations}
        />
      )}
    </div>
  );
}

export default App;