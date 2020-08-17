// import {
//   bandageOutline as pharmacyIcon,
//   fitnessSharp as labIcon
// } from 'ionicons/icons'

const map: {
  [key: string]: { icon: string, label: string, description: string }
} = {
  'all': { icon: '', label: 'All items', description: '' },
  'pharmacy': { icon: '/assets/icons/pharmacy.svg', label: 'Pharmacy', description: 'Lorem ipsum tabs, medicine loren ipsum' },
  'equipment': { icon: '/assets/icons/equipment.svg', label: 'Medical equipment', description: 'Lorem ipsum labs loren ipsum' }
}

export default map