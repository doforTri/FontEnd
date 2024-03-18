import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';

export default function AuctionPage(){
const StyledAuctionContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const StyledImage = styled('img')({
  width: '100%',
  maxHeight: '400px',
  objectFit: 'cover',
});

const StyledBidInput = styled(TextField)({
  marginRight: '8px',
});

const AuctionPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  console.log(id);
  const [timeLeft, setTimeLeft] = useState('00:00:00'); // Thời gian còn lại
  const [bidAmount, setBidAmount] = useState(''); // Số tiền đấu giá
  const [loading, setLoading] = useState(true); // Trạng thái loading khi tải thông tin sản phẩm

  // Giả sử bạn có một hàm để lấy thông tin sản phẩm từ ID
  // const product = fetchProductById(id);

  // Cập nhật thời gian còn lại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      // Cập nhật thời gian còn lại ở đây
      // setTimeLeft(updatedTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handlePlaceBid = () => {
    // Xử lý đặt giá ở đây
    console.log('Bid amount:', bidAmount);
  };

  // Giả sử bạn có một hàm để lấy thông tin sản phẩm và cập nhật trạng thái loading
  useEffect(() => {
    // fetchProductById(id).then((product) => {
    //   setProduct(product);
    //   setLoading(false);
    // });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledAuctionContainer maxWidth="md">
      <Paper elevation={3}>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Thay thế "/path/to/product/image.jpg" bằng đường dẫn thực tế của hình ảnh sản phẩm */}
              <StyledImage src="/path/to/product/image.jpg" alt="Product" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {/* Thay thế "Auction Title" bằng tên thực tế của sản phẩm */}
                Auction Title
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {/* Thay thế "Username" bằng tên người đấu giá cao nhất */}
                Highest Bidder: Username
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Time Left: {timeLeft}
              </Typography>
              <Box my={2}>
                <StyledBidInput
                  label="Your Bid"
                  variant="outlined"
                  value={bidAmount}
                  onChange={handleBidChange}
                />
                <Button variant="contained" color="primary" onClick={handlePlaceBid}>
                  Place Bid
                </Button>
              </Box>
              <Divider />
              <List>
                {/* Render danh sách người đấu giá cao nhất ở đây */}
                <ListItem>
                  <ListItemText primary="Bidder 1" secondary="$500" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Bidder 2" secondary="$450" />
                </ListItem>
                {/* ... */}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </StyledAuctionContainer>
  );
}; }
