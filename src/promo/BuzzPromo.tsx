import React from 'react';
import {Audio} from '@remotion/media';
import {
	AbsoluteFill,
	Easing,
	Sequence,
	Series,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Kinetic} from '../kinetic/Kinetic';
import {Grain} from '../fx/Grain';
import {Shake} from '../fx/Shake';
import {Flash} from '../fx/Flash';
import {Gamepad} from './Gamepad';
import {colors, fonts, stroke} from '../theme';

// Motion-graphics promo, cut on a 120 BPM grid: one beat = 15 frames @30fps.
// Every scene length is a whole number of beats so cuts land on the kick.
const BEAT = 15;
const HOOK = BEAT * 5;
const STATS = BEAT * 8;
const BUZZ = BEAT * 12;
const VOTE = BEAT * 10;
const CTA = BEAT * 8;
export const BUZZ_PROMO_DURATION = HOOK + STATS + BUZZ + VOTE + CTA;

const sfx = (name: string) => staticFile(`sfx/${name}.wav`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.5}) => (
	<Sequence from={at} layout="none">
		<Audio src={sfx(name)} volume={volume} />
	</Sequence>
);

// Dot grid like the game's background, drifting so no frame is ever static.
const Stage: React.FC<{tint?: string}> = ({tint = colors.ink}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: tint}}>
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(${colors.white}22 3px, transparent 3px)`,
					backgroundSize: '54px 54px',
					backgroundPosition: `${frame * 0.8}px ${frame * 1.6}px`,
				}}
			/>
		</AbsoluteFill>
	);
};

const Label: React.FC<{children: React.ReactNode; color?: string; top?: number; delay?: number}> = ({
	children,
	color = colors.yellow,
	top = 230,
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame - delay, [0, 8], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 0,
				right: 0,
				textAlign: 'center',
				fontFamily: fonts.mono,
				fontWeight: 800,
				fontSize: 42,
				letterSpacing: '0.2em',
				color,
				...stroke(7),
				opacity: p,
				translate: `0px ${(1 - p) * 30}px`,
			}}
		>
			{children}
		</div>
	);
};

// ── 1. HOOK ──────────────────────────────────────────────────────────────
const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const padIn = spring({frame, fps, config: {damping: 11, stiffness: 170}});
	const second = frame >= 40;

	return (
		<AbsoluteFill>
			<Stage />
			<Shake hits={[0, 40]} intensity={24}>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 200}}>
					<div style={{height: 520, display: 'flex', alignItems: 'flex-end'}}>
						{second ? (
							<Kinetic text="ȘI *JOCUL.*" mode="slam" fontSize={230} font="impact" stagger={4} />
						) : (
							<Kinetic text="CLAUDE A FĂCUT *TOT VIDEO-UL ĂSTA*" mode="pop" fontSize={132} font="rounded" stagger={3} />
						)}
					</div>
					<div
						style={{
							marginTop: 40,
							scale: padIn,
							rotate: `${interpolate(padIn, [0, 1], [-25, -4])}deg`,
						}}
					>
						<Gamepad presses={{y: [10], b: [18], a: [26], x: [34]}} />
					</div>
				</AbsoluteFill>
			</Shake>
			<Label top={1500} color={colors.white} delay={14}>
				0 FRAME-URI ÎN AFTER EFFECTS
			</Label>
			<Flash at={0} />
			<Flash at={40} length={4} />
			<Audio src={sfx('vine-boom')} volume={0.5} />
			{[10, 18, 26, 34].map((f) => (
				<Sfx key={f} at={f} name="mouse-click" volume={0.6} />
			))}
			<Sfx at={40} name="whip" />
		</AbsoluteFill>
	);
};

// ── 2. STATS ─────────────────────────────────────────────────────────────
const STAT_CARDS = [
	{value: 1838, label: 'LINII DE COD', color: colors.yellow},
	{value: 9, label: 'PROVOCĂRI', color: colors.red},
	{value: 6, label: 'TWIST-URI', color: colors.green},
	{value: 12, label: 'BADGE-URI', color: colors.blue},
];

const StatCard: React.FC<{value: number; label: string; color: string; delay: number}> = ({value, label, color, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const f = frame - delay;
	const enter = spring({frame: f, fps, config: {damping: 12, stiffness: 200}});
	const p = interpolate(f, [4, 26], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});
	const n = Math.round(value * p);
	const land = spring({frame: f - 26, fps, config: {damping: 8, stiffness: 260}});

	return (
		<div
			style={{
				width: 440,
				height: 360,
				backgroundColor: colors.paper,
				border: `10px solid ${colors.ink}`,
				borderRadius: 34,
				boxShadow: `0 16px 0 ${colors.ink}`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 14,
				scale: enter,
				opacity: f >= 0 ? 1 : 0,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 26, backgroundColor: color}} />
			<div
				style={{
					fontFamily: fonts.mono,
					fontWeight: 800,
					fontSize: value > 999 ? 118 : 150,
					color: colors.ink,
					scale: f >= 26 ? interpolate(land, [0, 1], [1.2, 1]) : 1,
				}}
			>
				{n.toLocaleString('ro-RO')}
			</div>
			<div style={{fontFamily: fonts.impact, fontSize: 52, color: colors.ink, letterSpacing: '0.04em'}}>{label}</div>
		</div>
	);
};

const Stats: React.FC = () => (
	<AbsoluteFill>
		<Stage />
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 200, gap: 70}}>
			<Kinetic text="BUZZ HOUSE: *SEZONUL TĂU*" mode="rise" fontSize={112} font="rounded" stagger={2} />
			<div style={{display: 'grid', gridTemplateColumns: '440px 440px', gap: 50}}>
				{STAT_CARDS.map((c, i) => (
					<StatCard key={c.label} {...c} delay={8 + i * 7} />
				))}
			</div>
		</AbsoluteFill>
		<Label top={1500} color={colors.white} delay={50}>
			SCRIS DIN PROMPTURI
		</Label>
		<Flash at={0} length={4} />
		<Audio src={sfx('whoosh')} volume={0.5} />
		{STAT_CARDS.map((_, i) => (
			<Sfx key={i} at={8 + i * 7 + 26} name="ding" volume={0.28} />
		))}
	</AbsoluteFill>
);

// ── 3. BUZZ! CHALLENGE (phone mockup) ────────────────────────────────────
const GO = 66; // frame the screen flips to "APASĂ!"
const TAP = 78; // frame the finger lands
const PADS = [colors.yellow, colors.red, colors.green, colors.blue];

const BuzzChallenge: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const phoneIn = spring({frame, fps, config: {damping: 14, stiffness: 140}});
	const go = frame >= GO;
	const tapped = frame >= TAP;
	const ms = tapped ? 187 : go ? Math.round(((frame - GO) / fps) * 1000) : 0;
	const stamp = spring({frame: frame - TAP - 10, fps, config: {damping: 9, stiffness: 240}});
	const finger = interpolate(frame, [GO, TAP], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1)});
	const ripple = interpolate(frame, [TAP, TAP + 14], [0, 1], clamp);
	const waitPulse = 0.85 + Math.sin(frame / 3) * 0.15;

	return (
		<AbsoluteFill>
			<Stage />
			<Shake hits={[TAP]} intensity={20}>
				<AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
					<Kinetic text="REACȚIE SUB *0,2 SECUNDE?*" mode="pop" fontSize={96} font="rounded" stagger={3} />
					<div
						style={{
							marginTop: 50,
							width: 700,
							height: 1250,
							borderRadius: 80,
							backgroundColor: colors.ink,
							border: `14px solid ${colors.paper}`,
							boxShadow: `0 22px 0 #000`,
							overflow: 'hidden',
							position: 'relative',
							translate: `0px ${(1 - phoneIn) * 900}px`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: '60px 50px',
							gap: 40,
						}}
					>
						<div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 30, color: '#9C978C', letterSpacing: '0.2em'}}>
							ZIUA 3 · PROVOCAREA
						</div>
						<div style={{fontFamily: fonts.impact, fontSize: 150, color: colors.white, lineHeight: 1}}>BUZZ!</div>
						<div
							style={{
								width: '100%',
								height: 170,
								borderRadius: 28,
								backgroundColor: go ? colors.green : colors.red,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: fonts.impact,
								fontSize: 84,
								color: colors.ink,
								opacity: go ? 1 : waitPulse,
							}}
						>
							{go ? 'APASĂ!' : 'AȘTEAPTĂ…'}
						</div>
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, width: '100%', position: 'relative'}}>
							{PADS.map((c, i) => {
								const hit = i === 0 && tapped && frame < TAP + 6;
								return (
									<div
										key={c}
										style={{
											height: 230,
											borderRadius: 34,
											backgroundColor: c,
											border: `8px solid ${colors.ink}`,
											boxShadow: hit ? `0 2px 0 #000` : `0 14px 0 #000`,
											translate: `0px ${hit ? 12 : 0}px`,
										}}
									/>
								);
							})}
							{/* finger: a fat circle that drops onto the yellow pad */}
							<div
								style={{
									position: 'absolute',
									left: 110,
									top: 70,
									width: 110,
									height: 110,
									borderRadius: '50%',
									backgroundColor: `${colors.white}D9`,
									border: `6px solid ${colors.ink}`,
									opacity: go ? 1 : 0,
									translate: `${(1 - finger) * 260}px ${(1 - finger) * 420}px`,
									scale: tapped ? 0.85 : 1,
								}}
							/>
							{tapped ? (
								<div
									style={{
										position: 'absolute',
										left: 165 - 160 * ripple,
										top: 125 - 160 * ripple,
										width: 320 * ripple,
										height: 320 * ripple,
										borderRadius: '50%',
										border: `${10 * (1 - ripple)}px solid ${colors.white}`,
										opacity: 1 - ripple,
									}}
								/>
							) : null}
						</div>
						<div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 96, color: tapped ? colors.yellow : colors.white}}>
							{(ms / 1000).toFixed(3).replace('.', ',')}s
						</div>
					</div>
				</AbsoluteFill>
			</Shake>
			{tapped ? (
				<div
					style={{
						position: 'absolute',
						top: 1180,
						left: 0,
						right: 0,
						textAlign: 'center',
						scale: stamp,
						rotate: '-10deg',
					}}
				>
					<span
						style={{
							fontFamily: fonts.impact,
							fontSize: 110,
							color: colors.ink,
							backgroundColor: colors.yellow,
							border: `10px solid ${colors.ink}`,
							borderRadius: 20,
							padding: '6px 36px',
						}}
					>
						+120 FAIMĂ
					</span>
				</div>
			) : null}
			<Flash at={0} length={4} />
			<Flash at={TAP} length={5} />
			<Audio src={sfx('whoosh')} volume={0.45} />
			<Sfx at={GO} name="switch" volume={0.6} />
			<Sfx at={TAP} name="vine-boom" volume={0.45} />
			<Sfx at={TAP + 10} name="yippee" volume={0.35} />
		</AbsoluteFill>
	);
};

