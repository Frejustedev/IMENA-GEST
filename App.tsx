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
import { DatabaseView } from './components/DatabaseView';
import { ReportTemplatesSettingsView } from './components/ReportTemplatesSettingsView';
import { 
  Patient, Room, RoomId, PatientStatusInRoom, PatientHistoryEntry, 
  PeriodOption, ActiveView, HotLabData, User, TracerLot, PreparationLog,
  ReferringEntity, RequestIndications, PatientDocument, Role, ExamConfiguration,
  NewPatientData,
  ReportTemplate
} from './types';
import { ROOMS_CONFIG, INITIAL_PATIENTS, INITIAL_HOT_LAB_DATA, INITIAL_ROLES, INITIAL_EXAM_CONFIGURATIONS, INITIAL_REPORT_TEMPLATES } from './constants';
import { calculateAge } from './utils/dateUtils';

// --- Auth Service (simulated with localStorage) ---
const USERS_STORAGE_KEY = 'gestion_patient_mn_users';
const ROLES_STORAGE_KEY = 'gestion_patient_mn_roles';
const SESSION_STORAGE_KEY = 'gestion_patient_mn_session';
const EXAM_CONFIGS_STORAGE_KEY = 'gestion_patient_mn_exam_configs';
const REPORT_TEMPLATES_STORAGE_KEY = 'gestion_patient_mn_report_templates';


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

