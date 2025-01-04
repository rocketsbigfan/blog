import { redirect } from 'next/navigation';
import React from 'react'
import User from '@/components/User';
import { getCurrentUser } from '@/lib/session';

export default async function Admin() {
  const user = await getCurrentUser();
  console.log('user: ', user);

  if (!user) {
    return redirect('/sign-in');
  }
  return (
    <div className='w-full h-full'>
      <header className='flex justify-between items-center px-4 h-12 bg-gray-200'>
        <h1>Admin Dashboard</h1>
        <User user={user} />
      </header>
    </div>
  )
}
