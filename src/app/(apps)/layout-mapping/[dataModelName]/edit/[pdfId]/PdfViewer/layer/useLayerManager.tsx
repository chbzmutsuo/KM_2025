import {cl} from '@lib/methods/common'
import {fabric} from 'fabric'
import React, {useState, useEffect, Fragment} from 'react'

type LayerManagerProps = {
  fabricCanvas: fabric.Canvas | null
}

export type layerStatus = {name: string; active: boolean; groups: fabric.Group[]}

export type addToLayerType = (layerName: string, group: fabric.Group[]) => void

export function useLayerManager({fabricCanvas}: LayerManagerProps) {
  const [layers, setLayers] = useState<{[key: string]: layerStatus}>({
    pen: {
      name: `ペン`,
      active: true,
      groups: [],
    },
    circleNumber: {
      name: `工事No`,
      active: true,
      groups: [],
    },
  })

  const getLayerStatus = (layerName: string) => {
    return layers[layerName]
  }
  const toggleLayer = (layerName: string) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        active: !prev[layerName].active,
      },
    }))
  }

  const activateLayer = (layerName: string) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        active: true,
      },
    }))
  }

  const isAllActive = Object.keys(layers).every(layerName => layers[layerName].active)
  const deactivateAllLayers = () => {
    setLayers(prev => {
      return Object.keys(prev).reduce((acc, layerName) => {
        acc[layerName] = {
          ...prev[layerName],
          active: false,
        }
        return acc
      }, {} as {[key: string]: layerStatus})
    })
  }

  const activateALlLayers = () => {
    setLayers(prev => {
      return Object.keys(prev).reduce((acc, layerName) => {
        acc[layerName] = {
          ...prev[layerName],
          active: true,
        }
        return acc
      }, {} as {[key: string]: layerStatus})
    })
  }

  useEffect(() => {
    if (!fabricCanvas) return
    // レイヤー切り替え時の処理
    Object.keys(layers).forEach(layerKey => {
      const {groups, active: isVisible} = layers[layerKey]

      groups?.forEach(obj => {
        if (obj) {
          obj.set('visible', isVisible)
        }
      })
    })

    fabricCanvas.renderAll()
  }, [layers, fabricCanvas])

  const addToLayer: addToLayerType = (layerName: string, group: fabric.Group) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        active: true,
        groups: [...prev[layerName].groups, group],
      },
    }))
  }

  const LayerSelectorUI = () => {
    const getBtnClass = (active: boolean) => {
      return cl(`vertical`, active ? `font-bold  ` : `opacity-30 `)
    }
    return (
      <Fragment>
        <div
          {...{
            active: isAllActive,
            className: cl(`text-primary-main`, getBtnClass(isAllActive)),
            onClick: () => [isAllActive ? deactivateAllLayers() : activateALlLayers()],
          }}
        >
          全て
        </div>
        {Object.keys(layers).map(layerName => {
          const {active, name} = getLayerStatus(layerName)
          return (
            <div
              key={layerName}
              {...{
                className: getBtnClass(active),
                active: active,
                onClick: () => {
                  // deactivateAllLayers()
                  toggleLayer(layerName)
                },
              }}
            >
              {name}
            </div>
          )
        })}
      </Fragment>
    )
  }

  return {
    layers,
    setLayers,
    getLayerStatus,
    activateLayer,
    toggleLayer,
    addToLayer,
    LayerSelectorUI,
  }
}
