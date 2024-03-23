import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useContext, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';

// utils
import axios from '../../../utils/axios';
import { AuthContext } from '../../../contexts/JWTContext';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

// const GENDER_OPTION = ['Men', 'Women', 'Kids'];

const CATEGORY_OPTION = [
  {
    group: 'Mutant Orchid',
    classify: [
      '5 cánh trắng',
      'Shenzhen Nongke',
      'Odontoglossum',
      'Giant Ansellia',
      'bướm Hochstetter',
      // thêm các classify khác ở đây
    ],
  },
];

// const TAGS_OPTION = [
//   'Toy Story 3',
//   'Logan',
//   'Full Metal Jacket',
//   'Dangal',
//   'The Sting',
//   '2001: A Space Odyssey',
//   "Singin' in the Rain",
//   'Toy Story',
//   'Bicycle Thieves',
//   'The Kid',
//   'Inglourious Basterds',
//   'Snatch',
//   '3 Idiots',
// ];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

AuctionNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAuction: PropTypes.object,
};

export default function AuctionNewEditForm({ isEdit, currentAuction }) {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [curPros, setCurPros] = useState([]);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length) {
      setCurPros(products);
    }
  }, [products]);

  console.log(products);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    available: Yup.number().min(1, 'Availability should not be less than 1').required('available is required'),
    colors: Yup.array().of(Yup.string()).required('Colors are required'),
    sizes: Yup.array().of(Yup.string()).required('Sizes are required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentAuction?.name || '',
      description: currentAuction?.description || '',
      images: currentAuction?.images || [],
      code: currentAuction?.code || '',
      sku: currentAuction?.sku || '',
      price: currentAuction?.price || 0,
      priceSale: currentAuction?.priceSale || 0,
      // tags: currentAuction?.tags || [TAGS_OPTION[0]],
      inStock: true,
      taxes: true,
      // gender: currentAuction?.gender || GENDER_OPTION[2],
      category: currentAuction?.category || CATEGORY_OPTION[0].classify[0],
      available: currentAuction?.available || 1,
      colors: currentAuction?.colors || [],
      sizes: currentAuction?.sizes || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAuction]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentAuction) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAuction]);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', getValues('name').trim());
      formData.append('price', getValues('price'));
      const products = getValues('products');
      products.forEach((product) => {
        formData.append('products', product);
      });

      getValues('images').forEach((file) => {
        if (typeof file === 'string') return;
        formData.append('files', file);
      });

      let response;
      if (isEdit) {
        // Call the API to update the product
        response = await axios.put(`/product/${currentAuction.id}`, formData);
      } else {
        // Call the API to create a new product
        response = await axios.post('/product/', formData);
      }
      console.log(JSON.stringify(response.data));

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Select defaultValue={10} id="named-select" name="products">
                {curPros.map((option) => (
                  <MenuItem value={option.id}>{option.id} - {option.name} - {option.category}</MenuItem>
                ))}
              </Select>

              <DatePicker
                label="Start Date"
                name="startDate"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                name="endDate"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />

              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="startPrice"
                  label="Start Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="stepPrice"
                  label="Step Price"
                  placeholder="0.00"
                  value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
