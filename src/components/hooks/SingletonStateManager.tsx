class SingletonStateManager {
  private static instance: SingletonStateManager;
  private state: any; // 전체 상태 저장소

  private constructor() {}

  static getInstance(): SingletonStateManager {
    if (!SingletonStateManager.instance) {
      SingletonStateManager.instance = new SingletonStateManager();
    }
    return SingletonStateManager.instance;
  }

  getInitialState<T>(data: T): T {
    // 초기 데이터 설정
    this.state = data;
    return this.state;
  }

  updateState<T>(newData: Partial<T>): void {
    this.state = { ...this.state, ...newData };
  }

  updateSpecificKey<T, K extends keyof T>(key: K, value: T[K]): void {
    this.state[key] = value;
  }

  getState<T>(): T {
    return this.state;
  }
}

export default SingletonStateManager;



// 실제로 상태를 관리하는 사용자 정의 훅
// function useCustomStateManagement<T>(initialState: T) {
//   const [state, setState] = React.useState<T>(initialState);

//   React.useEffect(() => {
//     // 초기 상태 설정
//     setState(initialState);

//     // 언마운트 시 cleanup 작업 수행
//     return () => {
//       console.log("Cleaning up state for component with state:", initialState);
//       setState(null as any); // 상태를 초기화하거나 필요한 정리 작업 수행
//     };
//   }, [initialState]);

//   const updateState = (newData: Partial<T>) => {
//     setState((prevState) => ({
//       ...prevState,
//       ...newData,
//     }));
//   };

//   const updateSpecificKey = <K extends keyof T>(key: K, value: T[K]) => {
//     setState((prevState) => ({
//       ...prevState,
//       [key]: value,
//     }));
//   };

//   return { state, updateState, updateSpecificKey };
// }

// export { SingletonStateManager, useCustomStateManagement };

