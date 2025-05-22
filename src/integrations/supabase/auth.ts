import { useUser } from '@clerk/clerk-react';

export const isUserAdmin = (): boolean => {
  const { user } = useUser();
  return user?.publicMetadata?.isAdmin === true;
};

export const checkAndSetAdminStatus = async (): Promise<boolean> => {
  try {
    const { user } = useUser();
    if (!user) {
      console.error('No user found');
      return false;
    }

    // Check if user is already admin
    if (user.publicMetadata.isAdmin === true) {
      return true;
    }

    // If not admin, you can implement logic here to set admin status
    // This would typically be done through your backend or Clerk's dashboard
    console.log('User is not an admin');
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 