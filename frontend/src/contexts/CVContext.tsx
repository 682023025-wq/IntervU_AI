import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CVData, DEFAULT_CV_DATA } from '../types/cv';

interface CVState {
  cvData: CVData;
  isEditing: boolean;
  selectedSection: string | null;
  currentStep: number;
}

type CVAction =
  | { type: 'UPDATE_PROFILE_SUMMARY'; payload: string }
  | { type: 'UPDATE_PHOTO'; payload: { url: string; publicId: string } }
  | { type: 'UPDATE_CONTACT_INFO'; payload: CVData['contactInfo'] }
  | { type: 'ADD_CONTACT'; payload: CVData['contactInfo'][number] }
  | { type: 'REMOVE_CONTACT'; payload: string }
  | { type: 'REORDER_CONTACTS'; payload: CVData['contactInfo'] }
  | { type: 'UPDATE_SKILLS'; payload: CVData['skills'] }
  | { type: 'ADD_SKILL'; payload: CVData['skills'][number] }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'UPDATE_SKILL_LEVEL'; payload: { id: string; level: number | null } }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: CVData['workExperience'] }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: CVData['workExperience'][number] }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: string }
  | { type: 'UPDATE_INTERNSHIP_EXPERIENCE'; payload: CVData['internshipExperience'] }
  | { type: 'ADD_INTERNSHIP_EXPERIENCE'; payload: CVData['internshipExperience'][number] }
  | { type: 'REMOVE_INTERNSHIP_EXPERIENCE'; payload: string }
  | { type: 'UPDATE_ORGANIZATION_EXPERIENCE'; payload: CVData['organizationExperience'] }
  | { type: 'ADD_ORGANIZATION_EXPERIENCE'; payload: CVData['organizationExperience'][number] }
  | { type: 'REMOVE_ORGANIZATION_EXPERIENCE'; payload: string }
  | { type: 'UPDATE_COMMITTEE_EXPERIENCE'; payload: CVData['committeeExperience'] }
  | { type: 'ADD_COMMITTEE_EXPERIENCE'; payload: CVData['committeeExperience'][number] }
  | { type: 'REMOVE_COMMITTEE_EXPERIENCE'; payload: string }
  | { type: 'UPDATE_EDUCATION'; payload: CVData['education'] }
  | { type: 'ADD_EDUCATION'; payload: CVData['education'][number] }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'UPDATE_CERTIFICATIONS'; payload: CVData['certifications'] }
  | { type: 'ADD_CERTIFICATION'; payload: CVData['certifications'][number] }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  | { type: 'UPDATE_PROJECTS'; payload: CVData['projects'] }
  | { type: 'ADD_PROJECT'; payload: CVData['projects'][number] }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'UPDATE_ACHIEVEMENTS'; payload: CVData['achievements'] }
  | { type: 'ADD_ACHIEVEMENT'; payload: CVData['achievements'][number] }
  | { type: 'REMOVE_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_LANGUAGES'; payload: CVData['languages'] }
  | { type: 'ADD_LANGUAGE'; payload: CVData['languages'][number] }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'UPDATE_ADDITIONAL_INFO'; payload: CVData['additionalInfo'] }
  | { type: 'UPDATE_TEMPLATE'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'SET_SELECTED_SECTION'; payload: string | null }
  | { type: 'RESET_CV' }
  | { type: 'IMPORT_CV_DATA'; payload: CVData };

const initialState: CVState = {
  cvData: DEFAULT_CV_DATA,
  isEditing: false,
  selectedSection: null,
  currentStep: 1,
};

