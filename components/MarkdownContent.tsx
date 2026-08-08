import type { ReactNode } from "react";
import { sanitizeArticleContent } from "@/lib/articleContent";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

function renderInline(text: string): ReactNode[] {
  const parts = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function renderTable(lines: string[], key: string) {
  const rows = lines
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((row) => !row.every((cell) => /^-+$/.test(cell.replaceAll(" ", ""))));
  const [head, ...body] = rows;

  if (!head) {
    return null;
  }

  return (
    <div className="markdown-table-wrap" key={key}>
      <table>
        <thead>
          <tr>
            {head.map((cell) => <th key={cell}>{renderInline(cell)}</th>)}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={`${key}-${rowIndex}`}>
              {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  const blocks: ReactNode[] = [];
  const lines = sanitizeArticleContent(content).split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];
  let table: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      const text = paragraph.join(" ");
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(text)}</p>);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {list.map((item) => <li key={item}>{renderInline(item)}</li>)}
        </ul>
      );
      list = [];
    }
  };

  const flushOrderedList = () => {
    if (orderedList.length) {
      blocks.push(
        <ol key={`ol-${blocks.length}`}>
          {orderedList.map((item, index) => <li key={`${item}-${index}`}>{renderInline(item)}</li>)}
        </ol>
      );
      orderedList = [];
    }
  };

  const flushTable = () => {
    if (table.length) {
      blocks.push(renderTable(table, `table-${blocks.length}`));
      table = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushOrderedList();
    flushTable();
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      return;
    }

    if (line.startsWith("|")) {
      flushParagraph();
      flushList();
      table.push(line);
      return;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushOrderedList();
      flushTable();
      list.push(line.slice(2));
      return;
    }

    const orderedMatch = line.match(/^\d+[.)]\s+(.+)/);
    if (orderedMatch) {
      flushParagraph();
      flushList();
      flushTable();
      orderedList.push(orderedMatch[1]);
      return;
    }

    if (line.startsWith("### ")) {
      flushAll();
      blocks.push(<h3 key={`h3-${blocks.length}`}>{renderInline(line.slice(4))}</h3>);
      return;
    }

    if (line.startsWith("## ")) {
      flushAll();
      blocks.push(<h2 key={`h2-${blocks.length}`}>{renderInline(line.slice(3))}</h2>);
      return;
    }

    flushList();
    flushOrderedList();
    flushTable();
    paragraph.push(line);
  });

  flushAll();

  return <div className={`markdown-content ${className}`.trim()}>{blocks}</div>;
}
