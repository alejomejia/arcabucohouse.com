# Vercel hosting optimization

To avoid pricing issues with Vercel, make sure to follow these rules:

## Bandwidth

- Avoid placing large assets in the public directory to save on CDN costs
- Use external storage services like S3, R2, or UploadThing for large files
- Limit the paths allowed in image optimization to prevent excessive costs (next.config.ts)

## Serverless

- Run database queries concurrently to reduce blocking and minimize compute time
- Use caching mechanisms to reduce redundant API calls and database queries
- Ensure mostly static pages are generated as static HTML to avoid dynamic costs
- Monitor image optimization costs on Vercel, especially for high-volume projects
- Consider alternative analytics services to avoid high Vercel analytics fees
