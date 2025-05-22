import { useUser } from '@clerk/clerk-react';

export const useAdmin = () => {
  const { user, isLoaded } = useUser();

  const isAdmin = user?.publicMetadata?.isAdmin === true;

  return {
    isAdmin,
    isLoaded,
    userId: user?.id
  };
}; 