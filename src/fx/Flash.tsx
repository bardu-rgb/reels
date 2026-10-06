import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// One-frame white pop that fades fast. Sells a hard cut.
export const Flash: React.FC<{at: number; color?: string; length?: number}> = ({
	at,
	color = '#fff',
	length = 6,
}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [at, at + 1, at + length], [0, 0.85, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	if (opacity <= 0) return null;
	return <AbsoluteFill style={{backgroundColor: color, opacity, pointerEvents: 'none'}} />;
};
