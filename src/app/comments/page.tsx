import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { withCommonListParams } from "@/lib/docs/query-params";

export const metadata: Metadata = {
  title: "Comments",
  description: "Comments mock REST API for posts.",
};

const resource = apiResources.find((item) => item.id === "comments")!;

const listResponse = `{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "postId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Alex Rivera",
      "email": "alex@example.com",
      "body": "Nice post — thanks for sharing.",
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
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "postId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Alex",
    "email": "alex@example.com",
    "body": "Nice post!",
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function CommentsApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="Comments on posts with name, email, and body. Filter by postId."
      tryHref="/api/comments?limit=6"
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Name, email, or body",
          example: "search=thanks",
        },
        {
          param: "postId",
          description: "Filter by post UUID",
          example: "postId=…",
        },
        {
          param: "sort",
          description: "createdAt · name",
          example: "sort=name",
        },
      ])}
      examples={[
        {
          id: "list",
          label: "list",
          method: "GET",
          fetchCode: `const res = await fetch('/api/comments?limit=12');
const { data, pagination } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/comments', { params: { limit: 12 } });`,
          curlCode: `curl "http://localhost:3000/api/comments?limit=12"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: "create",
          method: "POST",
          fetchCode: `await fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    postId: '<post-uuid>',
    name: 'Alex',
    email: 'alex@example.com',
    body: 'Nice post!',
  }),
});`,
          axiosCode: `await axios.post('/api/comments', {
  postId: '<post-uuid>',
  name: 'Alex',
  email: 'alex@example.com',
  body: 'Nice post!',
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/comments" -H "Content-Type: application/json" -d '{"postId":"...","name":"Alex","email":"alex@example.com","body":"Nice post!"}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
