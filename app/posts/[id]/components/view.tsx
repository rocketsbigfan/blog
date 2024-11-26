'use client'

import { useEffect, useState } from "react";
import { getBlogVisits, postBlogVisits } from "@/lib/api";

export default function View({ id }: { id: string }) {
  const [blogVisits, setBlogVisits] = useState(0);

  useEffect(() => {
    postBlogVisits(id)
    getBlogVisits(id).then(res => {
      setBlogVisits(res.length);
    })
  }, [])
  return <span className="ml-2 text-sm">访问量：{blogVisits}</span>
}
