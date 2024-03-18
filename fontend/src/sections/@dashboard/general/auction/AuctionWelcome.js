// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';
//
import { MotivationIllustration } from '../../../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
 
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

// ----------------------------------------------------------------------

export default function AuctionWelcome() {
  return (
    <RootStyle>
      <CardContent
        sx={{
          color: 'grey.800',
          p: { md: 0 },
          pl: { md: 5 }
        }}
      >
        <Typography gutterBottom variant="h2" color="primary">
          Welcome to 
          <br /> Auction
        </Typography>

        <Typography variant="h5" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto',fontStyle: 'italic' }}>
         Buy a product with your price
        </Typography>

       
      </CardContent>

   
    </RootStyle>
  );
}
