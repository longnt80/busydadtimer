import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest';
import Workout from './Workout'

describe('Workout', () => {
  it('renders the Workout component', () => {
    render(<Workout totalSets={1} workoutComplete={() => {console.log('workout completed')}} />)
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})