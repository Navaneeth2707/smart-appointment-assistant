import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { Services } from './collections/Services'
import { Appointments } from './collections/Appointments'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,

  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),

  collections: [
    Services,
    Appointments,
  ],

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})