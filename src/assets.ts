import {cmsImage} from './cms/content.ts';
import heroDelitechArch from './assets/images/hero_delitech_architecture_1790288114067.jpg';
import officeCommSpace from './assets/images/office_commercial_space_1790288126038.jpg';
import residentialResidence from './assets/images/residential_residence_1790288136955.jpg';
import jungLsZero from './assets/images/jung-ls-zero-official.webp';

export const IMAGES = {
  get heroDelitechArch() { return cmsImage('heroDelitechArch', heroDelitechArch); },
  get officeCommSpace() { return cmsImage('officeCommSpace', officeCommSpace); },
  get residentialResidence() { return cmsImage('residentialResidence', residentialResidence); },
  get jungLsZero() { return cmsImage('jungLsZero', jungLsZero); },
};
