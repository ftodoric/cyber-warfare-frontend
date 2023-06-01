import { Dispatch, SetStateAction } from 'react'

import { IconClose } from '@components/Icons'
import { Loader } from '@components/Loader'
import { useMakeGameAction } from '@hooks'
import { removePlayer, useGameActionContext } from '@modules/Game/context/GameActionContext'
import { useGameContext } from '@modules/Game/context/GameContext'
import { GameAction } from '@types'

import { BlackMarketAsset } from './BlackMarketAsset'
import * as S from './styles'
import { useBlackMarket } from './useBlackMarket'

interface HelpDialogProps {
  onClose: () => void
}

export const BlackMarket = ({ onClose }: HelpDialogProps) => {
  const { game } = useGameContext()
  const { id: gameId } = game!

  const { data, isLoading, isError } = useBlackMarket(gameId)

  const makeGameAction = useMakeGameAction(gameId)

  const { state, dispatch } = useGameActionContext()
  const { selectedPlayer } = state

  const handleGameAction = () => {
    makeGameAction.mutate({ actionType: GameAction.ACCESS_BLACK_MARKET, payload: { entityPlayer: selectedPlayer } })
    dispatch(removePlayer())
    onClose()
  }

  if (isLoading) {
    return (
      <S.BlackMarketModal>
        <Loader />

        <S.CloseButton onClick={onClose}>
          <IconClose width="30px" height="30px" fill="firebrick" />
        </S.CloseButton>
      </S.BlackMarketModal>
    )
  }

  if (isError || !data) return null

  return (
    <S.BlackMarketModal>
      {data.map((asset) => {
        return <BlackMarketAsset key={asset.id} asset={asset} />
      })}

      <S.ConcludeBidding onClick={handleGameAction}>Conclude bidding</S.ConcludeBidding>

      <S.CloseButton onClick={onClose}>
        <IconClose width="30px" height="30px" fill="firebrick" />
      </S.CloseButton>
    </S.BlackMarketModal>
  )
}
