export type UserStage =
  | 'university-student'
  | 'recent-graduate'
  | 'bootcamp-graduate'
  | 'career-switcher'
  | 'junior-professional'

export interface StageOption {
  id: UserStage
  title: string
  description: string
}

export type TechnicalTrack =
  | 'software-engineering'
  | 'ui-ux-design'
  | 'data-science'
  | 'product-management'
  | 'devops-cloud'
  | 'cybersecurity'
  | 'ai-ml'
  | 'other'

export type CoreObjective =
  | 'career-direction'
  | 'technical-skills'
  | 'portfolio-review'
  | 'cv-resume-review'
  | 'interview-prep'
  | 'job-search-strategy'
  | 'industry-networking'

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced'

export type MeetingFormat =
  | 'video-call'
  | 'async-review'
  | 'mock-interview'
  | 'monthly-check-in'

export interface MenteeAccount {
  fullName: string
  email: string
  password: string
  stage: UserStage | null
  discipline: TechnicalTrack | null
}

export interface MenteeProfile {
  avatarUrl: string | null
  fullName: string
  email: string
  location: string
  currentStatus: UserStage | null
}

export interface MenteeInterests {
  tracks: TechnicalTrack[]
  objectives: CoreObjective[]
}

export interface MenteeReadiness {
  proficiency: ProficiencyLevel | null
  meetingFormats: MeetingFormat[]
  pledgeAccepted: boolean
}

export interface Mentor {
  id: string
  name: string
  role: string
  company: string
  photoUrl: string
  tags: string[]
  category: string
  available: boolean
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  outcome: string
  photoUrl: string
}
