import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container, Typography, Stack, Pagination, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts } from '../../redux/slices/product';
// routes
import { PATH_HOME } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { FormProvider } from '../../components/hook-form';
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopProductSearch,
} from '../../sections/@dashboard/e-commerce/shop';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const { themeStretch } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);

  // ...

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters, currentPage);

  const defaultValues = {
    gender: filters.gender,
    category: filters.category,
    colors: filters.colors,
    priceRange: filters.priceRange,
    rating: filters.rating,
    size: filters.size,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault = !values.priceRange && values.category === 'All';

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveCategory = () => {
    setValue('category', 'All');
  };
  const handleRemoveSize = () => {
    setValue('size', '');
  };

  const handleSearch = (query) => {
    setCurrentPage(1); // Reset currentPage về 1 khi thực hiện tìm kiếm
    setSearchQuery(query);
    // Gọi hàm filterProducts hoặc thực hiện các bước xử lý tìm kiếm
    // dispatch(filterProducts(values));
  };
  const handleRemovePrice = () => {
    setValue('priceRange', '');
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };

  return (
    <Page title="Ecommerce: Shop">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ paddingTop: 15, paddingBottom: 10 }}>
        <HeaderBreadcrumbs heading="Shop" links={[{ name: 'Home', href: PATH_HOME.root }, { name: 'Shop' }]} />

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <ShopProductSearch setSearchQuery={handleSearch} />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <FormProvider methods={methods}>
              <ShopFilterSidebar
                onResetAll={handleResetFilter}
                isOpen={openFilter}
                onOpen={handleOpenFilter}
                onClose={handleCloseFilter}
              />
            </FormProvider>

            <ShopProductSort />
          </Stack>
        </Stack>

        <Stack sx={{ mb: 3 }}>
          {!isDefault && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>{filteredProducts.length}</strong>
                &nbsp;Products found
              </Typography>

              <ShopTagFiltered
                filters={filters}
                isShowReset={!isDefault && !openFilter}
                onRemoveCategory={handleRemoveCategory}
                onRemoveSize={handleRemoveSize}
                onRemovePrice={handleRemovePrice}
                onResetAll={handleResetFilter}
              />
            </>
          )}
        </Stack>

        <ShopProductList
          products={filteredProducts}
          loading={!products.length && isDefault}
          searchQuery={searchQuery}
          currentPage={currentPage}
        />
        <CartWidget />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredProducts.length / 4) + 3}
            size="large"
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters, currentPage, searchQuery) {
  // SORT BY
  switch (sortBy) {
    case 'featured':
      products = [...products].sort((a, b) => b.sold - a.sold);
      break;
    case 'newest':
      products = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'priceDesc':
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case 'priceAsc':
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    default:
      // Default sorting or any other sorting logic

      break;
  }

  // FILTER PRODUCTS
  if (filters.category !== 'All') {
    products = products.filter((product) => product.category === filters.category);
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === 'below') {
        return product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  if (filters.size && filters.size.length > 0) {
    products = products.filter((product) => filters.size.includes(product.size));
  
    return products;
  }
  if (searchQuery) {
    return products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  // Phân trang nếu không có searchQuery
  const productsPerPage = 4;
  const startIdx = (currentPage - 1) * productsPerPage;
  const endIdx = startIdx + productsPerPage;
  return products.slice(startIdx, endIdx);
}
