import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { recipesData } from "./recipeData";

const shapeRecipe = (recipe: typeof recipesData[number]) => ({
  ...recipe,
  locked: recipe.isPremium,
});

export const recipesRouter = router({
  getRecipes: publicProcedure
    .input(
      z.object({
        ageMonths: z.number().optional(),
      })
    )
    .query(({ input }) => {
      const filtered = input.ageMonths
        ? recipesData.filter(recipe => recipe.minAgeMonths <= input.ageMonths && recipe.maxAgeMonths >= input.ageMonths)
        : recipesData;

      return filtered.map(shapeRecipe);
    }),

  list: publicProcedure.query(() => {
    return recipesData.map(shapeRecipe);
  }),

  getRecipe: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(({ input }) => {
      const recipe = recipesData.find(item => item.slug === input.slug);
      return recipe ? shapeRecipe(recipe) : null;
    }),
});
