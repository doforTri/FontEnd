import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme,styled } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import JoinPopup from './JoinPopUp';



// ----------------------------------------------------------------------

AuctionTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function AuctionTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { id, product, startDate, endDate, startPrice } = row;

  
  const [openJoinPopup, setOpenJoinPopup] = useState(false);


  const handleOpenJoinPopup = () => {
    setOpenJoinPopup(true);
    console.log('Joined auction:', row.id);
  };

  const handleCloseJoinPopup = () => {
    setOpenJoinPopup(false);
  };
  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover .join-text': {
      color :'red',
    },
    '& .join-text': {
    
      color: theme.palette.primary.main,
      transition: 'color 0.3s',
    },
    '&.Mui-focusVisible .join-text': {
      color: theme.palette.primary.dark,
    },
  }));

  return (
    <>
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={product.name} sx={{ mr: 2 }} src={product.images[0]}/>

        <Stack>
          <Typography variant="subtitle2" noWrap>
            {product.name}
          </Typography>

          <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            {product.category}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{fDate(startDate)}</TableCell>

      <TableCell align="left">{fDate(endDate)}</TableCell>

      <TableCell align="center">{fCurrency(startPrice)}</TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {product.category}
      </TableCell>
      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {product.status}
      </TableCell>
      <TableCell align="right">
        
        
        
      <StyledMenuItem onClick={handleOpenJoinPopup}>
  <Iconify icon={'eva:hand-outline'} color={'red'} />
  <span className="join-text">Join</span>
</StyledMenuItem>
        
        </TableCell>
    </TableRow>
      
     <JoinPopup
     open={openJoinPopup}
     onClose={handleCloseJoinPopup}
     onJoin={handleOpenJoinPopup}
     data={{
       imgUrl: product.images[0],
         id:product.id,
       name: product.name,
       startDate,
       endDate,
       stepPrice: startPrice,
       currentPrice: startPrice,
     }}
   />
   </>

  );
}
