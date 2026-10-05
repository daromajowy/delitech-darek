import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemaTypes';
export default defineConfig({
  name:'intelispaces', title:'InteliSpaces — treści strony',
  projectId:process.env.SANITY_STUDIO_PROJECT_ID || 'suto7hva',
  dataset:process.env.SANITY_STUDIO_DATASET || 'production',
  basePath:'/',
  document:{
    newDocumentOptions:options=>options.filter(option=>!['pageContent','siteImage'].includes(option.templateId)),
    actions:(actions,context)=>['pageContent','siteImage'].includes(context.schemaType)
      ? actions.filter(action=>!['delete','duplicate','unpublish'].includes(action.action || ''))
      : actions,
  },
  plugins:[structureTool({structure:S=>S.list().title('Treści strony').items([
    S.documentTypeListItem('pageContent').title('Strony i teksty'),
    S.documentTypeListItem('siteImage').title('Zdjęcia strony'),
    S.documentTypeListItem('guide').title('Poradniki'),
    S.documentTypeListItem('project').title('Realizacje i przykłady'),
  ])})],
  schema:{types:schemaTypes},
});
