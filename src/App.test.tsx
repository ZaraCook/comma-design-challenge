import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('scenario selection behavior', () => {
  it('updates the active scenario when a scenario is selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('active-scenario-name')).toHaveTextContent('Highway / Stable')

    await user.click(screen.getByRole('button', { name: /Sharp Turn \/ Steering Limit/i }))
    await user.click(screen.getByRole('button', { name: /Analysis view/i }))

    expect(screen.getByTestId('active-scenario-name')).toHaveTextContent('Sharp Turn / Steering Limit')
    expect(screen.getByText('Driving confidence').parentElement).toHaveTextContent('21%')
  })
})
