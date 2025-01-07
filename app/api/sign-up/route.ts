import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { username, email, password } = await req.json();
  
  const user = await supabase.from('user').select('*')
    .eq('username', username)
    .eq('email', email)
  
  if (user.data &&user.data.length > 0) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const { data, error } = await supabase.from('user').insert({ username, email, password });
  if (error && error.code === '23505') {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data
  }, { status: 200 });
};
