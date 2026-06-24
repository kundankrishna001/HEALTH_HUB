import React, { useState } from 'react';
import dayjs from 'dayjs';
import { FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';

export default function Recipes() {
  const { state, generateRecipe, saveRecipe, toggleRecipeFavorite, deleteRecipe } = useApp();
  const [name, setName] = useState('');
  const [servings, setServings] = useState(4);
  const [recipe, setRecipe] = useState(null);

  const savedRecipes = state?.recipes || [];
  const favorites = savedRecipes.filter((item) => item.favorite);

  const handleGenerate = async () => {
    const res = await generateRecipe(name, servings);
    setRecipe(res);
  };

  const handleSave = async () => {
    await saveRecipe(recipe);
    toast.success('Recipe saved');
  };

  const handlePrint = () => window.print();
  const handleShare = async () => {
    await navigator.share?.({ title: recipe?.name, text: recipe?.steps.join('\n') });
  };

  return (
    <div className="page-grid">
      <PageHeader
        title="Recipes"
        subtitle="Generate healthy recipes, save favorites, print, and share."
        actions={favorites.length ? [<Badge key="fav" tone="warning">{favorites.length} favorites</Badge>] : null}
      />

      {savedRecipes.length ? (
        <SectionCard title="Your recipe library" subtitle="Saved recipes with favorites">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {savedRecipes.map((item) => (
              <div key={item.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '1.1rem', lineHeight: 1.2 }}>{item.name}</strong>
                      {item.favorite ? <FiStar className="favorite-star" style={{ flexShrink: 0 }} /> : null}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem', marginTop: 6 }}>
                      {item.calories ? `${item.calories} cal · ` : ''}
                      Saved {dayjs(item.createdAt).format('MMM D')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <PrimaryButton variant="ghost" onClick={() => setRecipe(item)} style={{ padding: '8px 4px', fontSize: '0.85rem' }}>View</PrimaryButton>
                  <PrimaryButton variant="ghost" onClick={async () => {
                    await toggleRecipeFavorite(item.id);
                    toast.success(item.favorite ? 'Removed from favorites' : 'Added to favorites');
                  }} style={{ padding: '8px 4px', fontSize: '0.85rem' }}>
                    {item.favorite ? 'Unfav' : 'Fav'}
                  </PrimaryButton>
                  <PrimaryButton variant="ghost" onClick={async () => {
                    await deleteRecipe(item.id);
                    if (recipe?.id === item.id) setRecipe(null);
                    toast.success('Recipe deleted');
                  }} style={{ padding: '8px 4px', fontSize: '0.85rem', color: 'var(--danger)' }}>
                    Delete
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Recipe generator">
        <div className="grid-2">
          <TextField label="Recipe keyword" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Servings" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <PrimaryButton onClick={handleGenerate}>Generate</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={handlePrint}>Print recipe</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={handleShare}>Share</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={handleSave} disabled={!recipe}>Save</PrimaryButton>
        </div>
      </SectionCard>

      {recipe ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <SectionCard title={recipe.name} subtitle={`Prep time: ${recipe.prepTime} · Difficulty: ${recipe.difficulty}`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              <Badge tone="primary">Calories: {recipe.calories}</Badge>
              <Badge tone="success">Storage: {recipe.storage}</Badge>
              <Badge tone="warning">Reheating: {recipe.reheating}</Badge>
            </div>
            <div style={{ background: 'color-mix(in srgb, var(--surface-strong) 50%, transparent)', padding: 16, borderRadius: 16 }}>
              <strong style={{ display: 'block', marginBottom: 10, color: 'var(--primary)' }}>Ingredients</strong>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: '0.95rem' }}>
                {recipe.ingredients.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </SectionCard>
          <SectionCard title="Instructions">
            <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 12, fontSize: '0.95rem' }}>
              {recipe.steps.map((item) => <li key={item} style={{ lineHeight: 1.5 }}>{item}</li>)}
            </ol>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
