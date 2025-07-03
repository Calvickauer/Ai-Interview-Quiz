import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfilePage from '../page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as any

describe('Profile page', () => {
  it('shows edit button initially and displays form after clicking', () => {
    render(<ProfilePage />)
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Username')).toBeNull()
    fireEvent.click(screen.getByText('Edit Profile'))
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('submits form data', async () => {
    render(<ProfilePage />)
    fireEvent.click(screen.getByText('Edit Profile'))
    const file = new File(['a'], 'avatar.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/avatar/i), { target: { files: [file] } })
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByPlaceholderText('Bio'), { target: { value: 'hi' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toBe('/api/user/update')
    const body = options.body as FormData
    expect(body.get('username')).toBe('bob')
    expect(body.get('bio')).toBe('hi')
    expect(body.get('avatar')).toBe(file)
  })
})
