import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AutocompleteInput from '../AutocompleteInput'

jest.mock('../../lib/typesense', () => ({
  typesense: {
    collections: () => ({
      documents: () => ({
        search: jest.fn().mockResolvedValue({ hits: [{ document: { name: 'React' } }] }),
      }),
    }),
  },
}))

describe('AutocompleteInput', () => {
  it('shows suggestions from Typesense', async () => {
    render(
      <AutocompleteInput
        id="tech"
        label="Tech"
        value=""
        collection="technologies"
        onChange={() => {}}
      />
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Rea' } })
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
    })
  })
})
