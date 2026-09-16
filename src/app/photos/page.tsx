import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { actionLabels } from "@/lib/docs/action-labels";
import { withCommonListParams } from "@/lib/docs/query-params";
import { createResourceMetadata } from "@/lib/seo";

const resource = apiResources.find((item) => item.id === "photos")!;

export const metadata: Metadata = createResourceMetadata(resource);

const listResponse = `{
  "data": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "albumId": 1,
      "title": "Morning desk setup",
      "url": "https://picsum.photos/seed/desk/600/400",
      "thumbnailUrl": "https://picsum.photos/seed/desk/150/150",
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}`;

const createResponse = `{
  "data": {
    "id": "d4e5f6a7-b8c9-0123-def0-234567890123",
    "albumId": 1,
    "title": "Desk setup",
    "url": "https://picsum.photos/600/400",
    "thumbnailUrl": "https://picsum.photos/150/150",
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function PhotosApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="Album photos with url and thumbnailUrl. Filter by albumId."
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Search photo title",
          example: "search=desk",
        },
        {
          param: "albumId",
          description: "Filter by album integer id",
          example: "albumId=1",
        },
        {
          param: "sort",
          description: "createdAt · title · albumId",
          example: "sort=title",
        },
      ])}
      examples={[
        {
          id: "list",
          label: actionLabels.list,
          method: "GET",
          fetchCode: `const res = await fetch('/api/photos?albumId=1');
const { data } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/photos', { params: { albumId: 1 } });`,
          curlCode: `curl "http://localhost:3000/api/photos?albumId=1"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: actionLabels.create,
          method: "POST",
          fetchCode: `await fetch('/api/photos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    albumId: 1,
    title: 'Desk setup',
    url: 'https://picsum.photos/600/400',
    thumbnailUrl: 'https://picsum.photos/150/150',
  }),
});`,
          axiosCode: `await axios.post('/api/photos', {
  albumId: 1,
  title: 'Desk setup',
  url: 'https://picsum.photos/600/400',
  thumbnailUrl: 'https://picsum.photos/150/150',
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/photos" -H "Content-Type: application/json" -d '{"albumId":1,"title":"Desk setup","url":"https://picsum.photos/600/400","thumbnailUrl":"https://picsum.photos/150/150"}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
