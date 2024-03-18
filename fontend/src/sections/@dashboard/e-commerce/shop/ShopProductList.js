import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

const ShopProductList = ({ products, loading, searchQuery }) => {
  const filteredProducts = applySearchFilter(products, searchQuery);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {(loading ? [...Array(12)] : filteredProducts).map((product, index) =>
        product ? <ShopProductCard key={product.id} product={product} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
};

ShopProductList.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  searchQuery: PropTypes.string, // Add searchQuery prop
};

function applySearchFilter(products, searchQuery) {
  if (!searchQuery) {
    return products;
  }

  const searchTerm = searchQuery.toLowerCase();

  return products.filter((product) => {
    const productName = product.name.toLowerCase();
    return productName.includes(searchTerm);
  });
}

export default ShopProductList;
