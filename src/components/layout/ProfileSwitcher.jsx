import React, { useMemo } from 'react';
import { FiUsers } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { getActiveProfileId, getProfileOptions } from '../../utils/profileScope';

export default function ProfileSwitcher() {
  const { state, setActiveProfile } = useApp();
  const options = useMemo(() => getProfileOptions(state), [state]);
  const activeId = getActiveProfileId(state);

  if (options.length <= 1) return null;

  return (
    <label className="profile-switcher hidden-mobile">
      <FiUsers />
      <select
        value={activeId}
        onChange={(e) => setActiveProfile(e.target.value)}
        aria-label="Switch profile"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name} ({option.relation})
          </option>
        ))}
      </select>
    </label>
  );
}
