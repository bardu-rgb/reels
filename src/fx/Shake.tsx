import React from 'react';
import {noise2D} from '@remotion/noise';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Camera shake driven by noise that decays after each hit frame.
// `hits` are frame numbers (relative to the parent sequence) where an impact lands.
export const Shake: React.FC<{
	hits: number[];
	intensity?: number;
	decay?: number;
	children: React.ReactNode;
}> = ({hits, intensity = 28, decay = 10, children}) => {
	const frame = useCurrentFrame();

	const amount = hits.reduce((acc, hit) => {
		return Math.max(
			acc,
			interpolate(frame, [hit, hit + decay], [1, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}) * (frame >= hit ? 1 : 0),
		);
	}, 0);

	const x = noise2D('shake-x', frame * 0.6, 0) * intensity * amount;
	const y = noise2D('shake-y', 0, frame * 0.6) * intensity * amount;
	const r = noise2D('shake-r', frame * 0.4, frame * 0.4) * 2.2 * amount;

	return (
		<AbsoluteFill
			style={{
				translate: `${x}px ${y}px`,
				rotate: `${r}deg`,
				scale: 1 + amount * 0.04,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
