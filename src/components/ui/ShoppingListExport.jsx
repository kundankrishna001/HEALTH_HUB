import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import PrimaryButton from './PrimaryButton';
import {
  buildShoppingList,
  buildSmsLink,
  copyShoppingList,
  downloadShoppingList,
  formatShoppingListText,
  shareShoppingList
} from '../../utils/shoppingList';

export default function ShoppingListExport({ planDays = [], planTitle = 'Weekly plan' }) {
  const items = useMemo(() => buildShoppingList(planDays), [planDays]);
  const text = useMemo(() => formatShoppingListText(planTitle, items), [planTitle, items]);

  if (!items.length) return null;

  const handleCopy = async () => {
    try {
      await copyShoppingList(text);
      toast.success('Shopping list copied');
    } catch {
      toast.error('Could not copy list');
    }
  };

  const handleShare = async () => {
    try {
      const mode = await shareShoppingList(`${planTitle} shopping list`, text);
      toast.success(mode === 'shared' ? 'Shared to your phone' : 'Copied for sharing');
    } catch {
      toast.info('Share cancelled');
    }
  };

  const handleDownload = () => {
    downloadShoppingList(`${planTitle.toLowerCase().replace(/\s+/g, '-')}-shopping-list.txt`, text);
    toast.success('Shopping list downloaded');
  };

  const handleSms = () => {
    window.open(buildSmsLink(text), '_blank');
    toast.info('Opening SMS with your shopping list');
  };

  return (
    <div className="card card-pad" style={{ display: 'grid', gap: 12 }}>
      <div>
        <strong>Shopping list</strong>
        <p className="muted" style={{ margin: '8px 0 0' }}>{items.join(', ')}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <PrimaryButton variant="ghost" onClick={handleCopy}>Copy list</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={handleShare}>Share to phone</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={handleSms}>Send via SMS</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={handleDownload}>Download .txt</PrimaryButton>
      </div>
    </div>
  );
}
