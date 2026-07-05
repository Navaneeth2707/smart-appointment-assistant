import type { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',

  admin: {
    useAsTitle: 'patientName',
  },

  access: {
    create: () => true, // Anyone can book an appointment
    read: ({ req }) => true, // Only logged-in admins can view
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  fields: [
    {
      name: 'patientName',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'serviceName',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'appointmentDate',
      type: 'date',
      required: true,
    },
  ],
}