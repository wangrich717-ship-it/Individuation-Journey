/**
 * 纯色意象图标 - 用简单几何形状表示，非 emoji
 */
import type { ReactNode } from 'react';
import type { ImagerySymbol } from '@/lib/imageryData';

interface ImageryIconProps {
  symbol: ImagerySymbol;
  size?: number;
}

export default function ImageryIcon({ symbol, size = 36 }: ImageryIconProps) {
  const color = symbol.color;
  const s = size;
  const half = s / 2;

  const shapes: Record<string, ReactNode> = {
    serpent: (
      <path d={`M ${half*0.2} ${half} Q ${half*0.5} ${half*0.3} ${half} ${half} Q ${half*1.5} ${half*1.4} ${s*0.8} ${half}`} fill="none" stroke={color} strokeWidth={s*0.12} strokeLinecap="round" />
    ),
    tree: (
      <g>
        <polygon points={`${half},${half*0.2} ${half*0.3},${s*0.85} ${half*1.7},${s*0.85}`} fill={color} />
        <rect x={half*0.7} y={s*0.75} width={half*0.6} height={s*0.2} fill={color} />
      </g>
    ),
    sun: (
      <g>
        <circle cx={half} cy={half} r={half * 0.22} fill={color} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const r1 = half * 0.32;
          const r2 = half * 0.5;
          return (
            <line
              key={i}
              x1={half + Math.cos(a) * r1}
              y1={half + Math.sin(a) * r1}
              x2={half + Math.cos(a) * r2}
              y2={half + Math.sin(a) * r2}
              stroke={color}
              strokeWidth={Math.max(2, s * 0.08)}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    ),
    moon: (
      <path d={`M ${half} ${half*0.2} A ${half*0.8} ${half*0.8} 0 1 1 ${half*0.4} ${half} A ${half*0.5} ${half*0.5} 0 0 0 ${half} ${half*0.2} Z`} fill={color} />
    ),
    fire: (
      <polygon points={`${half},${half*0.15} ${s*0.9},${s*0.7} ${half*0.6},${s*0.6} ${half},${s*0.95} ${half*0.4},${s*0.6} ${half*0.1},${s*0.7}`} fill={color} />
    ),
    cross: (
      <g>
        <rect x={half*0.35} y={half*0.1} width={half*0.3} height={s*0.8} fill={color} />
        <rect x={half*0.1} y={half*0.35} width={s*0.8} height={half*0.3} fill={color} />
      </g>
    ),
    bird: (
      <path d={`M ${half*0.2} ${half} L ${half} ${half*0.4} L ${s*0.8} ${half} L ${half} ${half*0.7} Z`} fill={color} />
    ),
    lion: (
      <g>
        <circle cx={half} cy={half * 0.58} r={half * 0.36} fill={color} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = (i / 6) * Math.PI * 0.7 - Math.PI * 0.35;
          const r1 = half * 0.36;
          const r2 = half * 0.52;
          const cx = half + Math.cos(a) * r1;
          const cy = half * 0.58 + Math.sin(a) * r1;
          const ex = half + Math.cos(a) * r2;
          const ey = half * 0.58 + Math.sin(a) * r2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke={color}
              strokeWidth={Math.max(2, s * 0.1)}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    ),
    mountain: (
      <polygon points={`${half},${half*0.1} ${half*0.15},${s*0.9} ${half*0.5},${s*0.5} ${half},${s*0.9} ${half*1.5},${s*0.5} ${s*0.85},${s*0.9}`} fill={color} />
    ),
    water: (
      <path d={`M ${half} ${half*0.15} C ${half*0.2} ${half*0.5} ${half*0.2} ${s*0.7} ${half} ${s*0.9} C ${half*1.8} ${s*0.7} ${half*1.8} ${half*0.5} ${half} ${half*0.15} Z`} fill={color} />
    ),
    flower: (
      <g>
        <circle cx={half} cy={half} r={half*0.25} fill={color} />
        {[0, 1, 2, 3, 4].map(i => {
          const a = (i / 5) * Math.PI * 2;
          const cx = half + Math.cos(a) * half * 0.5;
          const cy = half + Math.sin(a) * half * 0.5;
          return <circle key={i} cx={cx} cy={cy} r={half*0.2} fill={color} />;
        })}
      </g>
    ),
    star: (
      <polygon
        points={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          .map(i => {
            const r = i % 2 === 0 ? half : half * 0.4;
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return `${half + Math.cos(a) * r},${half + Math.sin(a) * r}`;
          })
          .join(' ')}
        fill={color}
      />
    ),
  };

  const shape = shapes[symbol.id] ?? <circle cx={half} cy={half} r={half*0.5} fill={color} />;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block', margin: 'auto' }}>
      {shape}
    </svg>
  );
}
