import {defineType,defineField} from 'sanity';
const required=(R:any)=>R.required();
const textList=(name:string,title:string)=>defineField({name,title,type:'array',of:[{type:'string'}],validation:required});
const heading=defineField({name:'title',title:'Tytuł',type:'string',validation:required});
const id=defineField({name:'id',title:'Identyfikator',description:'Krótka nazwa bez spacji, np. biuro-warszawa. Po publikacji nie zmieniaj.',type:'string',validation:R=>R.required().regex(/^[a-z0-9-]+$/)});
const order=defineField({name:'order',title:'Kolejność',type:'number',initialValue:10,validation:required});
export const schemaTypes=[
 defineType({name:'pageContent',title:'Strona i teksty',type:'document',fields:[heading,
  defineField({name:'key',title:'Powiązanie ze stroną',type:'string',readOnly:true,validation:required}),
  defineField({name:'entries',title:'Teksty na stronie',description:'Zmieniaj treść pól. Układ, kolory i działanie strony zostają zachowane.',type:'array',options:{sortable:false,disableActions:['add','remove','duplicate']},of:[{type:'object',name:'copyEntry',fields:[
   {name:'key',title:'Identyfikator pola',type:'string',readOnly:true,hidden:true},
   {name:'label',title:'Nazwa pola',type:'string',readOnly:true},
   {name:'value',title:'Treść',type:'text',rows:3,validation:required}
  ],preview:{select:{title:'label',subtitle:'value'}}}]})
 ]}),
 defineType({name:'siteImage',title:'Zdjęcie strony',type:'document',fields:[heading,
  defineField({name:'key',title:'Powiązanie',type:'string',readOnly:true,validation:required}),
  defineField({name:'image',title:'Zdjęcie',description:'Zachowaj podobne proporcje kadru. Opisy alternatywne edytuje się w tekstach danej strony.',type:'image',validation:required})
 ]}),
 defineType({name:'guide',title:'Poradnik',type:'document',fields:[heading,id,order,
  defineField({name:'category',title:'Dla kogo',type:'string',options:{list:[{title:'Dla architektów',value:'architekci'},{title:'Dla biur',value:'biura'},{title:'Dla inwestorów',value:'inwestorzy'}]},validation:required}),
  defineField({name:'summary',title:'Krótki opis',type:'text',rows:3,validation:required}),
  defineField({name:'sections',title:'Rozdziały',type:'array',validation:required,of:[{type:'object',name:'guideSection',fields:[heading,textList('paragraphs','Akapity')],preview:{select:{title:'title'}}}]}),
  textList('checklist','Lista przygotowania do rozmowy'),
  defineField({name:'sources',title:'Źródła i dalsza lektura',type:'array',validation:required,of:[{type:'object',name:'source',fields:[heading,{name:'url',title:'Adres HTTPS',type:'url',validation:R=>R.required().uri({scheme:['https']})}]}]})
 ],orderings:[{title:'Kolejność na stronie',name:'order',by:[{field:'order',direction:'asc'}]}]}),
 defineType({name:'project',title:'Realizacja lub przykład',type:'document',fields:[heading,id,order,
  defineField({name:'type',title:'Rodzaj obiektu',type:'string',options:{list:[{title:'Biuro',value:'biuro'},{title:'Dom',value:'dom'},{title:'Apartament',value:'apartament'}]},validation:required}),
  defineField({name:'subtitle',title:'Podpis: lokalizacja i powierzchnia',type:'string',validation:required}),
  defineField({name:'summary',title:'Opis zakresu',type:'text',validation:required}),
  defineField({name:'image',title:'Zdjęcie',type:'image',validation:required}),
  textList('zones','Strefy instalacyjne'),textList('protocols','Protokoły'),textList('hardware','Osprzęt i moduły')
 ],orderings:[{title:'Kolejność na stronie',name:'order',by:[{field:'order',direction:'asc'}]}]})
];
