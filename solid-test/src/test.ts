
const w = window as any

// Pseudocode for SolidJs

const Component = () => {
  const [value1, setValue1] = createSignal(0)
  w.s1 = setValue1
  const [value2, setValue2] = createSignal(0)
  w.s2 = setValue2

  createEffect(() => console.log("Value 1: " + value1()))
  createEffect(() => console.log("Value 2: " + value2()))
  createEffect(() => console.log("Sum: " + (value1() + value2())))
}

w.s = Component

// Stack of observers, last one is registered as a listener.
const observers: (() => void)[] = []
const currentObserver = () => observers[observers.length - 1]

// 1. Magic that connects observers to the state.
const createEffect = (effect: () => void) => {
  observers.push(effect)
  effect()
  observers.pop()
}

const createSignal = (initialValue: number) => {
  let value = initialValue
  const listeners =  new Set<() => void>()
  const getValue = () => {
    if (currentObserver()) {
      console.log("Registering listener")
      listeners.add(currentObserver())
    }
    return value
  }
  const setValue = (newValue: number) => {
    if (value === newValue) return
    value = newValue
    // 2. State calls observer functions on change.
    listeners.forEach(listener => listener())
  }
  return [ getValue, setValue] as const
}


const ComponentMemo = () => {
  const [value1, setValue1] = createSignal(1)
  w.m1 = setValue1
  const [value2, setValue2] = createSignal(1)
  w.m2 = setValue2

  const memo1 = () => {
    console.log("CALCULATING Memo 1....")
    return value1() * value2()
  }
  
  const memo2 = createMemo(() => {
    console.log("CALCULATING Memo 2....")
    return value2() * value2()
  })

  createEffect(() => console.log("Memo 1: " + memo1()))
  createEffect(() => console.log("Memo 2: " + memo2()))
}

w.m = ComponentMemo

const createMemo = (callback: () => number) => {
  const [getValue, setValue] = createSignal(-1)
  createEffect(() => setValue(callback()))
  return getValue
}

export default w