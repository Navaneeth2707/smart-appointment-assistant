import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
    },
  ],
}