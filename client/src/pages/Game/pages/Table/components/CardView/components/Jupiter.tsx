import React from 'react'

export const Jupiter = () => (
	<svg version="1.1" viewBox="0 0 640 640" style={{ width: '100%' }}>
		<defs>
			<radialGradient
				id="radialGradient"
				gradientUnits="userSpaceOnUse"
				cx="495.73"
				cy="73.08"
				dx="155.73"
				dy="595.38"
				r="623.22"
			>
				<stop style={{ stopColor: '#ffffff', stopOpacity: 0 }} offset="0%" />
				<stop
					style={{ stopColor: '#616060', stopOpacity: 0.56 }}
					offset="55.04223241091605%"
				/>
				<stop style={{ stopColor: '#010000', stopOpacity: 1 }} offset="100%" />
			</radialGradient>
			<linearGradient
				id="gradient"
				gradientUnits="userSpaceOnUse"
				x1="320"
				y1="0"
				x2="320"
				y2="640"
			>
				<stop style={{ stopColor: '#c2aa99', stopOpacity: 1 }} offset="0%" />
				<stop
					style={{ stopColor: '#b39279', stopOpacity: 1 }}
					offset="8.812252556241704%"
				/>
				<stop
					style={{ stopColor: '#ab6532', stopOpacity: 1 }}
					offset="12.818271762730967%"
				/>
				<stop
					style={{ stopColor: '#a18e80', stopOpacity: 1 }}
					offset="16.050461587021466%"
				/>
				<stop
					style={{ stopColor: '#c3b0a2', stopOpacity: 1 }}
					offset="24.628957560162643%"
				/>
				<stop
					style={{ stopColor: '#86532b', stopOpacity: 1 }}
					offset="30.43205777728758%"
				/>
				<stop
					style={{ stopColor: '#d2bcab', stopOpacity: 1 }}
					offset="34.46899705876577%"
				/>
				<stop
					style={{ stopColor: '#895d3b', stopOpacity: 1 }}
					offset="50.742908537224785%"
				/>
				<stop
					style={{ stopColor: '#9c6a46', stopOpacity: 1 }}
					offset="54.02292170342582%"
				/>
				<stop
					style={{ stopColor: '#bca799', stopOpacity: 1 }}
					offset="56.924471811988276%"
				/>
				<stop
					style={{ stopColor: '#a47c5a', stopOpacity: 1 }}
					offset="68.15220918859953%"
				/>
				<stop
					style={{ stopColor: '#695039', stopOpacity: 1 }}
					offset="73.8963549446158%"
				/>
				<stop
					style={{ stopColor: '#c6a88d', stopOpacity: 1 }}
					offset="80.33623916127507%"
				/>
				<stop style={{ stopColor: '#9b7955', stopOpacity: 1 }} offset="100%" />
			</linearGradient>
		</defs>
		<g>
			<path
				d="M640 320C640 496.61 496.61 640 320 640C143.39 640 0 496.61 0 320C0 143.39 143.39 0 320 0C496.61 0 640 143.39 640 320Z"
				fill="url(#gradient)"
			/>
			<path
				d="M640 320C640 496.61 496.61 640 320 640C143.39 640 0 496.61 0 320C0 143.39 143.39 0 320 0C496.61 0 640 143.39 640 320Z"
				fill="url(#radialGradient)"
			/>
		</g>
	</svg>
)
