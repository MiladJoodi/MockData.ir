import type { Metadata } from "next";
import { ResourceApiDocs } from "@/components/docs/resource-api-docs";
import { apiResources } from "@/lib/catalog";
import { withCommonListParams } from "@/lib/docs/query-params";

export const metadata: Metadata = {
  title: "Countries",
  description: "Countries mock REST API with region, capital, and currency.",
};

const resource = apiResources.find((item) => item.id === "countries")!;

const listResponse = `{
  "data": [
    {
      "id": "e1f2a3b4-c5d6-7890-e567-901234567890",
      "name": "Germany",
      "code": "DE",
      "capital": "Berlin",
      "region": "Europe",
      "population": 83783942,
      "currency": "EUR",
      "flagUrl": "https://flagcdn.com/w320/de.png",
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 8,
    "totalPages": 1
  }
}`;

const createResponse = `{
  "data": {
    "id": "f2a3b4c5-d6e7-8901-f678-012345678901",
    "name": "Portugal",
    "code": "PT",
    "capital": "Lisbon",
    "region": "Europe",
    "population": 10196709,
    "currency": "EUR",
    "flagUrl": "https://flagcdn.com/w320/pt.png",
    "createdAt": "2026-09-14T10:05:00.000Z",
    "updatedAt": "2026-09-14T10:05:00.000Z"
  }
}`;

export default function CountriesApiPage() {
  return (
    <ResourceApiDocs
      resource={resource}
      description="Country records with ISO code, region, population, and flagUrl."
      tryHref="/api/countries?region=Europe&limit=6"
      queryParams={withCommonListParams([
        {
          param: "search",
          description: "Name, capital, or ISO code",
          example: "search=iran",
        },
        {
          param: "region",
          description: "Filter by region",
          example: "region=Europe",
        },
        {
          param: "code",
          description: "ISO alpha-2 code",
          example: "code=IR",
        },
        {
          param: "sort",
          description: "createdAt · name · population · default name",
          example: "sort=population",
        },
      ])}
      examples={[
        {
          id: "list",
          label: "list",
          method: "GET",
          fetchCode: `const res = await fetch('/api/countries?region=Europe');
const { data } = await res.json();`,
          axiosCode: `const { data } = await axios.get('/api/countries', { params: { region: 'Europe' } });`,
          curlCode: `curl "http://localhost:3000/api/countries?region=Europe"`,
          responseJson: listResponse,
        },
        {
          id: "create",
          label: "create",
          method: "POST",
          fetchCode: `await fetch('/api/countries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Portugal',
    code: 'PT',
    capital: 'Lisbon',
    region: 'Europe',
    population: 10196709,
    currency: 'EUR',
    flagUrl: 'https://flagcdn.com/w320/pt.png',
  }),
});`,
          axiosCode: `await axios.post('/api/countries', {
  name: 'Portugal',
  code: 'PT',
  capital: 'Lisbon',
  region: 'Europe',
  population: 10196709,
  currency: 'EUR',
  flagUrl: 'https://flagcdn.com/w320/pt.png',
});`,
          curlCode: `curl -X POST "http://localhost:3000/api/countries" -H "Content-Type: application/json" -d '{"name":"Portugal","code":"PT","capital":"Lisbon","region":"Europe","population":10196709,"currency":"EUR","flagUrl":"https://flagcdn.com/w320/pt.png"}'`,
          responseJson: createResponse,
        },
      ]}
    />
  );
}
