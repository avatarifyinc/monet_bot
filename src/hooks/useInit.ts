import { useLocation } from 'react-router-dom'

import { useStore } from '../store'

export const useInit = () => {
  const { generationId, setGenerationId } = useStore()
  const routerLocation = useLocation()

  const queryParameters = new URLSearchParams(routerLocation.search)
  const queryGenerationId = queryParameters.get('generation_id')

  if (generationId === undefined && queryGenerationId) {
    setGenerationId(queryGenerationId)
  }
}
