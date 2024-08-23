import background from '@/assets/mars-background.jpg'
import styled from 'styled-components'

/*
const ThreeMars = lazy(() => import('./components/ThreeMars'))
*/

export const Mars = () => {
	return (
		<Background>
			{/*
			<Suspense fallback={<img src={background} />}>
				<ThreeMars />
			</Suspense>
			*/}
			<img src={background} />
		</Background>
	)
}

const Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	display: flex;
	justify-content: center;
	align-items: center;

	> img {
		margin: auto;
		width: 100%;
		max-width: 600px;
		border-radius: 50%;
		box-shadow: 0px 0px 20px 14px rgba(200, 200, 255, 0.4);
	}
`
