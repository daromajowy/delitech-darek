import heroDelitechArch from './assets/images/hero_delitech_architecture_1790288114067.jpg';
import officeCommSpace from './assets/images/office_commercial_space_1790288126038.jpg';
import residentialResidence from './assets/images/residential_residence_1790288136955.jpg';
import knxSwitchHardware from './assets/images/knx_switch_hardware_1790288148780.jpg';

import { cmsImage } from './cms';
export const IMAGES = {
  get heroDelitechArch() { return cmsImage('image.heroDelitechArch', heroDelitechArch); },
  get officeCommSpace() { return cmsImage('image.officeCommSpace', officeCommSpace); },
  get residentialResidence() { return cmsImage('image.residentialResidence', residentialResidence); },
  get knxSwitchHardware() { return cmsImage('image.knxSwitchHardware', knxSwitchHardware); },
};
