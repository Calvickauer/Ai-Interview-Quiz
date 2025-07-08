#!/bin/sh
# Deploy the Next.js app on Vercel
npx vercel --prod --cwd client "$@"
