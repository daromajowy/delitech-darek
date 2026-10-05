import {defineCliConfig} from 'sanity/cli';
export default defineCliConfig({api:{projectId:process.env.SANITY_STUDIO_PROJECT_ID || 'suto7hva',dataset:'production'},project:{basePath:'/studio'},deployment:{appId:'ta6sp3wqm4e67krcx4keyef9'}});
