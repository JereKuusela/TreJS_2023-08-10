/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

const w = window as any

// Pseuso implementation of React Hooks
const Component = () => {
  const [value1, setValue1] = useState(0)
  w.s1 = setValue1
  const [value2, setValue2] = useState(0)
  w.s2 = setValue2

  useEffect(() => console.log("Value 1: " + value1), [value1])
  useEffect(() => console.log("Value 2: " + value2), [value2])
}

// Saved hooks for each component instance.
const hookCache: Record<string, Hooks> = {}

let cache: Hooks = {
  // 1. Magic that gets hook array for the component.
  hooks: [],
  // 2. Magic that tracks the hook order.
  index: 0,
  // 3. Magic that reruns the component code when state changes.
  refresh: () => {},
}

// Wrapper to the component instance.
w.s = () => {
  initComponent("test", w.s)
  Component()
}

const initComponent = (id: string, refresh: () => void) => {
  hookCache[id] ??= {
    index: 0,
    refresh,
    hooks: [],
  }
  cache = hookCache[id]
  cache.index = 0
}


const useState = ( initialValue: number) => {
  const hooks = cache.hooks
  if (hooks.length <= cache.index) {
    const refresh = cache.refresh
    const hook: StateHook = {
      value: initialValue,
      setValue: (value: number) => {
        hook.value = value
        refresh()
      }
    }
    hooks.push(hook)
    console.log("CREATE STATE HOOK " + hooks.length)
  }
  const hook = hooks[cache.index] as StateHook
  cache.index += 1
  return [hook.value, hook.setValue] as const
}


const useEffect = (callback: () => void, dependencies: number[]) => {
  const hooks = cache.hooks
  if (hooks.length <= cache.index) {
    const hook: EffectHook = {
      dependencies : undefined,
    }
    hooks.push(hook)
    console.log("CREATE EFFECT HOOK " + hooks.length)
  }
  const hook = hooks[cache.index] as EffectHook
  // 4. Magic that runs some code if dependencies change.
  const changed = hook.dependencies === undefined || hook.dependencies.some((dependency, index) => dependency !== dependencies[index])
  hook.dependencies = dependencies
  cache.index += 1
  if (changed)
    callback()
}



const ComponentMemo = () => {
  const [value1, setValue1] = useState(1)
  w.m1 = setValue1
  const [value2, setValue2] = useState(1)
  w.m2 = setValue2

  const memo1 = useMemo(() => {
    console.log("CALCULATING Memo 1....")
    return value1 * value2
  }, [value1, value2])
  
  const memo2 = useMemo(() => {
    console.log("CALCULATING Memo 2....")
    return value2 * value2
  }, [value2])

  useEffect(() => console.log("Memo 1: " + memo1), [memo1])
  useEffect(() => console.log("Memo 2: " + memo2), [memo2])
}


w.m = () => {
  initComponent("testMemo", w.m)
  ComponentMemo()
}

const useMemo = (callback: () => number, dependencies: number[]) => {
  const hooks = cache.hooks
  if (hooks.length <= cache.index) {
    const hook: MemoHook = {
      value: 0,
      dependencies : undefined,
    }
    hooks.push(hook)
    console.log("CREATE MEMO HOOK " + hooks.length)
  }
  const hook = hooks[cache.index] as MemoHook
  const changed = hook.dependencies === undefined || hook.dependencies.some((dependency, index) => dependency !== dependencies[index])
  hook.dependencies = dependencies
  cache.index += 1
  if (changed)
    hook.value =callback()
  return hook.value
}

export default w

type Hooks = {
  index: number,
  refresh: () => void,
  hooks: (StateHook | EffectHook |  MemoHook)[]
}

type StateHook = {
  value: number,
  setValue: (value: number) => void,
}

type EffectHook = {
  dependencies: number[] | undefined
}

type MemoHook = {
  value: number,
  dependencies: number[] | undefined
}
