import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, stroke} from '../theme';

// "37/250" dev-log counter with a chunky progress bar.
// Counts from `from` to `to` between `start` and `start + duration`.
export const Counter: React.FC<{
	from: number;
	to: number;
	goal: number;
	start?: number;
	duration?: number;
	label?: string;
	showDelta?: boolean;
}> = ({from, to, goal, start = 0, duration = 30, label = 'PLAYERS', showDelta = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const p = interpolate(frame, [start, start + duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});
	const value = Math.round(interpolate(p, [0, 1], [from, to]));
	const prevValue = Math.round(interpolate(Math.max(0, frame - 1 - start) / duration, [0, 1], [from, to], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	}));
	// each tick of the number gives the digits a tiny kick
	const tick = value !== prevValue ? 1.06 : 1;

	const land = spring({frame: frame - start - duration, fps, config: {damping: 8, stiffness: 260}});
	// floor at 3% so a tiny count still reads as a bar, not a dot
	const pct = Math.max(0.03, Math.min(1, value / goal));
	const enter = spring({frame, fps, config: {damping: 14, stiffness: 160}});

	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, scale: enter}}>
			<div style={{display: 'flex', alignItems: 'baseline', fontFamily: fonts.mono, fontWeight: 800}}>
				<span
					style={{
						fontSize: 230,
						color: colors.yellow,
						...stroke(16),
						textShadow: `0 12px 0 ${colors.ink}`,
						scale: tick * (frame >= start + duration ? interpolate(land, [0, 1], [1.25, 1]) : 1),
						display: 'inline-block',
						minWidth: `${String(goal).length}ch`,
						textAlign: 'right',
					}}
				>
					{value}
				</span>
				<span style={{fontSize: 120, color: colors.white, ...stroke(12), marginLeft: 12}}>/{goal}</span>
			</div>

			<div
				style={{
					width: 860,
					height: 70,
					borderRadius: 18,
					backgroundColor: '#2A2A31',
					border: `8px solid ${colors.white}`,
					boxShadow: `0 10px 0 ${colors.ink}`,
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				<div
					style={{
						width: `${pct * 100}%`,
						height: '100%',
						borderRadius: 10,
						background: `repeating-linear-gradient(-45deg, ${colors.green} 0 26px, #22C35E 26px 52px)`,
						backgroundPositionX: `${frame * 3}px`,
					}}
				/>
			</div>

			<div style={{display: 'flex', gap: 28, alignItems: 'center'}}>
				<span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 46, color: colors.white, ...stroke(8), letterSpacing: '0.12em'}}>
					{label}
				</span>
				{showDelta && frame >= start + duration ? (
					<span
						style={{
							fontFamily: fonts.display,
							fontSize: 64,
							color: colors.ink,
							backgroundColor: colors.green,
							padding: '4px 22px',
							borderRadius: 14,
							border: `6px solid ${colors.ink}`,
							rotate: '-4deg',
							scale: land,
							display: 'inline-block',
						}}
					>
						+{to - from}
					</span>
				) : null}
			</div>
		</div>
	);
};
