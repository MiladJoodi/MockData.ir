import type { Metadata } from "next";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ApiBasePath } from "@/components/docs/api-base-path";
import { EndpointTable } from "@/components/docs/endpoint-table";
import { LiveBadge } from "@/components/docs/live-badge";
import { QueryParamsTable } from "@/components/docs/query-params-table";
import {
  RequestPanel,
  type RequestExample,
} from "@/components/docs/request-panel";
import { ResponseViewer } from "@/components/docs/response-viewer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MOCK_PASSWORD } from "@/lib/auth/mock-auth";
import { apiResources } from "@/lib/catalog";
import { mockControlQueryParams } from "@/lib/docs/query-params";
import { createResourceMetadata } from "@/lib/seo";

const resource = apiResources.find((item) => item.id === "auth")!;

export const metadata: Metadata = createResourceMetadata(resource);
const loginOkBody = `{
  "username": "avachen",
  "password": "${MOCK_PASSWORD}"
}`;

const successExample = `{
  "data": {
    "token": "mock.7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Ava Chen",
      "username": "avachen",
      "email": "ava.chen@example.com",
      "role": "admin"
    }
  }
}`;

const errorExample = `{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid username or password"
  }
}`;

const meExample = `{
  "data": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Ava Chen",
    "username": "avachen",
    "email": "ava.chen@example.com",
    "role": "admin"
  }
}`;

const requestExamples: RequestExample[] = [
  {
    id: "login",
    label: "login",
    method: "POST",
    fetchCode: `const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'avachen',
    password: '${MOCK_PASSWORD}',
  }),
});
const { data } = await res.json();
localStorage.setItem('token', data.token);
// Wrong password → 401 UNAUTHORIZED`,
    axiosCode: `import axios from 'axios';

const { data } = await axios.post('/api/auth/login', {
  username: 'avachen',
  password: '${MOCK_PASSWORD}',
});

localStorage.setItem('token', data.data.token);
// Wrong password → axios throws, status 401`,
    curlCode: `curl -X POST "http://localhost:3000/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '${loginOkBody}'`,
    responseJson: successExample,
  },
  {
    id: "me",
    label: "me",
    method: "GET",
    fetchCode: `const token = localStorage.getItem('token');
const res = await fetch('/api/auth/me', {
  headers: { Authorization: \`Bearer \${token}\` },
});
const { data } = await res.json();
console.log(data);`,
    axiosCode: `import axios from 'axios';

const token = localStorage.getItem('token');
const { data } = await axios.get('/api/auth/me', {
  headers: { Authorization: \`Bearer \${token}\` },
});
console.log(data.data);`,
    curlCode: `curl "http://localhost:3000/api/auth/me" \\
  -H "Authorization: Bearer mock.<user-id>"`,
    responseJson: meExample,
  },
];

export default function AuthApiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 space-y-4 border-b border-border pb-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/", path: "/" },
            { name: "Docs", href: "/docs", path: "/docs" },
            { name: "Auth", path: "/auth" },
          ]}
        />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Auth
              </h1>
              <LiveBadge />
            </div>
            <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">
              Test frontend login flows. Any seeded username + password{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                {MOCK_PASSWORD}
              </code>{" "}
              succeeds; anything else returns{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                401
              </code>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ApiBasePath path={resource.basePath} />
            <Link
              href="/preview/auth"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              <Eye className="size-3.5" strokeWidth={1.75} aria-hidden />
              Preview
            </Link>
            <Link
              href="/playground?resource=auth"
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
            >
              Playground
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
            <QueryParamsTable rows={mockControlQueryParams} />
            <p className="text-[12px] leading-5 text-muted-foreground">
              Persian user fields in the response: add{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                lang=fa
              </code>
              . See{" "}
              <Link
                href="/docs#language"
                className="text-[var(--request)] hover:underline"
              >
                Docs · Language
              </Link>
              .
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4 pt-4">
            <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Demo credentials
            </h2>
            <p className="text-[13px] leading-6 text-muted-foreground">
              Use any username from{" "}
              <Link href="/users" className="text-[var(--request)] hover:underline">
                /api/users
              </Link>
              . Password is always{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
                {MOCK_PASSWORD}
              </code>
              .
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <RequestPanel examples={requestExamples} />
          <ResponseViewer prettyJson={errorExample} />
        </section>
      </div>
    </div>
  );
}
