import { SSTConfig } from "sst";
import { StaticSite, Bucket, Table, Api } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "nanna-memorial",
      region: "us-east-1",
    };
  },
  stack({ stack }) {
    // 1. Storage: S3 Bucket for Media Uploads
    const mediaBucket = new Bucket(stack, "Media", {
        cors: [
            {
              allowMethods: ["PUT"],
              allowOrigins: ["*"], // In production, restrict to site domain
              allowHeaders: ["*"],
            },
          ],
    });

    // 2. Database: DynamoDB for Tributes and Gallery Metadata
    const table = new Table(stack, "ContentTable", {
      fields: {
        id: "string",
        type: "string", // 'tribute' or 'gallery'
        status: "string", // 'pending' or 'approved'
      },
      primaryIndex: { partitionKey: "id" },
      globalIndexes: {
        StatusIndex: { partitionKey: "status", sortKey: "type" },
      },
    });

    // 3. API: Lambda functions for handling site logic
    const api = new Api(stack, "Api", {
      defaults: {
        function: {
          bind: [mediaBucket, table],
          environment: {
            ADMIN_KEY: process.env.VITE_ADMIN_KEY || "temp-admin-key",
          }
        },
      },
      routes: {
        "GET /tributes": "packages/functions/src/tributes.list",
        "POST /tributes": "packages/functions/src/tributes.create",
        "GET /gallery": "packages/functions/src/gallery.list",
        "POST /gallery": "packages/functions/src/gallery.create",
        "POST /upload-url": "packages/functions/src/gallery.getUploadUrl",
        "GET /admin/pending": "packages/functions/src/admin.listPending",
        "PATCH /admin/status": "packages/functions/src/admin.updateStatus",
      },
    });

    // 4. Hosting: S3 + CloudFront for the React app
    const site = new StaticSite(stack, "Web", {
      path: "./",
      buildOutput: "dist",
      buildCommand: "npm run build",
      environment: {
        VITE_AWS_API_URL: api.url,
      },
    });

    stack.addOutputs({
      ApiUrl: api.url,
      SiteUrl: site.url,
    });
  },
} satisfies SSTConfig;
