
export async function dispatchAction<T = any>(action:Promise<T>):Promise<T> {
  return new Promise<T>((resolve, reject) => {

    action.then((data) => {
      return resolve(data)
    }).catch(e => {
      reject(e)
    })
  })
}

export function useDispatchAction() {
  return dispatchAction
}