function cvReducer(state: CVState, action: CVAction): CVState {
  switch (action.type) {
    case 'UPDATE_PROFILE_SUMMARY':
      return {
        ...state,
        cvData: { ...state.cvData, profileSummary: action.payload },
      };
    case 'UPDATE_PHOTO':
      return {
        ...state,
        cvData: { ...state.cvData, photo: action.payload },
      };
    case 'UPDATE_CONTACT_INFO':
      return {
        ...state,
        cvData: { ...state.cvData, contactInfo: action.payload },
      };
    case 'ADD_CONTACT':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          contactInfo: [...state.cvData.contactInfo, action.payload],
        },
      };
    case 'REMOVE_CONTACT':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          contactInfo: state.cvData.contactInfo.filter((c) => c.value !== action.payload),
        },
      };
    case 'REORDER_CONTACTS':
      return {
        ...state,
        cvData: { ...state.cvData, contactInfo: action.payload },
      };
    case 'UPDATE_SKILLS':
      return {
        ...state,
        cvData: { ...state.cvData, skills: action.payload },
      };
    case 'ADD_SKILL':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          skills: [...state.cvData.skills, action.payload],
        },
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          skills: state.cvData.skills.filter((s) => s.id !== action.payload),
        },
      };
    case 'UPDATE_SKILL_LEVEL':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          skills: state.cvData.skills.map((s) =>
            s.id === action.payload.id ? { ...s, level: action.payload.level } : s
          ),
        },
      };
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        cvData: { ...state.cvData, workExperience: action.payload },
      };
    case 'ADD_WORK_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          workExperience: [...state.cvData.workExperience, action.payload],
        },
      };
    case 'REMOVE_WORK_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          workExperience: state.cvData.workExperience.filter((e) => e.id !== action.payload),
        },
      };
    case 'UPDATE_INTERNSHIP_EXPERIENCE':
      return {
        ...state,
        cvData: { ...state.cvData, internshipExperience: action.payload },
      };
    case 'ADD_INTERNSHIP_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          internshipExperience: [...state.cvData.internshipExperience, action.payload],
        },
      };
    case 'REMOVE_INTERNSHIP_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          internshipExperience: state.cvData.internshipExperience.filter(
            (e) => e.id !== action.payload
          ),
        },
      };
    case 'UPDATE_ORGANIZATION_EXPERIENCE':
      return {
        ...state,
        cvData: { ...state.cvData, organizationExperience: action.payload },
      };
    case 'ADD_ORGANIZATION_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          organizationExperience: [...state.cvData.organizationExperience, action.payload],
        },
      };
    case 'REMOVE_ORGANIZATION_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          organizationExperience: state.cvData.organizationExperience.filter(
            (e) => e.id !== action.payload
          ),
        },
      };
    case 'UPDATE_COMMITTEE_EXPERIENCE':
      return {
        ...state,
        cvData: { ...state.cvData, committeeExperience: action.payload },
      };
    case 'ADD_COMMITTEE_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          committeeExperience: [...state.cvData.committeeExperience, action.payload],
        },
      };
    case 'REMOVE_COMMITTEE_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          committeeExperience: state.cvData.committeeExperience.filter(
            (e) => e.id !== action.payload
          ),
        },
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        cvData: { ...state.cvData, education: action.payload },
      };
    case 'ADD_EDUCATION':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          education: [...state.cvData.education, action.payload],
        },
      };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          education: state.cvData.education.filter((e) => e.id !== action.payload),
        },
      };
    case 'UPDATE_CERTIFICATIONS':
      return {
        ...state,
        cvData: { ...state.cvData, certifications: action.payload },
      };
    case 'ADD_CERTIFICATION':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          certifications: [...state.cvData.certifications, action.payload],
        },
      };
    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          certifications: state.cvData.certifications.filter((c) => c.id !== action.payload),
        },
      };
    case 'UPDATE_PROJECTS':
      return {
        ...state,
        cvData: { ...state.cvData, projects: action.payload },
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          projects: [...state.cvData.projects, action.payload],
        },
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          projects: state.cvData.projects.filter((p) => p.id !== action.payload),
        },
      };
    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        cvData: { ...state.cvData, achievements: action.payload },
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          achievements: [...state.cvData.achievements, action.payload],
        },
      };
    case 'REMOVE_ACHIEVEMENT':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          achievements: state.cvData.achievements.filter((a) => a.id !== action.payload),
        },
      };
    case 'UPDATE_LANGUAGES':
      return {
        ...state,
        cvData: { ...state.cvData, languages: action.payload },
      };
    case 'ADD_LANGUAGE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          languages: [...state.cvData.languages, action.payload],
        },
      };
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          languages: state.cvData.languages.filter((l) => l.language !== action.payload),
        },
      };
    case 'UPDATE_ADDITIONAL_INFO':
      return {
        ...state,
        cvData: { ...state.cvData, additionalInfo: action.payload },
      };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        cvData: { ...state.cvData, template: action.payload, lastUpdated: new Date().toISOString() },
      };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_SELECTED_SECTION':
      return { ...state, selectedSection: action.payload };
    case 'RESET_CV':
      return { ...initialState, cvData: { ...DEFAULT_CV_DATA, lastUpdated: new Date().toISOString() } };
    case 'IMPORT_CV_DATA':
      return { ...state, cvData: action.payload };
    default:
      return state;
  }
}

