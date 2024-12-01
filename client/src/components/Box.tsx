import styled from 'styled-components'
import { Flex } from './Flex/Flex'

type Props = {
	$p?: number
	$px?: number
	$py?: number
	$pt?: number
	$pr?: number
	$pb?: number
	$pl?: number
	$m?: number
	$mx?: number
	$my?: number
	$mt?: number
	$mr?: number
	$mb?: number
	$ml?: number
}

const spacing = (value: number) => `${value * 0.25}rem`

export const Box = styled(Flex)<Props>`
	${({ $p }) => $p && `padding: ${spacing($p)};`}
	${({ $px }) =>
		$px && `padding-left: ${spacing($px)}; padding-right: ${spacing($px)};`}
	${({ $py }) =>
		$py && `padding-top: ${spacing($py)}; padding-bottom: ${spacing($py)};`}
	${({ $pt }) => $pt && `padding-top: ${spacing($pt)};`}
	${({ $pr }) => $pr && `padding-right: ${spacing($pr)};`}
	${({ $pb }) => $pb && `padding-bottom: ${spacing($pb)};`}
	${({ $pl }) => $pl && `padding-left: ${spacing($pl)};`}
	${({ $m }) => $m && `margin: ${spacing($m)};`}
	${({ $mx }) =>
		$mx && `margin-left: ${spacing($mx)}; margin-right: ${spacing($mx)};`}
	${({ $my }) =>
		$my && `margin-top: ${spacing($my)}; margin-bottom: ${spacing($my)};`}
	${({ $mt }) => $mt && `margin-top: ${spacing($mt)};`}
	${({ $mr }) => $mr && `margin-right: ${spacing($mr)};`}
	${({ $mb }) => $mb && `margin-bottom: ${spacing($mb)};`}
	${({ $ml }) => $ml && `margin-left: ${spacing($ml)};`}
`
