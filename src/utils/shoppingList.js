export function buildShoppingList(planDays = []) {
  const items = planDays.flatMap((day) => day.shopping || []);
  return Array.from(new Set(items.filter(Boolean)));
}

export function buildCombinedShoppingList(dietPlans = []) {
  const grouped = dietPlans.map((plan) => ({
    planId: plan.id,
    planTitle: plan.title || 'Diet plan',
    items: buildShoppingList(plan.days || [])
  }));

  const allItems = Array.from(new Set(dietPlans.flatMap((plan) => buildShoppingList(plan.days || []))));

  return { grouped, allItems };
}

export function formatCombinedShoppingListText(combined = {}) {
  const lines = ['Family combined shopping list', ''];

  for (const group of combined.grouped || []) {
    if (!group.items.length) continue;
    lines.push(`From: ${group.planTitle}`);
    group.items.forEach((item) => lines.push(`  - ${item}`));
    lines.push('');
  }

  lines.push('Combined (deduplicated):');
  (combined.allItems || []).forEach((item, index) => lines.push(`${index + 1}. ${item}`));

  return lines.join('\n');
}

export function formatShoppingListText(planTitle, items = []) {
  const lines = [
    `Shopping list: ${planTitle || 'Weekly plan'}`,
    '',
    ...items.map((item, index) => `${index + 1}. ${item}`)
  ];
  return lines.join('\n');
}

export async function copyShoppingList(text) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard not supported');
  }
  await navigator.clipboard.writeText(text);
}

export async function shareShoppingList(title, text) {
  if (navigator.share) {
    await navigator.share({ title, text });
    return 'shared';
  }
  await copyShoppingList(text);
  return 'copied';
}

export function downloadShoppingList(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildSmsLink(text) {
  const body = encodeURIComponent(text.slice(0, 900));
  return `sms:?body=${body}`;
}
