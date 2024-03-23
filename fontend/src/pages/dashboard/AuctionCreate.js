import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAuctions } from '../../redux/slices/auctions';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AuctionCreateForm from '../../sections/@dashboard/auction/AuctionNewEditForm';

// ----------------------------------------------------------------------

export default function AuctionCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {id} = useParams();
  const { auctions } = useSelector((state) => state.auction);
  const [auction, setAuction] = useState(null)
  const isEdit = pathname.includes('edit');


  useEffect(() => {
    dispatch(getAuctions());
  }, [dispatch]);

  useEffect(() => {
    if (auctions) {
      console.log("Here")
      // Chỉ cập nhật auction state khi auctions đã có dữ liệu
      const currentAuction = auctions.find((auction) => auction.id === id);
      setAuction(currentAuction);
    }
  }, [auctions, id]);

  return (
    <Page title="Dashboard: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new auction' : 'Edit auction'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Auctions',
              href: PATH_DASHBOARD.general.auction,
            },
            { name: !isEdit ? 'New auction' : auction.id },
          ]}
        />

      <AuctionCreateForm isEdit={isEdit} currentAuction={auction} />
      </Container>
    </Page>
  );
}