// ── 4. PUBLIC VOTE ───────────────────────────────────────────────────────
const VOTERS = [
	{name: 'THEO', color: '#00C2D1', pct: 34},
	{name: 'TU', color: colors.yellow, pct: 31},
	{name: 'IORGA', color: '#FF5FA2', pct: 22},
	{name: 'COSTI', color: colors.red, pct: 13},
];
const OUT = 96; // elimination stamp

const Vote: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const stamp = spring({frame: frame - OUT, fps, config: {damping: 8, stiffness: 300}});

	return (
		<AbsoluteFill>
			<Stage />
			<Shake hits={[OUT]} intensity={26}>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260, gap: 80}}>
					<Kinetic text="VOTUL *PUBLICULUI*" mode="slam" fontSize={130} font="impact" stagger={4} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 46, width: 900}}>
						{VOTERS.map((v, i) => {
							// bars wobble while votes "come in", then lock on the final number
							const settle = interpolate(frame, [10 + i * 4, 80], [0, 1], {...clamp, easing: Easing.bezier(0.33, 1, 0.68, 1)});
							const jitter = Math.sin(frame / 2.3 + i * 2) * 6 * (1 - settle);
							const pct = Math.max(0, v.pct * settle + jitter);
							const out = i === VOTERS.length - 1 && frame >= OUT;
							return (
								<div key={v.name} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: out ? 0.45 : 1}}>
									<div
										style={{
											width: 92,
											height: 92,
											borderRadius: '50%',
											backgroundColor: v.color,
											border: `7px solid ${colors.ink}`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontFamily: fonts.impact,
											fontSize: 46,
											color: colors.ink,
											flexShrink: 0,
										}}
									>
										{v.name[0]}
									</div>
									<div style={{flex: 1}}>
										<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
											<span style={{fontFamily: fonts.rounded, fontSize: 52, color: colors.white, ...stroke(8)}}>{v.name}</span>
											<span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 52, color: v.color, ...stroke(8)}}>
												{Math.round(pct)}%
											</span>
										</div>
										<div style={{height: 46, borderRadius: 14, backgroundColor: '#26262E', border: `6px solid ${colors.white}`, overflow: 'hidden'}}>
											<div style={{width: `${(pct / 40) * 100}%`, height: '100%', backgroundColor: v.color}} />
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</AbsoluteFill>
			</Shake>
			{frame >= OUT ? (
				<div style={{position: 'absolute', top: 1380, left: 0, right: 0, textAlign: 'center', scale: interpolate(stamp, [0, 1], [2.4, 1]), opacity: Math.min(1, stamp * 2)}}>
					<span
						style={{
							display: 'inline-block',
							fontFamily: fonts.impact,
							fontSize: 120,
							letterSpacing: '0.06em',
							color: colors.red,
							border: `12px solid ${colors.red}`,
							padding: '4px 34px',
							backgroundColor: `${colors.ink}E6`,
							rotate: '-12deg',
						}}
					>
						ELIMINAT
					</span>
				</div>
			) : null}
			<Flash at={0} length={4} />
			<Audio src={sfx('whip')} volume={0.5} />
			{[20, 32, 44, 56, 68].map((f) => (
				<Sfx key={f} at={f} name="mouse-click" volume={0.35} />
			))}
			<Sfx at={OUT} name="record-scratch" volume={0.45} />
		</AbsoluteFill>
	);
};

