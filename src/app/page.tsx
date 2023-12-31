'use client';
import { useEffect } from 'react';
import { ApiService } from '../services/api.service';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { Button, Container, Typography } from '@mui/material';
import { useUserContext } from '@/utils/contexts/UserContext';
import NavBar from '@/components/navBar/NavBar';
import { useRouter } from 'next/navigation';
import { TextLinkHrefEnum } from '@/utils/enums/text-link-href';
import LoadingComponent from '@/components/loading';

export default function Home() {
  const apiService: ApiService = new ApiService();
  const { userDataLoggedIn, setUserDataLoggedIn } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    fetchuserDataLoggedInToSetIntoContext();
  }, []);

  const fetchuserDataLoggedInToSetIntoContext = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      type customJwtPayload = JwtPayload & {
        userId: number;
      };
      const decodedToken = jwt_decode<customJwtPayload>(token);
      const userData = await apiService.userById(decodedToken.userId);
      console.log(userData);

      setUserDataLoggedIn(userData);
    }

    router.push(TextLinkHrefEnum.festivalList);
  };

  // Test of the logout and of the right display of the context OK, need to use it in an app Bar then//
  return (
    <LoadingComponent />
  )
}
