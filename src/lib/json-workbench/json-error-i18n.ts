/** Strip trailing location clauses from JSON.parse / SyntaxError messages. */
export function stripJsonErrorLocation(message: string): string {
  return message
    .replace(/\s*at\s+position\s+\d+(\s*\(line\s+\d+\s+column\s+\d+\))?/gi, "")
    .replace(/\s*\(line\s+\d+\s+column\s+\d+\)/gi, "")
    .replace(/\s+in\s+JSON$/i, "")
    .trim();
}

export type JsonErrorCopy = {
  invalid: string;
  empty: string;
  unexpectedEnd: string;
  unexpectedToken: string;
  expectedPropertyName: string;
  expectedCommaOrBrace: string;
  expectedCommaOrBracket: string;
  expectedColon: string;
  unterminatedString: string;
  badControlChar: string;
  badEscape: string;
  trailingChar: string;
  objectKeyExpected: string;
  unexpectedCharacter: string;
  invalidCharacter: string;
  invalidUnicode: string;
  couldNotRepair: string;
  atLineColumn: string;
  atLine: string;
  atPosition: string;
};

/**
 * Translate a native JSON.parse / jsonrepair error reason into the active locale copy.
 * Location is handled separately via formatJsonErrorLocation.
 */
export function translateJsonParseReason(
  rawMessage: string,
  copy: JsonErrorCopy,
): string {
  if (rawMessage === "Empty input") return copy.empty;
  if (/could not repair json/i.test(rawMessage)) return copy.couldNotRepair;

  const reason = stripJsonErrorLocation(rawMessage);
  if (!reason) return copy.invalid;

  if (/unexpected end of json (input|string)/i.test(reason)) {
    return copy.unexpectedEnd;
  }
  if (/object key expected/i.test(reason)) return copy.objectKeyExpected;
  if (/colon expected/i.test(reason)) return copy.expectedColon;
  if (/unterminated string/i.test(reason)) return copy.unterminatedString;
  if (/bad control character/i.test(reason)) return copy.badControlChar;
  if (/bad escaped character|bad escape/i.test(reason)) return copy.badEscape;
  if (/expected double-quoted property name/i.test(reason)) {
    return copy.expectedPropertyName;
  }
  if (/expected property name/i.test(reason)) return copy.expectedPropertyName;
  if (/expected ':'/i.test(reason) || /expected colon/i.test(reason)) {
    return copy.expectedColon;
  }
  if (/expected ',' or '}'/i.test(reason)) return copy.expectedCommaOrBrace;
  if (/expected ',' or ']'/i.test(reason)) return copy.expectedCommaOrBracket;
  if (/unexpected non-whitespace character after json/i.test(reason)) {
    return copy.trailingChar;
  }

  const unexpectedChar = reason.match(
    /unexpected character\s+("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\S+)/i,
  );
  if (unexpectedChar?.[1]) {
    return copy.unexpectedCharacter.replace("{char}", unexpectedChar[1]);
  }

  const invalidChar = reason.match(
    /invalid character\s+("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\S+)/i,
  );
  if (invalidChar?.[1]) {
    return copy.invalidCharacter.replace("{char}", invalidChar[1]);
  }

  const invalidUnicode = reason.match(
    /invalid unicode character\s+"?([^"]+)"?/i,
  );
  if (invalidUnicode?.[1]) {
    return copy.invalidUnicode.replace("{chars}", invalidUnicode[1].trim());
  }

  const token = reason.match(/unexpected token\s+(.+?)(?:\s+in\s+json)?$/i);
  if (token?.[1]) {
    return copy.unexpectedToken.replace("{token}", token[1].trim());
  }
  if (/unexpected token/i.test(reason)) {
    return copy.unexpectedToken.replace("{token}", "?");
  }

  // Already localized / unknown — show cleaned reason
  return reason;
}

export function formatJsonErrorLocation(
  copy: JsonErrorCopy,
  loc: { line?: number; column?: number; position?: number },
): string {
  if (loc.line != null && loc.column != null) {
    return copy.atLineColumn
      .replace("{line}", String(loc.line))
      .replace("{column}", String(loc.column));
  }
  if (loc.line != null) {
    return copy.atLine.replace("{line}", String(loc.line));
  }
  if (loc.position != null) {
    return copy.atPosition.replace("{position}", String(loc.position));
  }
  return "";
}
