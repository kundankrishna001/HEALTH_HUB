import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiDroplet, FiActivity, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

export default function QuickAdd() {
  const { logWater } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const close = () => setOpen(false);

  const actions = [
    {
      icon: FiDroplet,
      label: 'Add water (250 ml)',
      onClick: async () => {
        await logWater(250);
        toast.success('250 ml water logged');
        close();
      }
    },
    {
      icon: FiBarChart2,
      label: 'Log a meal',
      onClick: () => {
        navigate('/app/nutrition');
        close();
      }
    },
    {
      icon: FiActivity,
      label: 'Check symptoms',
      onClick: () => {
        navigate('/app/symptoms');
        close();
      }
    },
    {
      icon: FiCalendar,
      label: 'Generate diet plan',
      onClick: () => {
        navigate('/app/diet-plan');
        close();
      }
    }
  ];

  return (
    <div className="quick-add" ref={rootRef}>
      <button
        type="button"
        className="quick-add-trigger"
        aria-label="Quick add"
        onClick={() => setOpen((value) => !value)}
      >
        <FiPlus size={20} />
      </button>

      {open ? (
        <div className="quick-add-panel">
          <div className="quick-add-head">Quick log</div>
          {actions.map(({ icon: Icon, label, onClick }) => (
            <button key={label} type="button" className="user-menu-item" onClick={onClick}>
              <Icon /> <span>{label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
