
import { useStore } from './store/store'
import './App.css'
import { StoreState } from './types'

function App() {
  const bears = useStore((state: StoreState) => state.bears)
  const increasePopulation = useStore((state) => state.increasePopulation)
  const decreasePopulation = useStore((state) => state.decreasePopulation)

  const apiUrl = import.meta.env.VITE_API_KEY;
  return (
    <>
      <h1 className="text-3xl font-bold underline">
      Hello world!
      </h1>

      <div className='flex items-center gap-4'>
        {bears}
        <button onClick={increasePopulation}>Aumentar los osos</button>
        <button onClick={decreasePopulation}>reducir los osos</button>
      </div>
      <h3>{apiUrl}</h3>
    </>
  )
}

export default App
