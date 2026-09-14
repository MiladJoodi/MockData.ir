import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { withCommonListParams } from "@/lib/docs/query-params";

export const metadata: Metadata = {
  title: "Products",
  description: "Products mock REST API with price, stock, and category.",
};

const resource = apiResources.find((item) => item.id === "products")!;

const listResponse = `{
  "data": [
    {
      "id": "a7b8c9d0-e1f2-3456-a123-567890123456",
      "name": "Nordic Desk Lamp",
      "description": "Matte aluminum lamp with warm dimmable LED.",
      "price": 49.99,
      "stock": 120,
      "category": "home",
      "imageUrl": "https://picsum.photos/seed/lamp/600/400",
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
    "id": "b8c9d0e1-f2a3-4567-b234-678901234567",
    "name": "Desk Lamp",
    "description": "Warm LED lamp",
    "price": 49.99,
    "stock": 40,
    "category": "home",
    "imageUrl": "https://picsum.photos/seed/newlamp/600/400",
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function ProductsApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="Catalog items with price, stock, category, and imageUrl."
      tryHref="/api/products?category=electronics&limit=6"
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Name or description",
          example: "search=lamp",
        },
        {
          param: "category",
          description: "Filter by category",
          example: "category=electronics",
        },
        {
          param: "sort",
          description: "createdAt · name · price · stock",
          example: "sort=price",
        },
      ])}
      examples={[
        {
          id: "list",
          label: "list",
          method: "GET",
          fetchCode: `const res = await fetch('/api/products?category=electronics');
const { data } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/products', { params: { category: 'electronics' } });`,
          curlCode: `curl "http://localhost:3000/api/products?category=electronics"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: "create",
          method: "POST",
          fetchCode: `await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Desk Lamp',
    description: 'Warm LED lamp',
    price: 49.99,
    stock: 40,
    category: 'home',
    imageUrl: 'https://picsum.photos/seed/newlamp/600/400',
  }),
});`,
          axiosCode: `await axios.post('/api/products', {
  name: 'Desk Lamp',
  description: 'Warm LED lamp',
  price: 49.99,
  stock: 40,
  category: 'home',
  imageUrl: 'https://picsum.photos/seed/newlamp/600/400',
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/products" -H "Content-Type: application/json" -d '{"name":"Desk Lamp","description":"Warm LED lamp","price":49.99,"stock":40,"category":"home","imageUrl":"https://picsum.photos/seed/newlamp/600/400"}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