interface CVContextType {
  state: CVState;
  dispatch: React.Dispatch<CVAction>;
  // Helper functions
  updateProfileSummary: (summary: string) => void;
  updatePhoto: (photo: { url: string; publicId: string }) => void;
  updateContactInfo: (contacts: CVData['contactInfo']) => void;
  addContact: (contact: CVData['contactInfo'][number]) => void;
  removeContact: (value: string) => void;
  reorderContacts: (contacts: CVData['contactInfo']) => void;
  updateSkills: (skills: CVData['skills']) => void;
  addSkill: (skill: CVData['skills'][number]) => void;
  removeSkill: (id: string) => void;
  updateSkillLevel: (id: string, level: number | null) => void;
  updateWorkExperience: (experience: CVData['workExperience']) => void;
  addWorkExperience: (exp: CVData['workExperience'][number]) => void;
  removeWorkExperience: (id: string) => void;
  updateInternshipExperience: (experience: CVData['internshipExperience']) => void;
  addInternshipExperience: (exp: CVData['internshipExperience'][number]) => void;
  removeInternshipExperience: (id: string) => void;
  updateOrganizationExperience: (experience: CVData['organizationExperience']) => void;
  addOrganizationExperience: (exp: CVData['organizationExperience'][number]) => void;
  removeOrganizationExperience: (id: string) => void;
  updateCommitteeExperience: (experience: CVData['committeeExperience']) => void;
  addCommitteeExperience: (exp: CVData['committeeExperience'][number]) => void;
  removeCommitteeExperience: (id: string) => void;
  updateEducation: (education: CVData['education']) => void;
  addEducation: (edu: CVData['education'][number]) => void;
  removeEducation: (id: string) => void;
  updateCertifications: (certs: CVData['certifications']) => void;
  addCertification: (cert: CVData['certifications'][number]) => void;
  removeCertification: (id: string) => void;
  updateProjects: (projects: CVData['projects']) => void;
  addProject: (project: CVData['projects'][number]) => void;
  removeProject: (id: string) => void;
  updateAchievements: (achievements: CVData['achievements']) => void;
  addAchievement: (achievement: CVData['achievements'][number]) => void;
  removeAchievement: (id: string) => void;
  updateLanguages: (languages: CVData['languages']) => void;
  addLanguage: (lang: CVData['languages'][number]) => void;
  removeLanguage: (language: string) => void;
  updateAdditionalInfo: (info: CVData['additionalInfo']) => void;
  updateTemplate: (template: string) => void;
  setCurrentStep: (step: number) => void;
  setEditing: (editing: boolean) => void;
  setSelectedSection: (section: string | null) => void;
  resetCV: () => void;
  importCVData: (data: CVData) => void;
  exportCVData: () => CVData;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export { CVContext };

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  const updateProfileSummary = (summary: string) => {
    dispatch({ type: 'UPDATE_PROFILE_SUMMARY', payload: summary });
  };

  const updatePhoto = (photo: { url: string; publicId: string }) => {
    dispatch({ type: 'UPDATE_PHOTO', payload: photo });
  };

  const updateContactInfo = (contacts: CVData['contactInfo']) => {
    dispatch({ type: 'UPDATE_CONTACT_INFO', payload: contacts });
  };

  const addContact = (contact: CVData['contactInfo'][number]) => {
    dispatch({ type: 'ADD_CONTACT', payload: contact });
  };

  const removeContact = (value: string) => {
    dispatch({ type: 'REMOVE_CONTACT', payload: value });
  };

  const reorderContacts = (contacts: CVData['contactInfo']) => {
    dispatch({ type: 'REORDER_CONTACTS', payload: contacts });
  };

  const updateSkills = (skills: CVData['skills']) => {
    dispatch({ type: 'UPDATE_SKILLS', payload: skills });
  };

  const addSkill = (skill: CVData['skills'][number]) => {
    dispatch({ type: 'ADD_SKILL', payload: skill });
  };

  const removeSkill = (id: string) => {
    dispatch({ type: 'REMOVE_SKILL', payload: id });
  };

  const updateSkillLevel = (id: string, level: number | null) => {
    dispatch({ type: 'UPDATE_SKILL_LEVEL', payload: { id, level } });
  };

  const updateWorkExperience = (experience: CVData['workExperience']) => {
    dispatch({ type: 'UPDATE_WORK_EXPERIENCE', payload: experience });
  };

  const addWorkExperience = (exp: CVData['workExperience'][number]) => {
    dispatch({ type: 'ADD_WORK_EXPERIENCE', payload: exp });
  };

  const removeWorkExperience = (id: string) => {
    dispatch({ type: 'REMOVE_WORK_EXPERIENCE', payload: id });
  };

  const updateInternshipExperience = (experience: CVData['internshipExperience']) => {
    dispatch({ type: 'UPDATE_INTERNSHIP_EXPERIENCE', payload: experience });
  };

  const addInternshipExperience = (exp: CVData['internshipExperience'][number]) => {
    dispatch({ type: 'ADD_INTERNSHIP_EXPERIENCE', payload: exp });
  };

  const removeInternshipExperience = (id: string) => {
    dispatch({ type: 'REMOVE_INTERNSHIP_EXPERIENCE', payload: id });
  };

