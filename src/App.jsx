// src/App.jsx
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './services/anecdoteService'
import { useNotificationDispatch } from './contexts/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      dispatchNotification({ type: 'SET', payload: 'Error: Anecdote content must be at least 5 characters' })
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false // No retries on failure for simplicity
  })

  if (result.isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems with the server</div>
  }

  const anecdotes = result.data || []

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatchNotification({ type: 'SET', payload: `Added anecdote '${content}'` })
    setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
  }

  const vote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updateAnecdoteMutation.mutate(updatedAnecdote)
    dispatchNotification({ type: 'SET', payload: `Voted for '${anecdote.content}'` })
    setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">Add</button>
      </form>
    
      <ul>
        {anecdotes.map(anecdote =>
          <li key={anecdote.id}>
              {anecdote.content} — votes: {anecdote.votes}
              <button onClick={() => vote(anecdote)}>Vote</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
