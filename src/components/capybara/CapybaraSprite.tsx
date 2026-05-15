interface CapybaraSpriteProps {
  color: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const COLOR_HEX: Record<string, string> = {
  brown: '#92400e',
  tan: '#fbbf24',
  gray: '#64748b',
  black: '#1c1917',
  white: '#e7e5e4',
  rust: '#c2410c',
}

const SIZES = { sm: 80, md: 128, lg: 192 }

export default function CapybaraSprite({ color, size = 'md', animated = false }: CapybaraSpriteProps) {
  const px = SIZES[size]
  const c = COLOR_HEX[color] ?? COLOR_HEX.brown

  return (
    <div
      style={{ width: px, height: px }}
      className={animated ? 'animate-bounce' : ''}
      role="img"
      aria-label={`${color} capybara`}
    >
      <svg viewBox="0 0 16 16" width={px} height={px} style={{ imageRendering: 'pixelated' }}>
        {/* Body */}
        <rect x="3" y="7" width="10" height="7" fill={c} />
        {/* Head */}
        <rect x="4" y="3" width="8" height="6" fill={c} />
        {/* Snout */}
        <rect x="4" y="8" width="8" height="2" fill={c} />
        {/* Eyes */}
        <rect x="5" y="4" width="2" height="2" fill="#1c1917" />
        <rect x="9" y="4" width="2" height="2" fill="#1c1917" />
        {/* Nostrils */}
        <rect x="6" y="8" width="1" height="1" fill="#78350f" />
        <rect x="9" y="8" width="1" height="1" fill="#78350f" />
        {/* Ears */}
        <rect x="4" y="2" width="2" height="2" fill={c} />
        <rect x="10" y="2" width="2" height="2" fill={c} />
        {/* Legs */}
        <rect x="3" y="12" width="2" height="2" fill={c} />
        <rect x="6" y="12" width="2" height="2" fill={c} />
        <rect x="8" y="12" width="2" height="2" fill={c} />
        <rect x="11" y="12" width="2" height="2" fill={c} />
      </svg>
    </div>
  )
}
