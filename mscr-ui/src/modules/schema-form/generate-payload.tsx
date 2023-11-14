/* eslint-disable */
import { Schema, SchemaFormType } from '@app/common/interfaces/schema.interface';


// here we can create the schema payload

export default function generatePayload(data: SchemaFormType):Schema{
  
  console.log(data.format);
  return {
    // id will be pid , during post no id
    namespace: "http://test.com", 
    pid:"",
    description: data.languages
      .filter((l: { description: string }) => l.description !== '')
      .reduce(
        (obj: any, l: { uniqueItemId: any; description: any }) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .reduce(
        (obj: any, l: { uniqueItemId: any; title: any }) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    languages: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .map((l: { uniqueItemId: any }) => l.uniqueItemId),
    organizations: data.organizations.map(
      (o: { uniqueItemId: any }) => o.uniqueItemId
    ),
    status: data.status,
    format: data.format,
    uri:data.uri
    
  };


}
