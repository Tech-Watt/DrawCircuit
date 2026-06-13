const COUNT = 43;

export const trainingImages = Array.from({ length: COUNT }, (_, i) => {
  const num = i + 1;
  const file = `training-${String(num).padStart(2, '0')}.jpeg`;
  return {
    id: num,
    src: `/training-images/${file}`,
    alt: `TechWatt hands-on training session ${num}`,
  };
});

/** Shown on the homepage preview */
export const featuredTrainingImages = [1, 8, 15, 22, 29, 36].map(
  (id) => trainingImages[id - 1]
);
