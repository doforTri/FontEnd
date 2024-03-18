import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const StyledImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    height: 200, 
    objectFit: 'cover', 
    marginBottom: theme.spacing(2),  
  }));

  const InfoItem = styled(Typography)(({ theme }) => ({
    fontSize: '16px',
    fontFamily: 'Open Sans', 
    fontWeight: 600,

    textTransform: 'uppercase',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  
    letterSpacing: '0.5px',

    textShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  
    borderBottom: `1px solid ${theme.palette.text.secondary}`,
  
    '&:last-child': {
      borderBottom: 'none'
    }
  }))
  

const InfoLabel = styled('strong')(({ theme }) => ({
  color: '#FF6666', // Màu chữ nổi bật cho nhãn
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#FFFFFF', // Màu background xanh nhạt
  },
}));

const JoinPopup = ({ open, onClose, data }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/auction/${data.id}`); // Điều hướng đến AuctionPage với ID sản phẩm
    onClose(); // Đóng popup sau khi điều hướng
  };

  // ... (phần còn lại của component)


  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Auction </DialogTitle>
      <DialogContent>
        <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
  <StyledImage src={data.imgUrl} alt="Event" />
</Grid>
          <Grid item xs={12} md={6}>
            <Box>
            <InfoItem variant="body1">
                <InfoLabel>Id: </InfoLabel> {data.id}
              </InfoItem>
              <InfoItem variant="body1">
                <InfoLabel>Name: </InfoLabel> {data.name}
              </InfoItem>
              <InfoItem variant="body1">
                <InfoLabel>Start Date:</InfoLabel> {data.startDate}
              </InfoItem>
              <InfoItem variant="body1">
                <InfoLabel>End Date:</InfoLabel> {data.endDate}
              </InfoItem>
              <InfoItem variant="body1">
                <InfoLabel>Step Price:</InfoLabel> {data.stepPrice}
              </InfoItem>
              <InfoItem variant="body1">
                <InfoLabel>Current Price:</InfoLabel> {data.currentPrice}
              </InfoItem>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleJoin} variant="contained" color="primary" autoFocus>
          Join
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default JoinPopup;