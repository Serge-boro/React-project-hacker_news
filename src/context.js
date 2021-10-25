import React, { useContext, useEffect, useReducer } from 'react'

import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'
import reducer from './reducer'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?'

const newContext = React.createContext()

const initialState = {
  isLoading: true,
  hit: [],
  query: 'react',
  page: 0,
  npPages: 0,
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const removeStory = (id) => {
    dispatch({ type: REMOVE_STORY, payload: id })
  }

  const handleSearch = (query) => {
    dispatch({ type: HANDLE_SEARCH, payload: query })
  }

  const handlePage = (value) => {
    dispatch({ type: HANDLE_PAGE, payload: value })
  }

  const fetchMovie = async (url) => {
    dispatch({ type: SET_LOADING })
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      const { hits, nbPages } = data
      dispatch({ type: SET_STORIES, payload: { h: hits, nbPa: nbPages } })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMovie(`${API_ENDPOINT}query=${state.query}&page=${state.page}`)
  }, [state.query, state.page])
  return (
    <newContext.Provider
      value={{ ...state, removeStory, handleSearch, handlePage }}
    >
      {children}
    </newContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(newContext)
}
