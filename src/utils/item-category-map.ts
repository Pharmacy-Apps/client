import {
  bandageOutline as pharmacyIcon,
  fitnessSharp as labIcon
} from 'ionicons/icons'

const map: {
  [key: string]: { icon: string, label: string, description: string }
} = {
  'all': { icon: '', label: 'All items', description: '' },
  'pharmacy': { icon: pharmacyIcon, label: 'Pharmacy', description: 'Lorem ipsum tabs, medicine loren ipsum' },
  'lab-equipment': { icon: labIcon, label: 'Lab equipment', description: 'Lorem ipsum labs loren ipsum' }
}

export default map