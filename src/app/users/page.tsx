import type { Metadata } from "next";
import { EndpointTable } from "@/components/docs/endpoint-table";
import { QueryParamsTable } from "@/components/docs/query-params-table";
import {
  RequestPanel,
  type RequestExample,
} from "@/components/docs/request-panel";
import { ResourceDocsHeader } from "@/components/docs/resource-docs-header";
import { TryExample } from "@/components/docs/try-example";
import { apiResources } from "@/lib/catalog";
import { createResourceMetadata } from "@/lib/seo";

const resource = apiResources.find((item) => item.id === "users")!;

export const metadata: Metadata = createResourceMetadata(resource);
const userBody = `{
  "name": "Jordan Lee",
  "username": "jordanlee",
  "email": "jordan.lee@example.com",
  "avatarUrl": "https://images.example.com/avatars/jordan.jpg",
  "phone": "+1-555-0142",
  "company": "Northwind Labs",
  "role": "member",
  "city": "Austin",
  "country": "United States",
  "bio": "Product engineer who ships mock APIs.",
  "website": "https://jordanlee.dev"
}`;

const patchBody = `{
  "role": "admin",
  "city": "Berlin"
}`;

const listExample = `{
  "data": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Ava Chen",
      "username": "avachen",
      "email": "ava.chen@example.com",
      "role": "admin",
      "city": "San Francisco",
      "country": "United States"
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
    "name": "Ava Chen",
    "username": "avachen",
    "email": "ava.chen@example.com",
    "role": "admin",
    "city": "San Francisco",
    "country": "United States"
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
    fetchCode: `const res = await fetch('/api/users?limit=12');
const payload = await res.json();
console.log(payload.data, payload.pagination);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.get('/api/users', {
  params: { limit: 12 },
});
console.log(data.data, data.pagination);`,
    curlCode: `curl "http://localhost:3000/api/users?limit=12"`,
    responseJson: listExample,
  },
  {
    id: "one",
    label: ":id",
    method: "GET",
    fetchCode: `const res = await fetch('/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7');
const payload = await res.json();
console.log(payload.data);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.get(
  '/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7',
);
console.log(data.data);`,
    curlCode: `curl "http://localhost:3000/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7"`,
    responseJson: oneExample,
  },
  {
    id: "create",
    label: "create",
    method: "POST",
    fetchCode: `const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${userBody}),
});
const payload = await res.json();
console.log(payload.data);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.post('/api/users', ${userBody});
console.log(data.data);`,
    curlCode: `curl -X POST "http://localhost:3000/api/users" \\
  -H "Content-Type: application/json" \\
  -d '${userBody}'`,
    responseJson: oneExample.replace("Ava Chen", "Jordan Lee").replace("avachen", "jordanlee"),
  },
  {
    id: "update",
    label: "update",
    method: "PATCH",
    fetchCode: `const res = await fetch('/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${patchBody}),
});
const payload = await res.json();
console.log(payload.data);`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.patch(
  '/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7',
  ${patchBody},
);
console.log(data.data);`,
    curlCode: `curl -X PATCH "http://localhost:3000/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7" \\
  -H "Content-Type: application/json" \\
  -d '${patchBody}'`,
    responseJson: oneExample.replace('"role": "admin"', '"role": "admin"').replace(
      "San Francisco",
      "Berlin",
    ),
  },
  {
    id: "delete",
    label: "delete",
    method: "DELETE",
    fetchCode: `const res = await fetch('/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7', {
  method: 'DELETE',
});
console.log(res.status);`,
    axiosCode: `import axios from 'axios';

await axios.delete('/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7');`,
    curlCode: `curl -X DELETE "http://localhost:3000/api/users/7c9e6679-7425-40de-944b-e07fc1f90ae7" -i`,
    responseJson: deleteExample,
  },
];

export default function UsersApiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ResourceDocsHeader
        resourceId="users"
        basePath={resource.basePath}
        href="/users"
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
                  description: "Name, username, email, company, city",
                  example: "search=ava",
                },
                {
                  param: "role",
                  description: "admin · member · guest",
                  example: "role=admin",
                },
                {
                  param: "country",
                  description: "Filter by country",
                  example: "country=Germany",
                },
                {
                  param: "sort",
                  description: "createdAt · name · username",
                  example: "sort=name",
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
            <TryExample href="/api/users?role=member&sort=name&order=asc&limit=6" />
          </div>
        </section>

        <section className="min-w-0 space-y-5">
          <RequestPanel examples={requestExamples} />
        </section>
      </div>
    </div>
  );
}
