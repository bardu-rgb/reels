import React from 'react';
import {Composition, Folder} from 'remotion';
import {DayX, calculateDayXMetadata, dayXSchema} from './episodes/DayX';
import {BUZZ_PROMO_DURATION, BuzzPromo} from './promo/BuzzPromo';

export const RemotionRoot: React.FC = () => {
	return (
		<>
		<Folder name="Series-DayX">
			<Composition
				id="Day1"
				component={DayX}
				schema={dayXSchema}
				calculateMetadata={calculateDayXMetadata}
				durationInFrames={450}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					day: 1,
					playersBefore: 37,
					playersAfter: 52,
					goal: 250,
					gameName: 'My game',
					beats: [
						{text: 'I need *250* players to unlock my game', mode: 'pop'},
						{text: 'today I added a *SECRET* block', mode: 'rise'},
						{text: 'one player found it in *4 MINUTES*', mode: 'slam'},
					],
					question: 'what should I add *next?*',
				}}
			/>
		</Folder>
		<Folder name="Promo">
			<Composition
				id="BuzzPromo"
				component={BuzzPromo}
				durationInFrames={BUZZ_PROMO_DURATION}
				fps={30}
				width={1080}
				height={1920}
			/>
		</Folder>
		</>
	);
};
