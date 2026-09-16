import type { Metadata } from "next";
import { EndpointTable } from "@/components/docs/endpoint-table";
import { QueryParamsTable } from "@/components/docs/query-params-table";
import {
  RequestPanel,
  type RequestExample,
} from "@/components/docs/request-panel";
import { ResourceDocsHeader } from "@/components/docs/resource-docs-header";
import { apiResources } from "@/lib/catalog";
import { actionLabels } from "@/lib/docs/action-labels";
import { createResourceMetadata } from "@/lib/seo";

const resource = apiResources.find((item) => item.id === "posts")!;

export const metadata: Metadata = createResourceMetadata(resource);
const postBody = `{
  "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "title": "Shipping mock posts",
  "body": "A short blog-style body for demos and UI tests.",
  "tags": ["api", "content"],
  "published": true
}`;

const patchBody = `{
  "published": false,
  "tags": ["draft"]
}`;

const listExample = `{
  "data": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Why fake APIs speed up frontend work",
      "body": "Mock endpoints let UI teams ship screens before the backend is ready.",
      "tags": ["dx", "frontend", "mock"],
      "published": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}`;

const oneExample = `{
  "data": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Why fake APIs speed up frontend work",
    "body": "Mock endpoints let UI teams ship screens before the backend is ready.",
    "tags": ["dx", "frontend", "mock"],
    "published": true
  }
}`;

const deleteExample = `{
  "data": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
  }
}`;

const requestExamples: RequestExample[] = [
  {
    id: "list",
    label: actionLabels.list,
    method: "GET",
    fetchCode: `const res = await fetch('/api/posts?limit=12');
const payload = await res.json();
console.log(payload.data, payload.pagination);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.get('/api/posts', {
  params: { limit: 12 },
});
console.log(data.data, data.pagination);`,
    curlCode: `curl "http://localhost:3000/api/posts?limit=12"`,
    responseJson: listExample,
  },
  {
    id: "one",
    label: actionLabels.get,
    method: "GET",
    fetchCode: `const res = await fetch('/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7');
const payload = await res.json();
console.log(payload.data);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.get(
  '/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7',
);
console.log(data.data);`,
    curlCode: `curl "http://localhost:3000/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7"`,
    responseJson: oneExample,
  },
  {
    id: "create",
    label: actionLabels.create,
    method: "POST",
    fetchCode: `const res = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${postBody}),
});
const payload = await res.json();
console.log(payload.data);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.post('/api/posts', ${postBody});
console.log(data.data);`,
    curlCode: `curl -X POST "http://localhost:3000/api/posts" \\
  -H "Content-Type: application/json" \\
  -d '${postBody}'`,
    responseJson: oneExample.replace(
      "Why fake APIs speed up frontend work",
      "Shipping mock posts",
    ),
  },
  {
    id: "update",
    label: actionLabels.update,
    method: "PATCH",
    fetchCode: `const res = await fetch('/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${patchBody}),
});
const payload = await res.json();
console.log(payload.data);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.patch(
  '/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7',
  ${patchBody},
);
console.log(data.data);`,
    curlCode: `curl -X PATCH "http://localhost:3000/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7" \\
  -H "Content-Type: application/json" \\
  -d '${patchBody}'`,
    responseJson: oneExample
      .replace('"published": true', '"published": false')
      .replace('["dx", "frontend", "mock"]', '["draft"]'),
  },
  {
    id: "delete",
    label: actionLabels.delete,
    method: "DELETE",
    fetchCode: `const res = await fetch('/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7', {
  method: 'DELETE',
});
console.log(res.status);`,
    axiosCode: `import axios from 'axios';

await axios.delete('/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7');`,
    curlCode: `curl -X DELETE "http://localhost:3000/api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7" -i`,
    responseJson: deleteExample,
  },
];

export default function PostsApiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ResourceDocsHeader
        resourceId="posts"
        basePath={resource.basePath}
        href="/posts"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10" dir="ltr">
        <section className="space-y-3">
          <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Endpoints
          </h2>
          <EndpointTable rows={resource.endpoints} />

          <div className="space-y-3 pt-4">
            <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Query params
            </h2>
            <QueryParamsTable
              rows={[
                {
                  param: "page",
                  description: "Page number · default 1",
                  example: "page=2",
                },
                {
                  param: "limit",
                  description: "Page size · default 12 · max 50",
                  example: "limit=12",
                },
                {
                  param: "search",
                  description: "Title or body",
                  example: "search=api",
                },
                {
                  param: "userId",
                  description: "Filter by author UUID",
                  example: "userId=…",
                },
                {
                  param: "published",
                  description: "true · false",
                  example: "published=true",
                },
                {
                  param: "sort",
                  description: "createdAt · title",
                  example: "sort=title",
                },
                {
                  param: "order",
                  description: "asc · desc",
                  example: "order=asc",
                },
                {
                  param: "lang",
                  description: "Pass fa for Persian text · omit for English",
                  example: "lang=fa",
                },
                {
                  param: "delay",
                  description: "Artificial wait in ms · max 5000",
                  example: "delay=800",
                },
                {
                  param: "status",
                  description: "Force error HTTP status · 400–599",
                  example: "status=500",
                },
              ]}
            />
          </div>
        </section>

        <section className="min-w-0 space-y-5">
          <RequestPanel examples={requestExamples} />
        </section>
      </div>
    </div>
  );
}
