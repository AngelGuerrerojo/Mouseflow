import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyComponent from './components/mycomponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <MyComponent saludo="we"/>
        <MyComponent saludo="vato"/>
        <MyComponent saludo="compa"/>
        <MyComponent saludo="bro"/>
      </div>
    </>
  )
}

export default App
