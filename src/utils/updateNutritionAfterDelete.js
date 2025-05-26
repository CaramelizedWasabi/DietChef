export const calculateNutritionFromFoods = (foods) => {
  let totalCarbs = 0, totalFat = 0, totalProtein = 0;

  for (const food of foods) {
    totalCarbs += food.carbs || 0;
    totalFat += food.fat || 0;
    totalProtein += food.protein || 0;
  }

  const calories = totalCarbs * 4 + totalFat * 9 + totalProtein * 4;

  return {
    carbs: Math.round(totalCarbs),
    fat: Math.round(totalFat),
    protein: Math.round(totalProtein),
    calories: Math.round(calories),
  };
};
