type QueryParamRow = {
  param: string;
  description: string;
  example: string;
};

export type { QueryParamRow };

export function QueryParamsTable({ rows }: { rows: QueryParamRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-left text-[13px]">
        <thead className="border-b border-border bg-muted">
          <tr className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            <th className="px-3 py-2 font-medium">Param</th>
            <th className="px-3 py-2 font-medium">Description</th>
            <th className="px-3 py-2 font-medium">Example</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.param} className="border-b border-border last:border-0">
              <td className="px-3 py-2 align-top font-mono text-[12px] font-medium text-[var(--token)]">
                {row.param}
              </td>
              <td className="px-3 py-2 align-top text-muted-foreground">
                {row.description}
              </td>
              <td className="px-3 py-2 align-top font-mono text-[11px] text-[var(--request)]">
                {row.example}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
