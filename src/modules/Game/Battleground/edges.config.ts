import { MarkerType } from 'reactflow'

import { Game, TeamSide, GameEntity } from '@types'

const edgeStyle = {
  stroke: '#888888',
}

const basicEdgeStyle = {
  type: 'straight',
  style: edgeStyle,
}

const markerEnd = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: edgeStyle.stroke,
    width: 16,
    height: 16,
  },
}

const russiaAttackEdgeStyle = (isVectorOpen: boolean, attackStrength: number | undefined) => {
  const isAttackSuccessful = attackStrength !== undefined && attackStrength >= 0

  return {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'orange',
    },
    animated: true,
    style: {
      stroke: 'orange',
      strokeWidth: isVectorOpen ? '1' : '0',
    },
    labelStyle: {
      fill: isAttackSuccessful ? 'orange' : 'purple',
      fontSize: 18,
    },
    labelBgStyle: { fillOpacity: 0.75 },
    labelBgBorderRadius: 4,
  }
}

const ukAttackEdgeStyle = (isVectorOpen: boolean, attackStrength: number | undefined) => {
  const isAttackSuccessful = attackStrength !== undefined && attackStrength >= 0

  return {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'purple',
    },
    animated: true,
    style: {
      stroke: 'purple',
      strokeWidth: isVectorOpen ? '1' : '0',
    },
    labelStyle: {
      fill: isAttackSuccessful ? 'purple' : 'orange',
      fontSize: 18,
    },
    labelBgStyle: { fillOpacity: 0.75 },
    labelBgBorderRadius: 4,
  }
}

// Simple creation of required edge props
const basicEdgeFrom = (source: string) => {
  return {
    to: (target: string) => {
      return {
        id: `${source.replace('node-', '')}-${target.replace('node-', '')}`,
        source,
        target,
      }
    },
  }
}

const calculateEdges = (game: Game, userSide: TeamSide) => [
  // Blue side
  {
    ...basicEdgeFrom('node-electorate').to('node-ukPlc'),
    sourceHandle: 'fromLeft',
    targetHandle: 'toRight',
    ...basicEdgeStyle,
    ...markerEnd,
  },

  {
    ...basicEdgeFrom('node-electorate').to('node-ukGovernment'),
    sourceHandle: 'fromLeft',
    targetHandle: 'toRight',
    ...basicEdgeStyle,
  },

  {
    ...basicEdgeFrom('node-ukPlc').to('node-gchq'),
    sourceHandle: userSide === TeamSide.Blue ? 'fromTop' : 'fromBottom',
    targetHandle: 'toRight',
    ...basicEdgeStyle,
    ...markerEnd,
  },

  {
    ...basicEdgeFrom('node-ukGovernment').to('node-ukPlc'),
    sourceHandle: 'fromLeft',
    targetHandle: 'toRight',
    ...basicEdgeStyle,
  },

  {
    ...basicEdgeFrom('node-ukGovernment').to('node-gchq'),
    sourceHandle: 'fromLeft',
    targetHandle: 'toRight',
    ...basicEdgeStyle,
  },

  // Government attack vector
  {
    ...basicEdgeFrom('node-ukGovernment').to('node-russianGovernment'),
    sourceHandle: userSide === TeamSide.Blue ? 'fromTop' : 'fromBottom',
    targetHandle: userSide === TeamSide.Blue ? 'toBottom' : 'toTop',
    ...ukAttackEdgeStyle(game.isRussianGovernmentAttacked, game.lastAttackStrength),
    label: game.lastAttacker === GameEntity.UKGovernment ? `${game.lastAttackStrength}` : undefined,
  },

  {
    ...basicEdgeFrom('node-ukEnergy').to('node-electorate'),
    sourceHandle: 'fromLeft',
    targetHandle: userSide === TeamSide.Blue ? 'toTop' : 'toBottom',
    ...basicEdgeStyle,
  },

  {
    ...basicEdgeFrom('node-ukEnergy').to('node-ukGovernment'),
    sourceHandle: 'fromLeft',
    targetHandle: 'toRight',
    ...basicEdgeStyle,
  },

  // GCHQ - Rosenergoatom attack vector
  {
    ...basicEdgeFrom('node-gchq').to('node-rosenergoatom'),
    sourceHandle: userSide === TeamSide.Blue ? 'fromTop' : 'fromBottom',
    targetHandle: userSide === TeamSide.Blue ? 'toBottom' : 'toTop',
    ...basicEdgeStyle,
    ...ukAttackEdgeStyle(game.isRosenergoatomAttacked, game.lastAttackStrength),
    label: game.lastAttacker === GameEntity.GCHQ ? `${game.lastAttackStrength}` : undefined,
  },

  // Red Side
  {
    ...basicEdgeFrom('node-energeticBear').to('node-russianGovernment'),
    sourceHandle: 'fromRight',
    targetHandle: 'toLeft',
    ...basicEdgeStyle,
  },

  // Industry attack vector
  {
    ...basicEdgeFrom('node-energeticBear').to('node-ukPlc'),
    sourceHandle: userSide === TeamSide.Red ? 'fromTop' : 'fromBottom',
    targetHandle: userSide === TeamSide.Red ? 'toBottom' : 'toTop',
    ...russiaAttackEdgeStyle(true, game.lastAttackStrength),
    label: game.lastAttacker === GameEntity.EnergeticBear ? `${game.lastAttackStrength}` : undefined,
  },

  {
    ...basicEdgeFrom('node-russianGovernment').to('node-onlineTrolls'),
    sourceHandle: 'fromRight',
    targetHandle: 'toLeft',
    ...basicEdgeStyle,
    ...markerEnd,
  },

  // People attack vector
  {
    ...basicEdgeFrom('node-onlineTrolls').to('node-electorate'),
    sourceHandle: userSide === TeamSide.Red ? 'fromTop' : 'fromBottom',
    targetHandle: userSide === TeamSide.Red ? 'toBottom' : 'toTop',
    ...russiaAttackEdgeStyle(true, game.lastAttackStrength),
    label: game.lastAttacker === GameEntity.OnlineTrolls ? `${game.lastAttackStrength}` : undefined,
  },

  {
    ...basicEdgeFrom('node-russianGovernment').to('node-rosenergoatom'),
    sourceHandle: 'fromRight',
    targetHandle: 'toLeft',
    ...basicEdgeStyle,
  },

  {
    ...basicEdgeFrom('node-scs').to('node-energeticBear'),
    sourceHandle: 'fromRight',
    targetHandle: userSide === TeamSide.Red ? 'toTop' : 'toBottom',
    ...basicEdgeStyle,
    ...markerEnd,
  },

  {
    ...basicEdgeFrom('node-scs').to('node-russianGovernment'),
    sourceHandle: 'fromRight',
    targetHandle: 'toLeft',
    ...basicEdgeStyle,
  },

  // SCS - UK Energy attack vector
  {
    ...basicEdgeFrom('node-scs').to('node-ukEnergy'),
    sourceHandle: userSide === TeamSide.Blue ? 'fromBottom' : 'fromTop',
    targetHandle: userSide === TeamSide.Blue ? 'toTop' : 'toBottom',
    ...basicEdgeStyle,
    ...russiaAttackEdgeStyle(game.isUkEnergyAttacked, game.lastAttackStrength),
    label: game.lastAttacker === GameEntity.SCS ? `${game.lastAttackStrength}` : undefined,
  },
]

export default calculateEdges
