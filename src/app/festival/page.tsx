'use client';
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  ApiService,
  FestivalGetManyDto,
  FestivalGetDto,
} from '../../services/api.service';
import Link from 'next/link';
import { Box, Button, Container, Stack } from '@mui/material';
import Map from '@/components/festivalPage/Map';
import { useRouter } from 'next/navigation';
import LoadingComponent from '@/components/loading';

export default function FestivalList() {
  const router = useRouter();
  const [festivalArray, setFestivalArray] = useState<FestivalGetDto[]>([]);
  const [error, setError] = useState(null);
  const [geoPosX, setGeoPosX] = useState(3.900041);
  const [geoPosY, setGeoPosY] = useState(43.6323496);
  const [loading, setLoading] = useState(true);
  const apiService: ApiService = new ApiService();
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const festivalListResult: FestivalGetDto[] =
        await apiService.festivalGetMany({
          offset: undefined,
          limit: 100,
          region: undefined,
          categoryId: undefined,
        } as FestivalGetManyDto);
      console.log(festivalListResult);
      setFestivalArray(festivalListResult);

      setLoading(false);
    } catch (e) {
      setError(error);
      setLoading(true);
    }
  };
  return (
    <>
    <Container sx={{display: 'flex', paddingTop: 5}} >
    {loading ?
      <LoadingComponent />
      :
      <>
        <Box sx={{position: 'fixed', width: '45vw', left:20}}>
          <Map
            festivalArray={festivalArray}
          />
        </Box>
        <Stack direction={'column'} alignItems={'center'} sx={{width: '45vw', marginLeft: 75}} >
          <Button
            variant='contained'
            color='success'
            onClick={() => router.push('/festival/create')}
            sx={{ maxWidth: 150}}
          >
            Ajouter un évènement
          </Button>
        {festivalArray?.map((festival, index: number) => {
          console.log(festival);
          const handleClickOnMap = (event: React.MouseEvent<HTMLDivElement>) => {
            setGeoPosX(festival.geoPosX);
            setGeoPosY(festival.geoPosY);
            setMarker(marker);
          };
          return (
              <Card
                key={index}
                sx={{
                  cursor: 'pointer',
                  marginTop: 2,
                  marginLeft: 2,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  justifyContent: 'center',
                  paddingLeft: 5,
                  width: '100%'
                }}
                onClick={handleClickOnMap}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Festival
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nom: {festival.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lieu: {festival.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date de création: {festival.creationDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Site internet: {festival.website ?
                      <Link href={festival.website}>{festival.website}</Link>
                      : <></>
                    }
                  </Typography>
                </CardContent>
                <CardActions sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <Link
                    href={'./../festival/detail?idFestival=' + festival.id}
                    style={{ textDecoration: 'none' }}
                  >
                    Details
                  </Link>
                </CardActions>
              </Card>

          );
        })}
        </Stack>
      </>
    }

    </Container>
    </>
  );
}
