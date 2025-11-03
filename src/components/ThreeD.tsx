// ThreeD.tsx
export default function ThreeD({ playerName }: { playerName?: string }) {
  return <div>3D visualization for {playerName || "selected player"}.</div>;
}
