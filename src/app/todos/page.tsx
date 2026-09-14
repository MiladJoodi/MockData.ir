import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { withCommonListParams } from "@/lib/docs/query-params";
import { createResourceMetadata } from "@/lib/seo";

const resource = apiResources.find((item) => item.id === "todos")!;

export const metadata: Metadata = createResourceMetadata(resource);

const listResponse = `{
  "data": [
    {
      "id": "e5f6a7b8-c9d0-1234-ef01-345678901234",
      "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "title": "Ship Posts docs page",
      "completed": false,
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
    "id": "f6a7b8c9-d0e1-2345-f012-456789012345",
    "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "title": "Ship the feature",
    "completed": false,
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function TodosApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="Simple tasks linked to users. Filter by completed or userId."
      tryHref="/api/todos?completed=false&limit=6"
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Search todo title",
          example: "search=ship",
        },
        {
          param: "userId",
          description: "Filter by user UUID",
          example: "userId=…",
        },
        {
          param: "completed",
          description: "true · false",
          example: "completed=false",
        },
        {
          param: "sort",
          description: "createdAt · title",
          example: "sort=title",
        },
      ])}
      examples={[
        {
          id: "list",
          label: "list",
          method: "GET",
          fetchCode: `const res = await fetch('/api/todos?completed=false');
const { data } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/todos', { params: { completed: false } });`,
          curlCode: `curl "http://localhost:3000/api/todos?completed=false"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: "create",
          method: "POST",
          fetchCode: `await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '<user-uuid>',
    title: 'Ship the feature',
    completed: false,
  }),
});`,
          axiosCode: `await axios.post('/api/todos', {
  userId: '<user-uuid>',
  title: 'Ship the feature',
  completed: false,
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/todos" -H "Content-Type: application/json" -d '{"userId":"...","title":"Ship the feature","completed":false}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
