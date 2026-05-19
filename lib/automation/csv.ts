export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };

  const pushRow = () => {
    pushField();
    const isEmpty = row.every((c) => c.trim().length === 0);
    if (!isEmpty) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      const next = text[i + 1];
      if (inQuotes && next === '"') {
        field += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && (ch === "," || ch === "\t")) {
      pushField();
      continue;
    }

    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      pushRow();
      continue;
    }

    field += ch;
  }

  if (field.length > 0 || row.length > 0) {
    pushRow();
  }

  return rows;
}

