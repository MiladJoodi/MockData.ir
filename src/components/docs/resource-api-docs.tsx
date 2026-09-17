"use client";

import { EndpointTable } from "@/components/docs/endpoint-table";
import {
  QueryParamsTable,
  type QueryParamRow,
} from "@/components/docs/query-params-table";
import {
  RequestPanel,
  type RequestExample,
} from "@/components/docs/request-panel";
import { ResourceDocsHeader } from "@/components/docs/resource-docs-header";
import { ResponseViewer } from "@/components/docs/response-viewer";
import type { ApiResource } from "@/lib/catalog";

type Props = {
  resource: ApiResource;
  description: string;
  examples: RequestExample[];
  queryParams?: QueryParamRow[];
  responseJson?: string;
};

export function ResourceApiDocs({
  resource,
  description,
  examples,
  queryParams,
  responseJson,
}: Props) {
  const examplesHaveResponses = examples.some((ex) => Boolean(ex.responseJson));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ResourceDocsHeader
        resourceId={resource.id}
        basePath={resource.basePath}
        href={resource.href}
        summary={description}
      />

      <div
        className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10"
        dir="ltr"
      >
        <section className="space-y-3">
          <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Endpoints
          </h2>
          <EndpointTable rows={resource.endpoints} />

          {queryParams && queryParams.length > 0 ? (
            <div className="space-y-3 pt-4">
              <h2 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Query params
              </h2>
              <QueryParamsTable rows={queryParams} />
            </div>
          ) : null}
        </section>
        <section className="min-w-0 space-y-5">
          <RequestPanel examples={examples} />
          {!examplesHaveResponses && responseJson ? (
            <ResponseViewer prettyJson={responseJson} />
          ) : null}
        </section>
      </div>
    </div>
  );
}
