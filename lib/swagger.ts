import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0',
      },
      tags: [
        {
          name: 'GitHub',
        },
        {
          name: 'Bookmarks',
        },
        {
          name: 'Users',
        },
        {
          name: 'Auth',
        },
      ],
    },
  });
  return spec;
};