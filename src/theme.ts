import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/fonts so renders never depend on the network.
// Lilita One = chunky Roblox-thumbnail energy, Anton = condensed slams,
// JetBrains Mono = "dev log" numbers that look like a real dashboard.
loadFont({family: 'LilitaOne', url: staticFile('fonts/LilitaOne.woff2')});
loadFont({family: 'Anton', url: staticFile('fonts/Anton.woff2')});
loadFont({family: 'JetBrainsMono', url: staticFile('fonts/JetBrainsMono-800.woff2'), weight: '800'});

export const fonts = {
	display: 'LilitaOne',
	impact: 'Anton',
	mono: 'JetBrainsMono',
};

// Deliberately flat, high-contrast palette. No purple gradients, no glows:
// that is the "AI made this" look we are avoiding.
export const colors = {
	ink: '#0B0B0E',
	paper: '#F4F1EA',
	white: '#FFFFFF',
	yellow: '#FFD60A',
	red: '#FF3B30',
	green: '#2BD96B',
	blue: '#2F7BFF',
	gold: '#F5B400',
};

export const VIDEO = {
	width: 1080,
	height: 1920,
	fps: 30,
};

// Outlined "sticker" text like hand-edited Roblox TikToks (CapCut-style stroke).
export const stroke = (px: number, color: string = colors.ink): React.CSSProperties => ({
	WebkitTextStroke: `${px}px ${color}`,
	paintOrder: 'stroke fill',
});
