import React, { useMemo, useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';

export default function DataTable({ columns, rows, searchable = false, placeholder = 'Search', pageSize = 5 }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchable || !debouncedQuery) return rows;
    const term = debouncedQuery.toLowerCase();
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
  }, [rows, searchable, debouncedQuery]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {searchable ? (
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder={placeholder}
          style={{
            borderRadius: 14,
            padding: '12px 14px',
            border: '1px solid var(--border)',
            background: 'var(--surface-strong)',
            color: 'var(--text)'
          }}
        />
      ) : null}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((column) => (
                  <td key={column.key} style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
                    {typeof column.render === 'function' ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: 13 }}>
            Page {page} of {pageCount}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Prev</button>
            <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
