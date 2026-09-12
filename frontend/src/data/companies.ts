import type { IconType } from 'react-icons'
import {
  SiStripe,
  SiFigma,
  SiDatadog,
  SiVercel,
  SiGoogle,
  SiDoordash,
} from 'react-icons/si'

export interface CompanyMark {
  name: string
  Icon: IconType
}

export const companies: CompanyMark[] = [
  { name: 'Stripe', Icon: SiStripe },
  { name: 'Figma', Icon: SiFigma },
  { name: 'Datadog', Icon: SiDatadog },
  { name: 'Vercel', Icon: SiVercel },
  { name: 'Google', Icon: SiGoogle },
  { name: 'DoorDash', Icon: SiDoordash },
]
