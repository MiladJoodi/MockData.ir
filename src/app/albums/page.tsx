import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { actionLabels } from "@/lib/docs/action-labels";
import { withCommonListParams } from "@/lib/docs/query-params";
import { createResourceMetadata } from "@/lib/seo";

const resource = apiResources.find((item) => item.id === "albums")!;

export const metadata: Metadata = createResourceMetadata(resource);

const listResponse = `{
  "data": [
    {
      "id": 1,
      "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "title": "City walks",
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 8,
    "totalPages": 1
  }
}`;

const createResponse = `{
  "data": {
    "id": 9,
    "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "title": "Weekend trip",
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function AlbumsApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="Photo albums owned by users. Photos use albumId to group into these albums."
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Search album title",
          example: "search=city",
        },
        {
          param: "userId",
          description: "Filter by owner UUID",
          example: "userId=…",
        },
        {
          param: "sort",
          description: "createdAt · title · id · default id",
          example: "sort=title",
        },
      ])}
      examples={[
        {
          id: "list",
          label: actionLabels.list,
          method: "GET",
          fetchCode: `const res = await fetch('/api/albums');
const { data } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/albums');`,
          curlCode: `curl "http://localhost:3000/api/albums"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: actionLabels.create,
          method: "POST",
          fetchCode: `await fetch('/api/albums', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '<user-uuid>',
    title: 'Weekend trip',
  }),
});`,
          axiosCode: `await axios.post('/api/albums', {
  userId: '<user-uuid>',
  title: 'Weekend trip',
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/albums" -H "Content-Type: application/json" -d '{"userId":"...","title":"Weekend trip"}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
