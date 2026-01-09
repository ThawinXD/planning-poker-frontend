export default function playerPosition(
  index: number,
  total: number,
  radius: number,
  line: number,
  gap: number,
  perimeter: number,
) {
  let step = ((index + 1) * (perimeter / total) + (line / 2)) % perimeter;

  if (step <= line) {
    // Top side
    const x = -line / 2 + step;
    const y = -radius;
    return {
      px: x,
      py: y - gap,
      cx: x,
      cy: y + gap,
    }
  }
  step -= line;

  if (step < Math.PI * radius) {
    // Right curve
    const angle = -Math.PI / 2 + step / radius;
    const x = line / 2 + radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      px: x + Math.cos(angle) * gap,
      py: y + Math.sin(angle) * gap,
      cx: x - Math.cos(angle) * gap,
      cy: y - Math.sin(angle) * gap,
    }
  }
  step -= Math.PI * radius;

  if (step <= line) {
    // Bottom side
    const x = line / 2 - step;
    const y = radius;
    return {
      px: x,
      py: y + gap,
      cx: x,
      cy: y - gap,
    }
  }
  step -= line;

  // Left curve
  const angle = Math.PI / 2 + step / radius;
  const x = -line / 2 + radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return {
    px: x + Math.cos(angle) * gap,
    py: y + Math.sin(angle) * gap,
    cx: x - Math.cos(angle) * gap,
    cy: y - Math.sin(angle) * gap,
  }
}