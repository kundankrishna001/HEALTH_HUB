import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import PrimaryButton from './PrimaryButton';
import Badge from './Badge';
import {
  buildCombinedShoppingList,
  buildSmsLink,
  copyShoppingList,
  downloadShoppingList,
  formatCombinedShoppingListText,
  shareShoppingList
} from '../../utils/shoppingList';

export default function CombinedShoppingListExport({ dietPlans = [], title = 'Family combined shopping list' }) {
  const combined = useMemo(() => buildCombinedShoppingList(dietPlans), [dietPlans]);
  const text = useMemo(() => formatCombinedShoppingListText(combined), [combined]);

  if (!combined.allItems.length) {
    return <p className="muted">Save diet plans to build a combined family shopping list.</p>;
  }

  const handleCopy = async () => {
    try {
      await copyShoppingList(text);
      toast.success('Combined list copied');
    } catch {
      toast.error('Could not copy list');
    }
  };

  const handleShare = async () => {
    try {
      const mode = await shareShoppingList(title, text);
      toast.success(mode === 'shared' ? 'Shared to your phone' : 'Copied for sharing');
    } catch {
      toast.info('Share cancelled');
    }
  };

  const handleDownload = () => {
    downloadShoppingList('family-combined-shopping-list.txt', text);
    toast.success('Combined list downloaded');
  };

  const handleSms = () => {
    window.open(buildSmsLink(text), '_blank');
    toast.info('Opening SMS with combined list');
  };

  return (
    <div className="card card-pad" style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>{title}</strong>
        <Badge tone="primary">{combined.allItems.length} unique items</Badge>
        <Badge tone="success">{dietPlans.length} plan{dietPlans.length === 1 ? '' : 's'}</Badge>
      </div>

      {(combined.grouped || []).map((group) => (
        group.items.length ? (
          <div key={group.planId || group.planTitle}>
            <div className="muted" style={{ fontWeight: 700, marginBottom: 6 }}>{group.planTitle}</div>
            <p className="muted" style={{ margin: 0 }}>{group.items.join(', ')}</p>
          </div>
        ) : null
      ))}

      <div>
        <div className="muted" style={{ fontWeight: 700, marginBottom: 6 }}>Combined list</div>
        <p className="muted" style={{ margin: 0 }}>{combined.allItems.join(', ')}</p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <PrimaryButton variant="ghost" onClick={handleCopy}>Copy combined list</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={handleShare}>Share to phone</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={handleSms}>Send via SMS</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={handleDownload}>Download .txt</PrimaryButton>
      </div>
    </div>
  );
}
