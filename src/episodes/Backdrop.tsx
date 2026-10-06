import React from 'react';
import {Video} from '@remotion/media';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

// Gameplay clip if we have one (public/clips/...), otherwise a moving
// dev-log backdrop. Real footage ALWAYS beats the fallback: record it.
export const Backdrop: React.FC<{clip?: string; watermark?: string; dim?: number}> = ({
	clip,
	watermark = '',
	dim = 0.45,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	if (clip) {
		return (
			<AbsoluteFill style={{backgroundColor: colors.ink}}>
				<Video
					src={clip.startsWith('http') ? clip : staticFile(clip)}
					premountFor={fps}
					muted
					objectFit="cover"
					style={{
						width: '100%',
						height: '100%',
						scale: interpolate(frame, [0, durationInFrames], [1.08, 1.18]),
					}}
				/>
				<AbsoluteFill style={{backgroundColor: `rgba(11,11,14,${dim})`}} />
			</AbsoluteFill>
		);
	}

	return (
		<AbsoluteFill style={{backgroundColor: colors.ink, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${colors.white}10 2px, transparent 2px), linear-gradient(90deg, ${colors.white}10 2px, transparent 2px)`,
					backgroundSize: '90px 90px',
					backgroundPosition: `0px ${frame * 2}px`,
				}}
			/>
			{/* hazard "dev log" tape: construction-site vibe for a game still being built */}
			<div
				style={{
					position: 'absolute',
					left: -200,
					right: -200,
					bottom: 300,
					height: 84,
					rotate: '-7deg',
					backgroundColor: colors.yellow,
					borderTop: `6px solid ${colors.ink}`,
					borderBottom: `6px solid ${colors.ink}`,
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						whiteSpace: 'nowrap',
						fontFamily: fonts.mono,
						fontWeight: 800,
						fontSize: 44,
						letterSpacing: '0.15em',
						color: colors.ink,
						translate: `${-((frame * 5) % 600)}px 0px`,
					}}
				>
					{'DEV LOG ▲ '.repeat(14)}
				</div>
			</div>
			{watermark ? (
				<div
					style={{
						position: 'absolute',
						top: 160,
						left: 0,
						right: 0,
						whiteSpace: 'nowrap',
						fontFamily: fonts.impact,
						fontSize: 520,
						lineHeight: 0.9,
						color: 'transparent',
						WebkitTextStroke: `3px ${colors.white}18`,
						translate: `${-frame * 4}px 0px`,
					}}
				>
					{`${watermark} ${watermark} ${watermark} ${watermark}`}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
