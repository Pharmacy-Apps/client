// import {
//   bandageOutline as pharmacyIcon,
//   fitnessSharp as labIcon
// } from 'ionicons/icons'

import getPageText from 'text'
import { imageServerUrl } from 'utils'

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
    icon: imageServerUrl + '/pharmacy.jpeg', // /assets/icons/pharmacy.svg
    label: Text['category-pharmacy'],
    description: Text['category-pharmacy-description']
  },
  'medical-devices': {
    icon: imageServerUrl + '/medical-devices.jpeg',
    label: Text['category-medical-devices'],
    description: Text['category-medical-devices-description']
  },
  'lab-equipment': {
    icon: imageServerUrl + '/lab-equipment.jpeg',
    label: Text['category-maintenance-tools'],
    description: Text['category-maintenance-tools-description']
  },
  'medical-supplies': {
    icon: imageServerUrl + '/medical-supplies.jpeg',
    label: Text['category-medical-supplies'],
    description: Text['category-medical-supplies-description']
  },
  'health-services': {
    icon: imageServerUrl + '/health-services.jpeg',
    label: Text['category-health-services'],
    description: Text['category-health-services-description']
  }
}

export default map