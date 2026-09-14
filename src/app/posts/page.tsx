import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";
import { EndpointTable } from "@/components/docs/endpoint-table";
import { LiveBadge } from "@/components/docs/live-badge";
import { QueryParamsTable } from "@/components/docs/query-params-table";
import {
  RequestPanel,
  type RequestExample,
} from "@/components/docs/request-panel";
import { TryExample } from "@/components/docs/try-example";
import { apiResources } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Posts mock REST API — endpoints, request examples, and response preview.",
};

const resource = apiResources.find((item) => item.id === "posts")!;

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
    label: "list",
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
    label: ":id",
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
    label: "create",
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
    label: "update",
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
    label: "delete",
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
      <header className="mb-10 space-y-4 border-b border-border pb-8">
        <p className="text-[13px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <Link href="/docs" className="hover:text-foreground">
            Docs
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground">Posts</span>
        </p>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Posts
              </h1>
              <LiveBadge />
            </div>
            <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">
              Blog-style mock posts with author{" "}
              <code className="rounded bg-muted px-1 font-mono text-[12px]">
                userId
              </code>
              , tags, and a published flag.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-md border border-border bg-muted px-2.5 py-1.5 font-mono text-[12px] text-[var(--request)]">
              {resource.basePath}
            </code>
            <CopyButton value={resource.basePath} />
            <Link
              href="/playground"
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              Open Playground
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
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
            <TryExample href="/api/posts?published=true&sort=title&order=asc&limit=6" />
          </div>
        </section>

        <section className="space-y-5">
          <RequestPanel examples={requestExamples} />
        </section>
      </div>
    </div>
  );
}
