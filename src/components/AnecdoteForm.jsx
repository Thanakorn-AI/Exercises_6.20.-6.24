// src/components/AnecdoteForm.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdoteService'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatchNotification({ type: 'SET', payload: 'Anecdote created successfully' })
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
    },
    onError: () => {
      dispatchNotification({ type: 'SET', payload: 'Error: Anecdote content must be at least 5 characters' })
      setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
    }
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">Add</button>
    </form>
  )
}

export default AnecdoteForm