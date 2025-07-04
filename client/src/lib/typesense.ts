import Typesense from 'typesense'

export const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || '',
      port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) || 443,
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'https',
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || '',
  connectionTimeoutSeconds: 2,
})
