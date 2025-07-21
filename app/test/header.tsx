"use client";
import useTestFetch from "./useTestFetch";

export default function Header () {
  const { data } = useTestFetch()

  return (
    <header className="flex items-center h-[60px]">
      {data?.message}
    </header>
  )
}