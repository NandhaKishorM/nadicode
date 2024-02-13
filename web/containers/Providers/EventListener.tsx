/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropsWithChildren, useEffect, useRef } from 'react'

import { baseName } from '@janhq/core'
import { useAtomValue, useSetAtom } from 'jotai'

import { useDownloadState } from '@/hooks/useDownloadState'
import { useGetDownloadedModels } from '@/hooks/useGetDownloadedModels'

import { modelBinFileName } from '@/utils/model'

import EventHandler from './EventHandler'

import { appDownloadProgress } from './Jotai'

import { downloadingModelsAtom } from '@/helpers/atoms/Model.atom'

export default function EventListenerWrapper({ children }: PropsWithChildren) {
  const setProgress = useSetAtom(appDownloadProgress)
  const models = useAtomValue(downloadingModelsAtom)
  const modelsRef = useRef(models)

  const { setDownloadedModels, downloadedModels } = useGetDownloadedModels()
  const {
    setDownloadState,
    setDownloadStateSuccess,
    setDownloadStateFailed,
    setDownloadStateCancelled,
  } = useDownloadState()
  const downloadedModelRef = useRef(downloadedModels)

  useEffect(() => {
    modelsRef.current = models
  }, [models])
  useEffect(() => {
    downloadedModelRef.current = downloadedModels
  }, [downloadedModels])

  useEffect(() => {
    if (window && window.electronAPI) {
      window.electronAPI.onFileDownloadUpdate(
        async (_event: string, state: any | undefined) => {
          if (!state) return
          const modelName = await baseName(state.fileName)
          const model = modelsRef.current.find(
            (model) => modelBinFileName(model) === modelName
          )
          if (model)
            setDownloadState({
              ...state,
              modelId: model.id,
            })
        }
      )

      window.electronAPI.onFileDownloadError(
        async (_event: string, state: any) => {
          const modelName = await baseName(state.fileName)
          const model = modelsRef.current.find(
            (model) => modelBinFileName(model) === modelName
          )
          if (model) {
            if (state.err?.message !== 'aborted') {
              console.error('Download error', state)
              setDownloadStateFailed(model.id, state.err.message)
            } else {
              setDownloadStateCancelled(model.id)
            }
          }
        }
      )

      window.electronAPI.onFileDownloadSuccess(
        async (_event: string, state: any) => {
          if (state && state.fileName) {
            const modelName = await baseName(state.fileName)
            const model = modelsRef.current.find(
              (model) => modelBinFileName(model) === modelName
            )
            if (model) {
              setDownloadStateSuccess(model.id)
              setDownloadedModels([...downloadedModelRef.current, model])
            }
          }
        }
      )

      window.electronAPI.onAppUpdateDownloadUpdate(
        (_event: string, progress: any) => {
          setProgress(progress.percent)
          console.debug('app update progress:', progress.percent)
        }
      )

      window.electronAPI.onAppUpdateDownloadError(
        (_event: string, callback: any) => {
          console.error('Download error', callback)
          setProgress(-1)
        }
      )

      window.electronAPI.onAppUpdateDownloadSuccess(() => {
        setProgress(-1)
      })
    }
    return () => {}
  }, [])

  return (
    <div id="eventlistener">
      <EventHandler>{children}</EventHandler>
    </div>
  )
}
