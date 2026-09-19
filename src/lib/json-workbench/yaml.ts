import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export type YamlConvertOk = { ok: true; output: string };
export type YamlConvertErr = { ok: false; message: string };
export type YamlConvertResult = YamlConvertOk | YamlConvertErr;

export function jsonTextToYaml(jsonText: string): YamlConvertResult {
  const trimmed = jsonText.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { ok: false, message: "Empty input" };
  try {
    const value = JSON.parse(trimmed) as unknown;
    const output = stringifyYaml(value, {
      lineWidth: 0,
    });
    return { ok: true, output: output.endsWith("\n") ? output : `${output}\n` };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
}

export function yamlTextToJson(yamlText: string): YamlConvertResult {
  const trimmed = yamlText.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { ok: false, message: "Empty input" };
  try {
    const value = parseYaml(trimmed) as unknown;
    if (value === undefined) {
      return { ok: false, message: "YAML document is empty" };
    }
    return {
      ok: true,
      output: `${JSON.stringify(value, null, 2)}\n`,
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Invalid YAML",
    };
  }
}
