import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// Film grain + vignette. The seed changes every 2 frames so it reads as
// real sensor noise instead of a static texture.
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.14}) => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2) % 100;

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width="100%" height="100%" style={{position: 'absolute', opacity, mixBlendMode: 'overlay'}}>
				<filter id={`grain-${seed}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
			</svg>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
