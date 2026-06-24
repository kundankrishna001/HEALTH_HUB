import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  deleteDietPlan as removeDietPlan,
  deleteRecipe as removeRecipe,
  getState,
  logMeal,
  logWater,
  saveDietPlan as persistDietPlan,
  saveFamilyMember as persistFamilyMember,
  saveMetric,
  saveProfile,
  saveRecipe as persistRecipe,
  saveSymptom,
  setActiveProfile as switchActiveProfile,
  setGoals as persistGoals,
  setProfileWaterGoal as persistProfileWaterGoal,
  deleteFamilyMember as removeFamilyMember,
  toggleRecipeFavorite as flipRecipeFavorite,
  updateState
} from '../services/stateService';
import { generateRecipe, generateWeeklyPlan, checkFood, detectSymptoms, scanFoodFromText } from '../services/aiEngine';
import { exportTextToPdf } from '../services/exportPdf';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getState().then((next) => {
      if (mounted) {
        setState(next);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setState(null);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    setState(await getState());
  };

  const api = useMemo(
    () => ({
      state,
      loading,
      refresh,
      updateProfile: async (profile) => {
        const next = await saveProfile(profile);
        setState(next);
        return next;
      },
      logMeal: async (meal) => {
        const next = await logMeal(meal);
        setState(next);
        return next;
      },
      logWater: async (amountMl) => {
        const next = await logWater(amountMl);
        setState(next);
        return next;
      },
      logSymptom: async (entry) => {
        const next = await saveSymptom(entry);
        setState(next);
        return next;
      },
      addMetric: async (metric) => {
        const next = await saveMetric(metric);
        setState(next);
        return next;
      },
      saveRecipe: async (recipe) => {
        const next = await persistRecipe(recipe);
        setState(next);
        return next;
      },
      saveDietPlan: async (plan) => {
        const next = await persistDietPlan(plan);
        setState(next);
        return next;
      },
      deleteDietPlan: async (planId) => {
        const next = await removeDietPlan(planId);
        setState(next);
        return next;
      },
      toggleRecipeFavorite: async (recipeId) => {
        const next = await flipRecipeFavorite(recipeId);
        setState(next);
        return next;
      },
      deleteRecipe: async (recipeId) => {
        const next = await removeRecipe(recipeId);
        setState(next);
        return next;
      },
      addFamilyMember: async (member) => {
        const next = await persistFamilyMember(member);
        setState(next);
        return next;
      },
      deleteFamilyMember: async (memberId) => {
        const next = await removeFamilyMember(memberId);
        setState(next);
        return next;
      },
      setActiveProfile: async (profileId) => {
        const next = await switchActiveProfile(profileId);
        setState(next);
        return next;
      },
      setGoals: async (goals) => {
        const next = await persistGoals(goals);
        setState(next);
        return next;
      },
      setProfileWaterGoal: async (profileId, amountMl) => {
        const next = await persistProfileWaterGoal(profileId, amountMl);
        setState(next);
        return next;
      },
      setSettings: async (settings) => {
        const next = await updateState((current) => ({
          ...current,
          settings: { ...current.settings, ...settings }
        }));
        setState(next);
        return next;
      },
      generateWeeklyPlan: async (query = '') => await generateWeeklyPlan(query, state?.user || {}),
      generateRecipe: async (name, servings) => await generateRecipe(name, servings, state?.user || {}),
      detectSymptoms: async (text) => await detectSymptoms(text, state?.user || {}),
      checkFood: async (food, meds) => await checkFood(food, state?.user || {}, meds || []),
      scanFoodFromText: async (text) => await scanFoodFromText(text, state?.user || {}),
      exportPdf: (title, lines) => exportTextToPdf(title, lines)
    }),
    [state, loading]
  );

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
