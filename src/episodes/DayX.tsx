import React from 'react';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {
	AbsoluteFill,
	CalculateMetadataFunction,
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
import {Counter} from '../kinetic/Counter';
import {Backdrop} from './Backdrop';
import {Grain} from '../fx/Grain';
import {Shake} from '../fx/Shake';
import {Flash} from '../fx/Flash';
import {colors, fonts, stroke} from '../theme';

export const dayXSchema = z.object({
	day: z.number().int().min(1),
	playersBefore: z.number().int().min(0),
	playersAfter: z.number().int().min(0),
	goal: z.number().int().min(1),
	gameName: z.string(),
	beats: z.array(
		z.object({
			text: z.string(),
			mode: z.enum(['pop', 'slam', 'rise', 'type']),
			clip: z.string().optional(),
		}),
	),
	question: z.string(),
	hookClip: z.string().optional(),
	voiceover: z.string().optional(),
});

export type DayXProps = z.infer<typeof dayXSchema>;

// Scene lengths (frames @30fps). Hook stays under 3s on purpose.
const HOOK = 75;
const BEAT = 66;
const COUNT = 84;
const CTA = 90;

export const calculateDayXMetadata: CalculateMetadataFunction<DayXProps> = ({props}) => ({
	durationInFrames: HOOK + props.beats.length * BEAT + COUNT + CTA,
});

const sfx = (name: string) => staticFile(`sfx/${name}.wav`);

const Hook: React.FC<DayXProps> = ({day, playersBefore, goal, hookClip, gameName}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tagIn = spring({frame: frame - 26, fps, config: {damping: 12, stiffness: 200}});

	return (
		<AbsoluteFill>
			<Backdrop clip={hookClip} watermark={`DAY ${day}`} />
			<Shake hits={[0, 26]}>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 70, paddingBottom: 120}}>
					<Kinetic text={`DAY *${day}*`} mode="slam" fontSize={260} font="impact" strokeWidth={18} />
					<Sequence from={8} layout="none">
						<Counter from={0} to={playersBefore} goal={goal} start={0} duration={18} />
					</Sequence>
					<div
						style={{
							fontFamily: fonts.display,
							fontSize: 54,
							color: colors.ink,
							backgroundColor: colors.white,
							padding: '10px 30px',
							borderRadius: 16,
							border: `7px solid ${colors.ink}`,
							rotate: '-2deg',
							scale: tagIn,
							textTransform: 'uppercase',
						}}
					>
						{gameName} needs {goal} players to unlock
					</div>
				</AbsoluteFill>
			</Shake>
			<Flash at={0} />
			<Audio src={sfx('vine-boom')} volume={0.55} />
			<Sequence from={26} layout="none">
				<Audio src={sfx('ding')} volume={0.35} />
			</Sequence>
		</AbsoluteFill>
	);
};

const Beat: React.FC<{text: string; mode: DayXProps['beats'][number]['mode']; clip?: string; index: number; day: number}> = ({
	text,
	mode,
	clip,
	index,
	day,
}) => {
	const frame = useCurrentFrame();
	// gentle push-in so the static frame never feels dead
	const push = interpolate(frame, [0, BEAT], [1, 1.05], {easing: Easing.bezier(0.33, 0, 0.67, 1)});

	return (
		<AbsoluteFill>
			<Backdrop clip={clip} watermark={`DAY ${day}`} />
			<Shake hits={mode === 'slam' ? [0] : []} intensity={18}>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', scale: push, paddingBottom: 160}}>
					<div
						style={{
							position: 'absolute',
							top: 300,
							fontFamily: fonts.mono,
							fontWeight: 800,
							fontSize: 40,
							letterSpacing: '0.2em',
							color: colors.yellow,
							...stroke(7),
						}}
					>
						{`UPDATE ${String(index + 1).padStart(2, '0')}`}
					</div>
					<Kinetic text={text} mode={mode} fontSize={mode === 'slam' ? 150 : 118} stagger={mode === 'slam' ? 4 : 3} />
				</AbsoluteFill>
			</Shake>
			<Flash at={0} length={4} />
			<Audio src={sfx(index % 2 === 0 ? 'whoosh' : 'whip')} volume={0.5} />
		</AbsoluteFill>
	);
};

const CountUp: React.FC<DayXProps> = ({playersBefore, playersAfter, goal, day}) => {
	return (
		<AbsoluteFill>
			<Backdrop watermark={`DAY ${day}`} />
			<Shake hits={[42]} intensity={22}>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 80, paddingBottom: 140}}>
					<Kinetic text="PLAYERS *TODAY*" mode="rise" fontSize={96} />
					<Counter from={playersBefore} to={playersAfter} goal={goal} start={12} duration={30} showDelta />
				</AbsoluteFill>
			</Shake>
			<Flash at={0} length={4} />
			<Audio src={sfx('switch')} volume={0.5} />
			<Sequence from={42} layout="none">
				<Audio src={sfx('ding')} volume={0.45} />
			</Sequence>
		</AbsoluteFill>
	);
};

const Cta: React.FC<DayXProps> = ({question, day, goal, playersAfter}) => {
	const frame = useCurrentFrame();
	const bob = Math.sin(frame / 4) * 14;

	return (
		<AbsoluteFill>
			<Backdrop watermark={`DAY ${day + 1}?`} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 60, paddingBottom: 220}}>
				<Kinetic text={question} mode="pop" fontSize={104} stagger={3} />
				<div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 44, color: colors.white, ...stroke(7)}}>
					{goal - playersAfter} TO GO • DAY {day + 1} TOMORROW
				</div>
				<div
					style={{
						width: 0,
						height: 0,
						borderLeft: '60px solid transparent',
						borderRight: '60px solid transparent',
						borderTop: `80px solid ${colors.yellow}`,
						filter: `drop-shadow(0 8px 0 ${colors.ink})`,
						translate: `0px ${bob}px`,
						opacity: frame > 20 ? 1 : 0,
					}}
				/>
			</AbsoluteFill>
			<Flash at={0} length={4} />
			<Audio src={sfx('whoosh')} volume={0.5} />
		</AbsoluteFill>
	);
};

export const DayX: React.FC<DayXProps> = (props) => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: colors.ink}}>
			<Series>
				<Series.Sequence name="Hook" durationInFrames={HOOK} premountFor={fps}>
					<Hook {...props} />
				</Series.Sequence>
				{props.beats.map((b, i) => (
					<Series.Sequence key={i} name={`Beat ${i + 1}`} durationInFrames={BEAT} premountFor={fps}>
						<Beat text={b.text} mode={b.mode} clip={b.clip} index={i} day={props.day} />
					</Series.Sequence>
				))}
				<Series.Sequence name="Count" durationInFrames={COUNT} premountFor={fps}>
					<CountUp {...props} />
				</Series.Sequence>
				<Series.Sequence name="CTA" durationInFrames={CTA} premountFor={fps}>
					<Cta {...props} />
				</Series.Sequence>
			</Series>
			{props.voiceover ? <Audio src={staticFile(props.voiceover)} premountFor={fps} /> : null}
			<Grain />
		</AbsoluteFill>
	);
};