const getInitialReportTemplates = (): ReportTemplate[] => {
    try {
        const saved = localStorage.getItem(REPORT_TEMPLATES_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
        localStorage.setItem(REPORT_TEMPLATES_STORAGE_KEY, JSON.stringify(INITIAL_REPORT_TEMPLATES));
        return INITIAL_REPORT_TEMPLATES;
    } catch (error) {
        console.error("Erreur lors de l'initialisation des modèles de CR:", error);
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
  const [activeRoomId, setActiveRoomId] = useState<RoomId | null>(null);
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
  
  // --- Configuration State ---
  const [examConfigurations, setExamConfigurations] = useState<ExamConfiguration[]>(getInitialExamConfigs);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>(getInitialReportTemplates);


  // Persist data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem(EXAM_CONFIGS_STORAGE_KEY, JSON.stringify(examConfigurations));
  }, [examConfigurations]);

  useEffect(() => {
    localStorage.setItem(REPORT_TEMPLATES_STORAGE_KEY, JSON.stringify(reportTemplates));
  }, [reportTemplates]);


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
                  fields: configData.fields || { request: [], consultation: [], report: [] }
              };
              return [...prev, newConfig];
          }
      });
  };

  const handleDeleteExamConfiguration = (configId: string) => {
      // Check if any patient is using this exam
      const isUsed = patients.some(p => p.roomSpecificData?.[RoomId.REQUEST]?.requestedExam === examConfigurations.find(c => c.id === configId)?.name);
      if (isUsed) {
          alert("Cette configuration d'examen est utilisée par au moins un patient et ne peut pas être supprimée.");
          return;
      }
      setExamConfigurations(prev => prev.filter(c => c.id !== configId));
  };

  // --- Report Template Handlers ---
  const handleSaveReportTemplate = (templateData: ReportTemplate | Omit<ReportTemplate, 'id'>) => {
      setReportTemplates(prev => {
          if ('id' in templateData && templateData.id) {
              // Edit
              return prev.map(t => t.id === templateData.id ? { ...t, ...templateData } : t);
          } else {
              // Add
              const newTemplate: ReportTemplate = {
                  ...templateData,
                  id: `template_${Date.now()}`,
              } as ReportTemplate;
              return [...prev, newTemplate];
          }
      });
  };

  const handleDeleteReportTemplate = (templateId: string) => {
      setReportTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  // --- Patient & Room Handlers ---
  const handleCreatePatient = (
    patientData: NewPatientData,
    requestData: {
      requestedExam?: string;
      customFields?: { [key: string]: any };
    }
  ) => {
      const newPatientId = `PAT${String(Date.now()).slice(-6)}`;
      const now = new Date().toISOString();
      const hasRequest = !!requestData.requestedExam;
      
      const newHistoryEntry: PatientHistoryEntry = {
        roomId: RoomId.REQUEST,
        entryDate: now,
        statusMessage: hasRequest ? 'Patient et demande créés.' : 'Patient créé.',
        exitDate: hasRequest ? now : undefined
      };
      
      const nextRoomId = hasRequest ? RoomId.APPOINTMENT : RoomId.REQUEST;
      const nextStatus = hasRequest ? PatientStatusInRoom.WAITING : PatientStatusInRoom.WAITING;
      
      const history: PatientHistoryEntry[] = [newHistoryEntry];
      if (hasRequest) {
        history.push({
            roomId: RoomId.APPOINTMENT,
            entryDate: new Date(Date.parse(now) + 1).toISOString(), // ensure entry is after exit
            statusMessage: `Entré dans Rendez-vous`
        });
      }
      
      const newPatient: Patient = {
        id: newPatientId,
        name: patientData.name,
        dateOfBirth: patientData.dateOfBirth,
        address: patientData.address,
        phone: patientData.phone,
        email: patientData.email,
        referringEntity: patientData.referringEntity,
        age: calculateAge(patientData.dateOfBirth),
        creationDate: now,
        currentRoomId: nextRoomId,
        statusInRoom: nextStatus,
        history: history,
        roomSpecificData: hasRequest ? { [RoomId.REQUEST]: requestData } : {},
      };

      setPatients(prev => [...prev, newPatient]);
      setIsCreatePatientModalOpen(false);
      // Automatically switch to the next room to see the newly created patient
      handleSelectRoom(nextRoomId);
  };
  
  const handleSelectRoom = useCallback((roomId: RoomId) => {
    if (roomId === RoomId.GENERATOR) {
        setActiveView('hot_lab');
        setActiveRoomId(roomId);
    } else {
        setActiveView('room');
        setActiveRoomId(roomId);
    }
  }, []);
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term.trim() !== '') {
        setActiveView('search');
        setActiveRoomId(null); // Deselect room when searching globally
    } else if (activeView === 'search') {
        setActiveView('rooms_overview'); // Return to default view when search is cleared
    }
  };

  const handleOpenPatientFormModal = (patientId: string, roomId: RoomId) => {
    setModalContext({ patientId, roomId });
    setIsPatientFormModalOpen(true);
  };

  const handlePatientFormSubmit = (patientId: string, roomId: RoomId, formData: any) => {
    setPatients(prevPatients => {
        const newPatients = [...prevPatients];
        const patientIndex = newPatients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return prevPatients;

        const patient = { ...newPatients[patientIndex] };
        
        // Ensure roomSpecificData exists
        if (!patient.roomSpecificData) {
            patient.roomSpecificData = {};
        }

        // Deep copy room data to avoid direct state mutation
        const currentRoomData = patient.roomSpecificData[roomId] ? { ...patient.roomSpecificData[roomId] } : {};
        
        patient.roomSpecificData = {
          ...patient.roomSpecificData,
          [roomId]: {
              ...currentRoomData,
              ...formData,
          },
        };

        // --- Logic for status change and moving to next room ---
        const currentRoomConfig = ROOMS_CONFIG.find(r => r.id === roomId);
        if (currentRoomConfig) {
            const now = new Date().toISOString();
            
            // Mark last history entry in this room as exited
            const lastHistoryIndex = patient.history.map(h => h.roomId).lastIndexOf(roomId);
            if(lastHistoryIndex !== -1) {
                patient.history[lastHistoryIndex].exitDate = now;
            }

            // Create a status message for the completed action
            let statusMessage = 'Action complétée.';
             switch(roomId) {
                case RoomId.REQUEST: statusMessage = `Demande complétée pour ${formData.requestedExam}.`; break;
                case RoomId.APPOINTMENT: statusMessage = `RDV planifié pour le ${formData.dateRdv} à ${formData.heureRdv}.`; break;
                case RoomId.CONSULTATION: statusMessage = 'Consultation terminée.'; break;
                case RoomId.INJECTION: statusMessage = `Injection enregistrée.`; break;
                case RoomId.EXAMINATION: statusMessage = `Examen saisi (Qualité: ${formData.qualiteImages || 'N/A'}).`; break;
                case RoomId.REPORT: statusMessage = `Compte rendu rédigé.`; break;
                case RoomId.RETRAIT_CR_SORTIE: statusMessage = `CR retiré par ${formData.retirePar}. Dossier archivé.`; break;
            }
            patient.history.push({ roomId, entryDate: now, statusMessage });

            // Move to next room if applicable
            if (currentRoomConfig.nextRoomId) {
                patient.currentRoomId = currentRoomConfig.nextRoomId;
                patient.statusInRoom = PatientStatusInRoom.WAITING;
                patient.history.push({
                    roomId: currentRoomConfig.nextRoomId,
                    entryDate: new Date(Date.parse(now) + 1).toISOString(),
                    statusMessage: `Entré dans ${ROOMS_CONFIG.find(r => r.id === currentRoomConfig.nextRoomId)?.name}`
                });
            } else {
                 // Final step (e.g. Archive)
                 patient.statusInRoom = PatientStatusInRoom.SEEN;
            }
        }
        
        newPatients[patientIndex] = patient;
        return newPatients;
    });

    setIsPatientFormModalOpen(false);
    setModalContext(null);
  };
  
  const handleMovePatient = (patientId: string, targetRoomId: RoomId) => {
    setPatients(prevPatients => {
        return prevPatients.map(p => {
            if (p.id === patientId) {
                const now = new Date().toISOString();
                
                // Finalize history in current room
                const lastHistoryIndex = p.history.map(h => h.roomId).lastIndexOf(p.currentRoomId);
                if(lastHistoryIndex !== -1) {
                    p.history[lastHistoryIndex].exitDate = now;
                }
                 p.history.push({ 
                    roomId: p.currentRoomId, 
                    entryDate: now, 
                    statusMessage: 'Déplacé manuellement.'
                });
                
                // Add entry to new room
                p.history.push({ 
                    roomId: targetRoomId, 
                    entryDate: new Date(Date.parse(now) + 1).toISOString(), 
                    statusMessage: `Entré dans ${ROOMS_CONFIG.find(r => r.id === targetRoomId)?.name}`
                });

                return { ...p, currentRoomId: targetRoomId, statusInRoom: PatientStatusInRoom.WAITING };
            }
            return p;
        });
    });
  };

  const handleViewPatientDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveView('patient_detail');
    setActiveRoomId(null);
  };

  const handleCloseDetailView = () => {
    setSelectedPatient(null);
    setActiveView('rooms_overview'); // Return to overview by default
  };
  
  const handleAttachDocument = (patientId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
            const dataUrl = event.target.result;
            const newDocument: PatientDocument = {
                id: `doc_${Date.now()}`,
                name: file.name,
                fileType: file.type,
                uploadDate: new Date().toISOString(),
                dataUrl: dataUrl
            };
            setPatients(prev => prev.map(p => {
                if (p.id === patientId) {
                    const updatedDocuments = [...(p.documents || []), newDocument];
                    return { ...p, documents: updatedDocuments };
                }
                return p;
            }));
            // Also update the selected patient if it's being viewed
            if (selectedPatient?.id === patientId) {
                setSelectedPatient(prev => prev ? { ...prev, documents: [...(prev.documents || []), newDocument] } : null);
            }
        }
    };
    reader.readAsDataURL(file);
  };
  
  // --- Hot Lab Handlers ---
  const handleAddTracerLot = (newLot: Omit<TracerLot, 'id'>) => {
    const lotWithId: TracerLot = { ...newLot, id: `lot_${Date.now()}` };
    setHotLabData(prev => ({ ...prev, lots: [...prev.lots, lotWithId] }));
  };
  
  const handleAddPreparationLog = (newPreparation: Omit<PreparationLog, 'id'>) => {
    const prepWithId: PreparationLog = { ...newPreparation, id: `prep_${Date.now()}` };
    setHotLabData(prev => ({ ...prev, preparations: [...prev.preparations, prepWithId] }));
  };

  // --- View Management Callbacks ---
  const onShowDailyWorklist = () => { setActiveView('daily_worklist'); setActiveRoomId(null); };
  const onShowRoomsOverview = () => { setActiveView('rooms_overview'); setActiveRoomId(null); };
  const onShowActivityFeed = () => { setActiveView('activity_feed'); setActiveRoomId(null); };
  const onShowStatisticsView = () => { setActiveView('statistics'); setActiveRoomId(null); };
  const onShowAdministrationView = () => { setActiveView('administration'); setActiveRoomId(null); };
  const onShowExamSettingsView = () => { setActiveView('exam_settings'); setActiveRoomId(null); };
  const onShowDatabaseView = () => { setActiveView('database'); setActiveRoomId(null); };
  const onShowReportTemplatesSettingsView = () => { setActiveView('report_templates_settings'); setActiveRoomId(null); };


  // Derived state based on current user's role
  const currentUserRole = roles.find(r => r.id === currentUser?.roleId);
  const userPermissions = currentUserRole?.permissions || [];
  const visibleRooms = ROOMS_CONFIG.filter(room => 
      (currentUserRole?.name === 'Administrateur(trice)') || 
      room.allowedRoleIds.includes(currentUser?.roleId || '')
  );
  
  // --- Auth Gate ---
  if (!currentUser) {
    return authView === 'login' 
      ? <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
      : <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} roles={roles} />;
  }

  // Derived state for rendering
  const activeRoom = activeRoomId ? ROOMS_CONFIG.find(r => r.id === activeRoomId) : null;
  const patientsInActiveRoom = activeRoomId ? patients.filter(p => p.currentRoomId === activeRoomId) : [];
  const searchResults = searchTerm.trim() !== '' ? patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  const modalPatient = modalContext ? patients.find(p => p.id === modalContext.patientId) : null;
  const modalRoom = modalContext ? ROOMS_CONFIG.find(r => r.id === modalContext.roomId) : null;

  // --- Main Render Logic ---
  const renderCurrentView = () => {
    if (activeView === 'search') {
      return <GlobalSearchView searchResults={searchResults} onViewPatientDetail={handleViewPatientDetail} searchTerm={searchTerm} />;
    }
    if (activeView === 'patient_detail' && selectedPatient) {
      return <PatientDetailView patient={selectedPatient} onCloseDetailView={handleCloseDetailView} roomsConfig={ROOMS_CONFIG} onAttachDocument={handleAttachDocument} examConfigurations={examConfigurations} />;
    }
    if (activeView === 'daily_worklist') {
        return <DailyWorklistView allPatients={patients} onViewPatientDetail={handleViewPatientDetail} />;
    }
    if (activeView === 'rooms_overview') {
        return <RoomsOverview visibleRooms={visibleRooms} allPatients={patients} hotLabData={hotLabData} onSelectRoom={handleSelectRoom} onViewPatientDetail={handleViewPatientDetail} onMovePatient={handleMovePatient} />;
    }
     if (activeView === 'activity_feed') {
        return <ActivityFeedView allPatients={patients} selectedPeriod={selectedPeriod} onViewPatientDetail={handleViewPatientDetail} roomsConfig={ROOMS_CONFIG} />;
    }
    if (activeView === 'statistics') {
        return <StatisticsView allPatients={patients} selectedPeriod={selectedPeriod} roomsConfig={ROOMS_CONFIG} />;
    }
     if (activeView === 'hot_lab') {
        return <HotLabView hotLabData={hotLabData} onAddTracerLot={handleAddTracerLot} onAddPreparationLog={handleAddPreparationLog} allPatients={patients} />;
    }
    if (activeView === 'administration') {
        return <AdministrationView users={users} roles={roles} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} onSaveRole={handleSaveRole} onDeleteRole={handleDeleteRole} />;
    }
    if (activeView === 'exam_settings') {
        return <ExamSettingsView examConfigurations={examConfigurations} onSave={handleSaveExamConfiguration} onDelete={handleDeleteExamConfiguration} />;
    }
    if (activeView === 'report_templates_settings') {
        return <ReportTemplatesSettingsView 
            reportTemplates={reportTemplates} 
            onSave={handleSaveReportTemplate} 
            onDelete={handleDeleteReportTemplate}
        />;
    }
     if (activeView === 'database') {
        return <DatabaseView allPatients={patients} roomsConfig={ROOMS_CONFIG} onViewPatientDetail={handleViewPatientDetail} />;
    }
    if (activeView === 'room' && activeRoom) {
      return <RoomView 
                room={activeRoom} 
                patientsInRoom={patientsInActiveRoom} 
                allPatients={patients}
                onOpenPatientFormModal={handleOpenPatientFormModal}
                onMovePatient={handleMovePatient}
                onOpenCreatePatientModal={activeRoom.id === RoomId.REQUEST ? () => setIsCreatePatientModalOpen(true) : undefined}
                selectedPeriod={selectedPeriod}
                onViewPatientDetail={handleViewPatientDetail}
             />;
    }
    // Default view
    return <RoomsOverview visibleRooms={visibleRooms} allPatients={patients} hotLabData={hotLabData} onSelectRoom={handleSelectRoom} onViewPatientDetail={handleViewPatientDetail} onMovePatient={handleMovePatient} />;
  };

  return (
    <div className="h-screen flex flex-col bg-slate-200">
      <Navbar 
        currentUser={currentUser} 
        currentUserRoleName={currentUserRole?.name || 'N/A'}
        onLogout={handleLogout} 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <div className="flex-grow flex overflow-hidden">
        <RoomNavigation
          rooms={visibleRooms}
          activeRoomId={activeRoomId}
          currentView={activeView}
          onSelectRoom={handleSelectRoom}
          onShowDailyWorklist={onShowDailyWorklist}
          onShowRoomsOverview={onShowRoomsOverview}
          onShowActivityFeed={onShowActivityFeed}
          onShowStatisticsView={onShowStatisticsView}
          onShowDatabaseView={onShowDatabaseView}
          isUserAdmin={currentUserRole?.name === 'Administrateur(trice)'}
          onShowAdministrationView={onShowAdministrationView}
          onShowExamSettingsView={onShowExamSettingsView}
          onShowReportTemplatesSettingsView={onShowReportTemplatesSettingsView}
        />
        <main className="flex-grow p-6 overflow-y-auto">
          {renderCurrentView()}
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
          reportTemplates={reportTemplates}
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