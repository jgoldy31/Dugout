// src/utils/EllipseHelpers.ts
export function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function covarianceMatrix(xs: number[], ys: number[]): number[][] {
  const mx = mean(xs);
  const my = mean(ys);
  const covXX = mean(xs.map((x) => (x - mx) * (x - mx)));
  const covYY = mean(ys.map((y) => (y - my) * (y - my)));
  const covXY = mean(xs.map((x, i) => (x - mx) * (ys[i] - my)));
  return [
    [covXX, covXY],
    [covXY, covYY],
  ];
}

export function eigenDecomposition2x2(m: number[][]) {
  const a = m[0][0],
    b = m[0][1],
    c = m[1][1];
  const trace = a + c;
  const det = a * c - b * b;
  const term = Math.sqrt(Math.max(0, trace * trace - 4 * det));
  const lambda1 = (trace + term) / 2;
  const lambda2 = (trace - term) / 2;

  // Eigenvectors (for symmetric matrix)
  const v1 = b !== 0 ? [lambda1 - c, b] : [1, 0];
  const v2 = b !== 0 ? [lambda2 - c, b] : [0, 1];
  const norm1 = Math.hypot(v1[0], v1[1]);
  const norm2 = Math.hypot(v2[0], v2[1]);

  return {
    values: [lambda1, lambda2],
    // vectors as columns: vectors[0] = [v1x, v2x], vectors[1] = [v1y, v2y]
    vectors: [
      [v1[0] / norm1, v2[0] / norm2],
      [v1[1] / norm1, v2[1] / norm2],
    ],
  };
}

/**
 * Build ellipse boundary points in data coordinates.
 * - center: {x,y}
 * - eig: { values: [λ1, λ2], vectors: [[v1x, v2x],[v1y, v2y]] }
 * - p: probability for confidence region (0 < p < 1) e.g. 0.70
 * - nPoints: number of sampled points around ellipse
 *
 * returns array of {x,y} in data coordinates
 */
export function ellipseBoundaryPoints(
  center: { x: number; y: number },
  eig: { values: number[]; vectors: number[][] },
  p = 0.5,
  nPoints = 256
): { x: number; y: number }[] {
  // For 2D, the chi-square quantile for probability p is:
  //   q = χ²_{df=2}(p). For df=2, inverse-cdf = -2 * ln(1 - p)
  // So radius scaling factor = sqrt(q)
  const q = -2 * Math.log(1 - p); // valid for df=2
  const scale = Math.sqrt(q);

  // axes radii in data units:
  const r1 = Math.sqrt(Math.max(0, eig.values[0])) * scale;
  const r2 = Math.sqrt(Math.max(0, eig.values[1])) * scale;

  const v1 = [eig.vectors[0][0], eig.vectors[1][0]]; // principal axis 1
  const v2 = [eig.vectors[0][1], eig.vectors[1][1]]; // principal axis 2

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < nPoints; i++) {
    const theta = (Math.PI * 2 * i) / nPoints;
    // parametric ellipse in principal-axis coordinates:
    const px = r1 * Math.cos(theta);
    const py = r2 * Math.sin(theta);
    // map back to original coordinates: center + px*v1 + py*v2
    const x = center.x + px * v1[0] + py * v2[0];
    const y = center.y + px * v1[1] + py * v2[1];
    pts.push({ x, y });
  }
  return pts;
}
