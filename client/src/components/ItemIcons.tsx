/**
 * 纯色道具图标（遗失的罗盘、纹章印记等），替代 emoji
 */
import type { SVGProps } from 'react';

const defaultColor = '#C4A35A';

/** 罗盘：纯色简笔 */
export function IconCompass({ className, color = defaultColor, ...rest }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2l3 3 2 4-5 2-4-2 2-4 3-3z" />
      <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
    </svg>
  );
}

/** 纹章/水晶球：纯色圆与内圆 */
export function IconEmblem({ className, color = defaultColor, ...rest }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" fill={color} fillOpacity="0.3" stroke={color} />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}
