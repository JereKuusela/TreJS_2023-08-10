import { createSignal, type Component, createMemo } from 'solid-js';

import styles from './App.module.css';

const createButton = () =>{
  const [value, setValue] = createSignal(0)
  const increaseValue = () => setValue(p => p + 1)
  return [value, increaseValue] as const
}

const App = (props: {title: string}) => {
  console.log("Function App")
  const [value1, setValue1] = createButton()
  const [value2, setValue2] = createButton()
  const sum = () => value1() + value2()
  const square = createMemo(() => value1() * value2())
  return (
    <div class={styles.App}><Title title={props.title} target={"TreJS"} />
    <p>
      Button <button style={{"font-size": "50px"}}  onClick={setValue1}>{value1()}</button>
    </p>
    <p>
      Button <button style={{"font-size": "50px"}}  onClick={setValue2}>{value2()}</button>
    </p>
    <p>
      Sum <span style={{"font-size": "50px"}}>{sum()}</span>
    </p>
    <p>
      Square <span style={{"font-size": "50px"}}>{square()}</span>
    </p>
    </div>
  );
};

const Title = (props: {title: string, target: string}) => {
  console.log("Function Title")
  console.log(props.title)
  return <h1>{props.title} {props.target}</h1>
}

export default App;
