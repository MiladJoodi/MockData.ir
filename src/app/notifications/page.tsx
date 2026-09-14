import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { withCommonListParams } from "@/lib/docs/query-params";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Notifications mock REST API linked to users.",
};

const resource = apiResources.find((item) => item.id === "notifications")!;

const listResponse = `{
  "data": [
    {
      "id": "c9d0e1f2-a3b4-5678-c345-789012345678",
      "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "title": "Welcome to MockData",
      "message": "Your workspace seed data is ready to explore.",
      "type": "success",
      "read": false,
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
    "id": "d0e1f2a3-b4c5-6789-d456-890123456789",
    "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "title": "Shipment update",
    "message": "Your order is on the way.",
    "type": "info",
    "read": false,
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function NotificationsApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="User notifications with type and read flags."
      tryHref="/api/notifications?read=false&limit=6"
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Title or message",
          example: "search=welcome",
        },
        {
          param: "userId",
          description: "Filter by user UUID",
          example: "userId=…",
        },
        {
          param: "type",
          description: "info · success · warning · error",
          example: "type=warning",
        },
        {
          param: "read",
          description: "true · false",
          example: "read=false",
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
          fetchCode: `const res = await fetch('/api/notifications?read=false');
const { data } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/notifications', { params: { read: false } });`,
          curlCode: `curl "http://localhost:3000/api/notifications?read=false"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: "create",
          method: "POST",
          fetchCode: `await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '<user-uuid>',
    title: 'Shipment update',
    message: 'Your order is on the way.',
    type: 'info',
    read: false,
  }),
});`,
          axiosCode: `await axios.post('/api/notifications', {
  userId: '<user-uuid>',
  title: 'Shipment update',
  message: 'Your order is on the way.',
  type: 'info',
  read: false,
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/notifications" -H "Content-Type: application/json" -d '{"userId":"...","title":"Shipment update","message":"Your order is on the way.","type":"info","read":false}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
