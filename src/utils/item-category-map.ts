// import {
//   bandageOutline as pharmacyIcon,
//   fitnessSharp as labIcon
// } from 'ionicons/icons'

import getPageText from 'text'

const Text = getPageText('home')

const map: {
  [key: string]: { icon: string, label: string, description: string }
} = {
  'all': {
    icon: '',
    label: Text['category-all'],
    description: ''
  },
  'pharmacy': {
    icon: '/assets/icons/pharmacy.svg',
    label: Text['category-pharmacy'],
    description: Text['category-pharmacy-description']
  },
  'medical-devices': {
    icon: '/assets/icons/equipment.svg',
    label: Text['category-medical-devices'],
    description: Text['category-medical-devices-description']
  },
  'lab-equipment': {
    icon: '/assets/icons/equipment.svg',
    label: Text['category-lab-equipment'],
    description: Text['category-lab-equipment-description']
  },
  'medical-supplies': {
    icon: '/assets/icons/equipment.svg',
    label: Text['category-medical-supplies'],
    description: Text['category-medical-supplies-description']
  },
  'health-services': {
    icon: '/assets/icons/equipment.svg',
    label: Text['category-health-services'],
    description: Text['category-health-services-description']
  }
}

export default map