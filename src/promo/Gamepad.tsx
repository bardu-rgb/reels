import React from 'react';
import {noise2D} from '@remotion/noise';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

// Flat vector controller. Face buttons use the four BUZZ! pad colors
// (yellow top, red right, green bottom, blue left), like the game.
// `presses` maps a button to the frames where it gets hit.
export type PadButton = 'y' | 'b' | 'a' | 'x';

const BTN: Record<PadButton, {cx: number; cy: number; color: string; dark: string}> = {
	y: {cx: 610, cy: 150, color: colors.yellow, dark: '#A88A00'},
	b: {cx: 680, cy: 220, color: colors.red, dark: '#9E1F18'},
	a: {cx: 610, cy: 290, color: colors.green, dark: '#168540'},
	x: {cx: 540, cy: 220, color: colors.blue, dark: '#1A47A0'},
};

export const Gamepad: React.FC<{
	width?: number;
	presses?: Partial<Record<PadButton, number[]>>;
	sticks?: boolean;
}> = ({width = 820, presses = {}, sticks = true}) => {
	const frame = useCurrentFrame();

	const pressAmount = (b: PadButton) =>
		(presses[b] ?? []).reduce(
			(acc, at) =>
				Math.max(
					acc,
					interpolate(frame, [at, at + 1, at + 9], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				),
			0,
		);

	const lx = sticks ? noise2D('lx', frame * 0.05, 0) * 16 : 0;
	const ly = sticks ? noise2D('ly', 0, frame * 0.05) * 16 : 0;
	const rx = sticks ? noise2D('rx', frame * 0.04, 3) * 16 : 0;
	const ry = sticks ? noise2D('ry', 3, frame * 0.04) * 16 : 0;

	return (
		<svg width={width} viewBox="0 0 820 470" style={{overflow: 'visible'}}>
			{/* hard drop shadow, same "sticker" language as the text */}
			<path d={BODY} fill={colors.ink} transform="translate(0 22)" />
			<path d={BODY} fill={colors.paper} stroke={colors.ink} strokeWidth={14} strokeLinejoin="round" />
			<path d="M300 120 h220" stroke="#D8D3C8" strokeWidth={18} strokeLinecap="round" />

			{/* d-pad */}
			<g transform="translate(210 220)">
				<rect x={-26} y={-78} width={52} height={156} rx={10} fill={colors.ink} />
				<rect x={-78} y={-26} width={156} height={52} rx={10} fill={colors.ink} />
			</g>

			{/* sticks */}
			{[
				{cx: 320, cy: 330, dx: lx, dy: ly},
				{cx: 500, cy: 330, dx: rx, dy: ry},
			].map((s, i) => (
				<g key={i}>
					<circle cx={s.cx} cy={s.cy} r={52} fill="#D8D3C8" stroke={colors.ink} strokeWidth={10} />
					<circle cx={s.cx + s.dx} cy={s.cy + s.dy} r={34} fill={colors.ink} />
				</g>
			))}

			{/* face buttons */}
			{(Object.keys(BTN) as PadButton[]).map((b) => {
				const {cx, cy, color, dark} = BTN[b];
				const p = pressAmount(b);
				return (
					<g key={b}>
						{p > 0 ? <circle cx={cx} cy={cy} r={40 + p * 46} fill="none" stroke={color} strokeWidth={10 * p} opacity={p} /> : null}
						<circle cx={cx} cy={cy + 8} r={38} fill={dark} />
						<circle cx={cx} cy={cy + p * 7} r={38} fill={color} stroke={colors.ink} strokeWidth={8} />
					</g>
				);
			})}
		</svg>
	);
};

const BODY =
	'M170 70 C 250 40, 570 40, 650 70 C 750 105, 800 250, 805 360 C 810 440, 740 470, 690 430 C 640 390, 600 360, 560 360 L 260 360 C 220 360, 180 390, 130 430 C 80 470, 10 440, 15 360 C 20 250, 70 105, 170 70 Z';
