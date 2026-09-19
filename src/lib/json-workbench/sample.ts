/** Shared sample for workbench demos. */
export const WORKBENCH_SAMPLE_JSON = `{
  "name": "MockData",
  "active": true,
  "count": 3,
  "skills": ["React", "Next.js"],
  "address": {
    "city": "Tehran"
  }
}`;

/** Nested sample for JSONPath demos. */
export const WORKBENCH_JSONPATH_SAMPLE = `{
  "company": {
    "name": "MockData",
    "founded": 2024
  },
  "users": [
    {
      "name": "Milad",
      "age": 32,
      "profile": {
        "city": "Tehran",
        "roles": ["admin", "editor"]
      }
    },
    {
      "name": "Ali",
      "age": 28,
      "profile": {
        "city": "Isfahan",
        "roles": ["member"]
      }
    }
  ],
  "teams": [
    {
      "id": "frontend",
      "members": [
        { "email": "milad@example.com" },
        { "email": "sara@example.com" }
      ]
    }
  ]
}`;
