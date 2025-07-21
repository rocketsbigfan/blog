'use client'

import { globalFetcherWithParams, globalPostFetcher } from "@/lib/swr-global-config"
import { ChangeEvent, useDeferredValue, useState } from "react"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
export default function SwrComponent() {
  const [params, setParams] = useState<Record<string, any>>()
  const { data } = useSWR(['/api/test/bodyorparams', params], ([url, params]) => globalFetcherWithParams([url, params]), {
    revalidateOnMount: false
  })

  const [body, setBody] = useState<Record<string, any>>()
  const { data: postData } = useSWR(['/api/test/bodyorparams', body], ([url, body]) => globalPostFetcher([url, body]), {
    revalidateOnMount: false
  })

  const [inputVal, setInputVal] = useState('')
  const { data: inputData, trigger, isMutating } = useSWRMutation('/api/test/bodyorparams', (url, { arg }: { arg: {id: string} }) => globalFetcherWithParams([url, arg]))

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value)
    trigger({
      id: e.target.value
    })
  }
  return (<div className="mt-2">
    <h1>这是一个带参数的GET方法: {data ? JSON.stringify(data) : '-'}</h1>

    <button className=" mt-2 px-4 py-2 text-white bg-red-400 rounded-sm" onClick={() => {
      setParams({ id: Date.now().toString() })
    }}>GET请求</button>

    <h1 className="mt-2">这是一个useSWRMutation 的 GET请求：</h1>
    <input className="px-2 rounded-sm border border-gray focus:border-slate-500 outline-none" onChange={handleInput} />
    <div>参数：{inputVal}: 接口返回值: {!isMutating ? JSON.stringify(inputData): '-'}</div>
    <h1 className="mt-2">这是一个带BODY的POST方法: {postData ? JSON.stringify(postData) : '-'}</h1>
    <button className=" mt-2 px-4 py-2 text-white bg-red-400 rounded-sm" onClick={() => {
      setBody({ id: Date.now().toString() })
    }}>POST请求</button>
  </div>)
}