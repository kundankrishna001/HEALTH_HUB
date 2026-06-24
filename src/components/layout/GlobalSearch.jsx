import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { searchAppState } from '../../utils/globalSearch';

export default function GlobalSearch() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const results = useMemo(() => searchAppState(state, query), [state, query]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (to) => {
    navigate(to);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="topbar-search hidden-mobile" ref={rootRef}>
      <FiSearch />
      <input
        placeholder="Search meals, symptoms, recipes..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={{ width: '100%' }}
      />
      {open && query.trim() ? (
        <div className="search-dropdown">
          {results.length ? (
            results.map((item) => (
              <button key={`${item.type}-${item.id}`} type="button" className="search-result" onClick={() => handleSelect(item.to)}>
                <span className="search-result-type">{item.type}</span>
                <strong>{item.title}</strong>
                <span className="muted">{item.subtitle}</span>
              </button>
            ))
          ) : (
            <div className="search-empty muted">No matches found</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
