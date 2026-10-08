import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, stroke} from '../theme';

export type KineticMode = 'pop' | 'slam' | 'rise' | 'type';

type Token = {word: string; highlight: boolean};

// "*word*" or "*several words*" marks highlighted text, the same convention for every script.
const tokenize = (text: string): Token[] => {
	let inside = false;
	return text
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => {
			const opens = w.startsWith('*');
			const closes = /\*[!?.,]*$/.test(w);
			const highlight = inside || opens;
			if (opens) inside = true;
			if (closes) inside = false;
			return {word: w.replace(/\*/g, ''), highlight};
		});
};

export const Kinetic: React.FC<{
	text: string;
	mode?: KineticMode;
	/** frame inside the parent sequence where the line starts */
	start?: number;
	/** frames between words */
	stagger?: number;
	fontSize?: number;
	color?: string;
	highlight?: string;
	font?: 'display' | 'impact' | 'mono' | 'rounded';
	strokeWidth?: number;
	maxWidth?: number;
	align?: 'center' | 'left';
}> = ({
	text,
	mode = 'pop',
	start = 0,
	stagger = 3,
	fontSize = 110,
	color = colors.white,
	highlight = colors.yellow,
	font = 'display',
	strokeWidth = 14,
	maxWidth = 900,
	align = 'center',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tokens = tokenize(text);

	if (mode === 'type') {
		const full = tokens.map((t) => t.word).join(' ');
		const chars = Math.floor(Math.max(0, frame - start) / 1.4);
		let used = 0;
		return (
			<div style={{...wrap(maxWidth, align), fontFamily: fonts[font], fontSize, color, lineHeight: 1.05, ...stroke(strokeWidth)}}>
				{tokens.map((t, i) => {
					const visible = t.word.slice(0, Math.max(0, chars - used));
					used += t.word.length + 1;
					return (
						<span key={i} style={{color: t.highlight ? highlight : color, marginRight: '0.25em'}}>
							{visible}
						</span>
					);
				})}
				{chars <= full.length && Math.floor(frame / 8) % 2 === 0 ? <span style={{color: highlight}}>▌</span> : null}
			</div>
		);
	}

	return (
		<div style={{...wrap(maxWidth, align), fontFamily: fonts[font], fontSize, lineHeight: 1.02}}>
			{tokens.map((t, i) => {
				const f = frame - start - i * stagger;
				const tilt = (random(`tilt-${text}-${i}`) - 0.5) * 6;

				let style: React.CSSProperties = {};
				if (mode === 'pop') {
					const s = spring({frame: f, fps, config: {damping: 9, stiffness: 220, mass: 0.6}});
					style = {
						scale: s,
						rotate: `${interpolate(s, [0, 1], [tilt * 3, tilt * (t.highlight ? 1 : 0.3)])}deg`,
						opacity: f >= 0 ? 1 : 0,
					};
				} else if (mode === 'slam') {
					const p = interpolate(f, [0, 5], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.2, 0, 0, 1),
					});
					style = {
						scale: interpolate(p, [0, 1], [3.2, 1]),
						opacity: f >= 0 ? interpolate(p, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}) : 0,
						filter: `blur(${interpolate(p, [0, 1], [18, 0])}px)`,
					};
				} else {
					const p = interpolate(f, [0, 9], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					});
					style = {
						translate: `0px ${interpolate(p, [0, 1], [fontSize * 0.9, 0])}px`,
						opacity: p,
					};
				}

				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							overflow: mode === 'rise' ? 'hidden' : undefined,
							marginRight: '0.22em',
							paddingBottom: mode === 'rise' ? '0.08em' : undefined,
						}}
					>
						<span
							style={{
								display: 'inline-block',
								color: t.highlight ? highlight : color,
								...stroke(strokeWidth),
								...(t.highlight
									? {textShadow: `0 ${strokeWidth * 0.6}px 0 ${colors.ink}`}
									: {textShadow: `0 ${strokeWidth * 0.45}px 0 ${colors.ink}`}),
								...style,
							}}
						>
							{t.word}
						</span>
					</span>
				);
			})}
		</div>
	);
};

const wrap = (maxWidth: number, align: 'center' | 'left'): React.CSSProperties => ({
	maxWidth,
	textAlign: align,
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: align === 'center' ? 'center' : 'flex-start',
	textTransform: 'uppercase',
	letterSpacing: '0.01em',
});
