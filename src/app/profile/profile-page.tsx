import { Suspense } from 'react';
import ProfileClient from './ProfileClient';

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileClient />
    </Suspense>
  );
}
