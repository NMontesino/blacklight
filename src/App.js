import { useState, useEffect } from 'react'

import styled from 'styled-components'
// import domtoimage from 'dom-to-image'
// import { saveAs } from 'file-saver'

import { colors, blacklightColors } from './colors'

const Canvas = styled.div`
	display: flex;
	height: 100vh;
	width: 100vw;
	background-color: ${(props) => props.color};
	justify-content: flex-start;
	align-items: flex-start;
`

const Streak = styled.div`
	height: ${(props) => props.streak.height}px;
	width: ${(props) => props.streak.width}px;
	background-color: ${(props) => props.streak.color};
	z-index: ${(props) => props.streak.zIndex};
	position: absolute;
`

const BlacklightStamp = styled.div`
  z-index: 10;
  width: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  backdrop-filter: blur(6px);
  padding: 16px 24px;
  background-color: ${(props) => props.dark}31;
  margin: 72px 96px;
`

const StampLetter = styled.span`
	font-size: 24px;
	line-height: 0;
	text-align: center;
	height: auto;
	width: auto;
	color: ${(props) => props.light};
	text-shadow: -2px -2px 16px ${(props) => props.dark},
		2px -2px 16px ${(props) => props.dark},
		-2px 2px 16px ${(props) => props.dark},
		2px 2px 16px ${(props) => props.dark};
	font-family: 'Source Code Pro', monospace;
  font-weight: 400;
`

const App = () => {
	const [streaks, setStreaks] = useState([])
	const [background, setBackground] = useState('')
	const [blacklightAttributes, setBlacklightAttributes] = useState(null)

	const calculateLuminance = (color) => {
		const c = color.substring(1) // strip #
		const rgb = parseInt(c, 16) // convert rrggbb to decimal
		const r = (rgb >> 16) & 0xff // extract red
		const g = (rgb >> 8) & 0xff // extract green
		const b = (rgb >> 0) & 0xff // extract blue
		const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

		return luma
	}

	useEffect(() => {
		const rarityNumber = Math.random()
		const isBlacklightPalette = rarityNumber > 0.73
		const paletteGroup = isBlacklightPalette ? blacklightColors : colors
		const randomPalette = [
			...paletteGroup[Math.floor(Math.random() * colors.length)]
		]

		let idx = null
		let darkestColor = null
		let lightestColor = null

		if (isBlacklightPalette) {
			darkestColor = randomPalette.reduce((acc, curr) => {
				return calculateLuminance(curr) < calculateLuminance(acc)
					? curr
					: acc
			}, '#ffffff')
			lightestColor = randomPalette.reduce((acc, curr) => {
				return calculateLuminance(curr) > calculateLuminance(acc)
					? curr
					: acc
			}, '#000000')
			setBlacklightAttributes({
				light: lightestColor,
				dark: darkestColor,
				rare: Math.random() > 0.8
			})
			idx = randomPalette.indexOf(darkestColor)
		} else {
			idx = Math.floor(Math.random() * randomPalette.length)
		}

		const bg = randomPalette.splice(idx, 1)
		setBackground(bg)

		const numOfStreaks = Math.floor(Math.random() * 900) + 100
		const streakObjs = []

		for (let i = 0; i < numOfStreaks; i++) {
			const height = Math.floor(Math.random() * 61) + 4
			const width = Math.floor(Math.random() * 61) + 4
			const color =
				randomPalette[Math.floor(Math.random() * randomPalette.length)]
			const zIndex = Math.floor(Math.random() * 10)
			const offsetX = 64
			const offsetY = 48
			const posX =
				Math.floor(
					Math.random() * (window.innerWidth - (width + 2 * offsetX))
				) + offsetX
			const posY =
				Math.floor(
					Math.random() *
						(window.innerHeight - (height + 2 * offsetY))
				) + offsetY

			const streakProperties = {
				height,
				width,
				color,
				zIndex,
				posX,
				posY
			}
			streakObjs.push(streakProperties)
		}

		setStreaks(streakObjs)
	}, [])

	// useEffect(() => {
	//   const node = document.getElementById('root')
	//   streaks.length > 0 && domtoimage.toBlob(node).then((blob) => {
	//     saveAs(blob, 'blacklight.png')
	//   }).then(() => {
	//     window.location.reload(false)
	//   })
	// }, [streaks])

	return (
		<Canvas className='App' color={background}>
			{streaks.map(({ posX, posY, ...otherProps }) => {
				return (
					<Streak
						streak={otherProps}
						style={{ top: `${posY}px`, left: `${posX}px` }}
					/>
				)
			})}
			{blacklightAttributes ? (
				<BlacklightStamp dark={blacklightAttributes.dark}>
          {'blacklight'.split('').map((letter) => {
						if (letter === 'a' && blacklightAttributes.rare) {
							return (
								<StampLetter
									dark={blacklightAttributes.dark}
									light={blacklightAttributes.light}
								>
									🍄
								</StampLetter>
							)
						}
						return (
							<StampLetter
								dark={blacklightAttributes.dark}
								light={blacklightAttributes.light}
							>
								{letter}
							</StampLetter>
						)
					})}
				</BlacklightStamp>
			) : null}
		</Canvas>
	)
}

export default App