  const updateOrganizationExperience = (experience: CVData['organizationExperience']) => {
    dispatch({ type: 'UPDATE_ORGANIZATION_EXPERIENCE', payload: experience });
  };

  const addOrganizationExperience = (exp: CVData['organizationExperience'][number]) => {
    dispatch({ type: 'ADD_ORGANIZATION_EXPERIENCE', payload: exp });
  };

  const removeOrganizationExperience = (id: string) => {
    dispatch({ type: 'REMOVE_ORGANIZATION_EXPERIENCE', payload: id });
  };

  const updateCommitteeExperience = (experience: CVData['committeeExperience']) => {
    dispatch({ type: 'UPDATE_COMMITTEE_EXPERIENCE', payload: experience });
  };

  const addCommitteeExperience = (exp: CVData['committeeExperience'][number]) => {
    dispatch({ type: 'ADD_COMMITTEE_EXPERIENCE', payload: exp });
  };

  const removeCommitteeExperience = (id: string) => {
    dispatch({ type: 'REMOVE_COMMITTEE_EXPERIENCE', payload: id });
  };

  const updateEducation = (education: CVData['education']) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: education });
  };

  const addEducation = (edu: CVData['education'][number]) => {
    dispatch({ type: 'ADD_EDUCATION', payload: edu });
  };

  const removeEducation = (id: string) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id });
  };

  const updateCertifications = (certs: CVData['certifications']) => {
    dispatch({ type: 'UPDATE_CERTIFICATIONS', payload: certs });
  };

  const addCertification = (cert: CVData['certifications'][number]) => {
    dispatch({ type: 'ADD_CERTIFICATION', payload: cert });
  };

  const removeCertification = (id: string) => {
    dispatch({ type: 'REMOVE_CERTIFICATION', payload: id });
  };

  const updateProjects = (projects: CVData['projects']) => {
    dispatch({ type: 'UPDATE_PROJECTS', payload: projects });
  };

  const addProject = (project: CVData['projects'][number]) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const removeProject = (id: string) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: id });
  };

  const updateAchievements = (achievements: CVData['achievements']) => {
    dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: achievements });
  };

  const addAchievement = (achievement: CVData['achievements'][number]) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const removeAchievement = (id: string) => {
    dispatch({ type: 'REMOVE_ACHIEVEMENT', payload: id });
  };

  const updateLanguages = (languages: CVData['languages']) => {
    dispatch({ type: 'UPDATE_LANGUAGES', payload: languages });
  };

  const addLanguage = (lang: CVData['languages'][number]) => {
    dispatch({ type: 'ADD_LANGUAGE', payload: lang });
  };

  const removeLanguage = (language: string) => {
    dispatch({ type: 'REMOVE_LANGUAGE', payload: language });
  };

  const updateAdditionalInfo = (info: CVData['additionalInfo']) => {
    dispatch({ type: 'UPDATE_ADDITIONAL_INFO', payload: info });
  };

  const updateTemplate = (template: string) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: template });
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const setEditing = (editing: boolean) => {
    dispatch({ type: 'SET_EDITING', payload: editing });
  };

  const setSelectedSection = (section: string | null) => {
    dispatch({ type: 'SET_SELECTED_SECTION', payload: section });
  };

  const resetCV = () => {
    dispatch({ type: 'RESET_CV' });
  };

  const importCVData = (data: CVData) => {
    dispatch({ type: 'IMPORT_CV_DATA', payload: data });
  };

  const exportCVData = (): CVData => {
    return state.cvData;
  };

  const value: CVContextType = {
    state,
    dispatch,
    updateProfileSummary,
    updatePhoto,
    updateContactInfo,
    addContact,
    removeContact,
    reorderContacts,
    updateSkills,
    addSkill,
    removeSkill,
    updateWorkExperience,
    addWorkExperience,
    removeWorkExperience,
    updateInternshipExperience,
    addInternshipExperience,
    removeInternshipExperience,
    updateOrganizationExperience,
    addOrganizationExperience,
    removeOrganizationExperience,
    updateCommitteeExperience,
    addCommitteeExperience,
    removeCommitteeExperience,
    updateEducation,
    addEducation,
    removeEducation,
    updateCertifications,
    addCertification,
    removeCertification,
    updateProjects,
    addProject,
    removeProject,
    updateAchievements,
    addAchievement,
    removeAchievement,
    updateLanguages,
    addLanguage,
    removeLanguage,
    updateAdditionalInfo,
    updateTemplate,
    setCurrentStep,
    setEditing,
    setSelectedSection,
    resetCV,
    importCVData,
    exportCVData,
    updateSkillLevel,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
