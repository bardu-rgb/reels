import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/fonts so renders never depend on the network.
// Lilita One = chunky Roblox-thumbnail energy, Anton = condensed slams,
// JetBrains Mono = "dev log" numbers that look like a real dashboard.
loadFont({family: 'LilitaOne', url: staticFile('fonts/LilitaOne.woff2')});
loadFont({family: 'Anton', url: staticFile('fonts/Anton.woff2')});
loadFont({family: 'JetBrainsMono', url: staticFile('fonts/JetBrainsMono-800.woff2'), weight: '800'});
// Latin Extended subsets: Romanian ă ș ț (the base files above only carry basic Latin).
const LATIN_EXT = 'U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
loadFont({family: 'Anton', url: staticFile('fonts/Anton-ext.woff2'), unicodeRange: LATIN_EXT});
loadFont({family: 'JetBrainsMono', url: staticFile('fonts/JetBrainsMono-800-ext.woff2'), weight: '800', unicodeRange: LATIN_EXT});
// Lilita One has no ă/ș/ț at all, so Romanian videos use Baloo 2 ExtraBold as the chunky font.
loadFont({family: 'Baloo2', url: staticFile('fonts/Baloo2-800.woff2'), weight: '800'});
loadFont({family: 'Baloo2', url: staticFile('fonts/Baloo2-800-ext.woff2'), weight: '800', unicodeRange: LATIN_EXT});

export const fonts = {
	display: 'LilitaOne',
	impact: 'Anton',
	mono: 'JetBrainsMono',
	rounded: 'Baloo2',
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
