(function(wp){
  const el=wp.element.createElement;
  const {TextControl,TextareaControl,Button,Notice}=wp.components;
  const {useBlockProps,MediaUpload,MediaUploadCheck}=wp.blockEditor;
  wp.blocks.registerBlockType('intelispaces/section',{
    apiVersion:3,title:'InteliSpaces — sekcja strony',icon:'layout',category:'design',
    description:'Edytowalne treści istniejącego układu DARKA. Wygląd pozostaje w motywie.',
    attributes:{title:{type:'string',default:'Sekcja strony'},fields:{type:'array',default:[]}},
    supports:{html:false,multiple:true,reusable:false},
    edit:function({attributes,setAttributes}){
      const fields=attributes.fields||[];
      function change(index,value){setAttributes({fields:fields.map((field,i)=>i===index?{...field,value}:field)});}
      return el('div',useBlockProps({className:'is-section-editor'}),
        el('h3',{},attributes.title),
        !fields.length&&el(Notice,{status:'info',isDismissible:false},'Ten blok jest tworzony przy imporcie sekcji. Nową treść dodaj blokiem Akapit, Nagłówek lub Obraz.'),
        fields.map((field,index)=>el('div',{key:field.key,className:'is-field'},
          field.type==='image'?el('div',{},el('p',{},field.label),field.value&&el('img',{src:field.value,alt:field.label,style:{maxWidth:240,maxHeight:160,objectFit:'cover'}}),
            el(MediaUploadCheck,{},el(MediaUpload,{allowedTypes:['image'],onSelect:(media)=>change(index,media.url),render:({open})=>el(Button,{variant:'secondary',onClick:open},'Wybierz zdjęcie z biblioteki')}))) :
          el(field.value.length>100?TextareaControl:TextControl,{label:field.label,value:field.value,onChange:value=>change(index,value),rows:Math.min(8,Math.max(3,Math.ceil(field.value.length/100))),help:undefined,__nextHasNoMarginBottom:true})
        )));
    },save:function(){return null;}
  });
})(window.wp);
