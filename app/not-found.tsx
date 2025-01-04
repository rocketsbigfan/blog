import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center mt-40">
      <h2>没找着</h2>
      <Link href="/">返回</Link>
    </div>
  )
}