// ── 5. CTA ───────────────────────────────────────────────────────────────
const Cta: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const btn = spring({frame: frame - 24, fps, config: {damping: 10, stiffness: 200}});
	const pulse = 1 + Math.max(0, Math.sin((frame / BEAT) * Math.PI)) * 0.05;
	const bob = Math.sin(frame / 6) * 12;

	return (
		<AbsoluteFill>
			<Stage />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 200, gap: 50}}>
				<Kinetic text="SEZONUL *TĂU* ÎNCEPE ACUM" mode="pop" fontSize={140} font="rounded" stagger={4} />
				<div style={{translate: `0px ${bob}px`, rotate: '6deg', marginTop: 20}}>
					<Gamepad width={620} presses={{a: [30, 60], y: [45, 75]}} />
				</div>
				<div
					style={{
						marginTop: 30,
						scale: btn * pulse,
						fontFamily: fonts.impact,
						fontSize: 96,
						color: colors.ink,
						backgroundColor: colors.green,
						border: `10px solid ${colors.ink}`,
						borderRadius: 30,
						boxShadow: `0 16px 0 #168540`,
						padding: '10px 60px',
					}}
				>
					JOACĂ GRATUIT ▶
				</div>
			</AbsoluteFill>
			<Label top={1560} color={colors.white} delay={40}>
				SCRIE „BUZZ” ÎN COMENTARII
			</Label>
			<Flash at={0} length={4} />
			<Audio src={sfx('whoosh')} volume={0.5} />
			<Sfx at={24} name="ding" volume={0.4} />
		</AbsoluteFill>
	);
};

export const BuzzPromo: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: colors.ink}}>
			<Series>
				<Series.Sequence name="Hook" durationInFrames={HOOK} premountFor={fps}>
					<Hook />
				</Series.Sequence>
				<Series.Sequence name="Stats" durationInFrames={STATS} premountFor={fps}>
					<Stats />
				</Series.Sequence>
				<Series.Sequence name="Buzz" durationInFrames={BUZZ} premountFor={fps}>
					<BuzzChallenge />
				</Series.Sequence>
				<Series.Sequence name="Vote" durationInFrames={VOTE} premountFor={fps}>
					<Vote />
				</Series.Sequence>
				<Series.Sequence name="CTA" durationInFrames={CTA} premountFor={fps}>
					<Cta />
				</Series.Sequence>
			</Series>
			<Audio src={staticFile('music/beat.wav')} volume={0.32} />
			<Grain />
		</AbsoluteFill>
	);
};
