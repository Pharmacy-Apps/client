// import {
//   bandageOutline as pharmacyIcon,
//   fitnessSharp as labIcon
// } from 'ionicons/icons'

import getPageText from 'text'

const Text = getPageText('home')

const map: {
  [key: string]: { icon: string, label: string, description: string }
} = {
  all: {
    icon: '',
    label: Text['category-all'],
    description: ''
  },
  pharmacy: {
    icon: '/assets/icons/pharmacy.svg',
    label: Text['category-pharmacy'],
    description: Text['category-pharmacy-description']
  },
  equipment: {
    icon: '/assets/icons/equipment.svg',
    label: Text['category-equipment'],
    description: Text['category-equipment-description']
  }
}

export default map