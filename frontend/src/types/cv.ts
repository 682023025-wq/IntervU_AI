// Tipe data CV sesuai dengan skema MD IntervU AI

export interface ContactInfo {
  platform: string; // 'email' | 'phone' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'portfolio' | 'other'
  value: string;
  url?: string;
  icon: string;
  show: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language';
  subcategory?: string;
  level: 1 | 2 | 3 | 4; // Beginner, Intermediate, Advanced, Expert
  yearsOfExperience?: number;
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string; // MM/YYYY
  endDate?: string; // MM/YYYY
  currentlyWorking: boolean;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  description: string;
  achievements: string[];
  technologies: string[];
  salary?: number;
  reasonForLeaving?: string;
}

export interface InternshipExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: string;
  department?: string;
  description: string;
  responsibilities: string[];
  skillsLearned: string[];
  certificateUrl?: string;
}

export interface OrganizationExperience {
  id: string;
  organizationName: string;
  position: string;
  level: 'university' | 'national' | 'international';
  location: string;
  startDate: string;
  endDate?: string;
  currentlyActive: boolean;
  description?: string;
  responsibilities: string[];
  achievements?: string[];
  memberCount?: number;
}

export interface CommitteeExperience {
  id: string;
  eventName: string;
  position: string;
  organizer: string;
  scale: 'campus' | 'regional' | 'national' | 'international';
  eventDate: string;
  committeePeriod?: {
    startDate: string;
    endDate: string;
  };
  description?: string;
  responsibilities: string[];
  results?: string;
  participantCount?: number;
}

export interface Education {
  id: string;
  level: 'sd' | 'smp' | 'sma' | 'd3' | 's1' | 's2' | 's3';
  institution: string;
  major: string;
  location: string;
  startYear: string;
  graduationYear: string;
  gpa?: number;
  predicate?: string;
  relevantCourses?: string[];
  academicAchievements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  validatedSkills?: string[];
}

export interface Project {
  id: string;
  name: string;
  type: 'personal' | 'academic' | 'freelance' | 'opensource';
  startDate: string;
  endDate?: string;
  role: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  liveDemoUrl?: string;
  impact?: string;
}

export interface Achievement {
  id: string;
  name: string;
  level: 'campus' | 'regional' | 'national' | 'international';
  organizer: string;
  rank: string;
  date: string;
  description?: string;
  proofUrl?: string;
}

export interface Language {
  language: string;
  level: 'native' | 'fluent' | 'professional' | 'limited' | 'elementary';
  certification?: string;
}

export interface AdditionalInfo {
  hobbies: string[];
  references?: Array<{
    name: string;
    position: string;
    company: string;
    contact: string;
  }>;
  availability: string;
  salaryExpectation?: {
    min: number;
    max: number;
  };
  locationPreference?: string;
  willingToRelocate: boolean;
}

export interface CVData {
  // Halaman 1: Informasi Utama & Profil
  photo?: {
    url: string;
    publicId: string;
  };
  profileSummary: string;
  contactInfo: ContactInfo[];
  skills: Skill[];

  // Halaman 2: Pengalaman Profesional & Organisasi
  workExperience: WorkExperience[];
  internshipExperience: InternshipExperience[];
  organizationExperience: OrganizationExperience[];
  committeeExperience: CommitteeExperience[];

  // Halaman 3: Pendidikan & Prestasi
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  achievements: Achievement[];
  languages: Language[];

  // Informasi Tambahan
  additionalInfo?: AdditionalInfo;

  // Metadata
  template: string;
  lastUpdated: string;
  cvScore?: number;
}

export const DEFAULT_CV_DATA: CVData = {
  photo: undefined,
  profileSummary: '',
  contactInfo: [],
  skills: [],
  workExperience: [],
  internshipExperience: [],
  organizationExperience: [],
  committeeExperience: [],
  education: [],
  certifications: [],
  projects: [],
  achievements: [],
  languages: [],
  additionalInfo: undefined,
  template: 'modern',
  lastUpdated: new Date().toISOString(),
};

export type CVTemplate = 'modern' | 'professional' | 'creative' | 'minimalist' | 'elegant';

export interface TemplateConfig {
  id: CVTemplate;
  name: string;
  description: string;
  category: 'tech' | 'business' | 'creative' | 'academic';
  layout: 'single-column' | 'two-column' | 'sidebar';
  features: string[];
}

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Template modern dengan desain minimalis untuk profesional muda',
    category: 'tech',
    layout: 'two-column',
    features: ['Sidebar', 'Icon contacts', 'Skill bars'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Template formal dan bersih untuk posisi korporat',
    category: 'business',
    layout: 'single-column',
    features: ['Single column', 'Classic typography', 'Conservative design'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Template kreatif dengan warna dan elemen visual menarik',
    category: 'creative',
    layout: 'two-column',
    features: ['Color accents', 'Creative layout', 'Visual elements'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Desain sederhana dan elegan dengan fokus pada konten',
    category: 'tech',
    layout: 'single-column',
    features: ['Clean design', 'Minimal colors', 'Content-focused'],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Template sophisticated dengan timeline karir yang jelas',
    category: 'business',
    layout: 'sidebar',
    features: ['Timeline design', 'Elegant styling', 'Career-focused'],
  },
];
