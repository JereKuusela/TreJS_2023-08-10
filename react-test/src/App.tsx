import React, { useMemo, useState } from 'react';
import './App.css';

const useButton = () =>{
  const [value, setValue] = useState(0)
  const increaseValue = () => setValue(p => p + 1)
  return [value, increaseValue] as const
}

function App(props: {title: string}) {
  // Called every change.
  console.log("Function")
  const [value1, setValue1] = useButton()
  const [value2, setValue2] = useButton()
  const sum = value1 + value2
  const square = useMemo(() => value1 * value2, [value1, value2]) // Start of dependency hell.
  return (
    <div className="App"><Title title={props.title} target="TreJS" />
    <p>
      Button <button style={{fontSize: 50}}  onClick={setValue1}>{value1}</button>
    </p>
    <p>
      Button <button style={{fontSize: 50}}  onClick={setValue2}>{value2}</button>
    </p>
    <p>
      Sum <span style={{fontSize: 50}}>{sum}</span>
    </p>
    <p>
      Square <span style={{fontSize: 50}}>{square}</span>
    </p>
    </div>
  );
}

const Title = (props: {title: string, target: string}) => {
  // Called every change.
  console.log("Function Title")
  // Good side is that props can be plain values and don't need any magic.
  console.log(props)
  return <h1>{props.title} {props.target}</h1>
}

export default App;
