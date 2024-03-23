import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
import { put, takeLatest, all } from 'redux-saga/effects';
import axios from '../../utils/axios';
import { dispatch } from '../store';

const initialState = {
  auctions: [],
  auction: null,
  isLoading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    // Load auctions
    loadAuctions: (state) => {
      state.isLoading = true;
    },
    loadAuctionsSuccess: (state, action) => {
      state.isLoading = false;
      state.auctions = action.payload;
    },
    loadAuctionsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get auction by id
    getAuction: (state, action) => {
      state.auction = null;
      state.isLoading = true;
    },
    getAuctionSuccess: (state, action) => {
      state.isLoading = false;
      state.auction = action.payload;
    },
    getAuctionsSuccess: (state, action) => {
      state.isLoading = false;
      state.auctions = action.payload;
    },

    // Load auction by id
    loadAuction: (state, action) => {
      state.auction = null;
      state.isLoading = true;
    },
    loadAuctionSuccess: (state, action) => {
      state.isLoading = false;
      state.auction = action.payload;
    },

    // Create auction
    createAuction: (state) => {
      state.isLoading = true;
    },
    createAuctionSuccess: (state, action) => {
      state.isLoading = false;
      state.auctions.push(action.payload);
    },

    // Update auction
    updateAuction: (state) => {
      state.isLoading = true;
    },
    updateAuctionSuccess: (state, action) => {
      state.isLoading = false;
      state.auction = action.payload;
    },
  },
});


// Reducer
export default auctionSlice.reducer;

// Action creators
export const {
  loadAuctions,
  loadAuctionsSuccess,
  loadAuctionsFailure,
  getAuction,
  getAuctionSuccess,
  getAuctionsSuccess,
  createAuction,
  createAuctionSuccess,
  updateAuction,
  updateAuctionSuccess,
} = auctionSlice.actions;

// Selectors
export const selectAuctions = (state) => state.auction.auctions;


// ------------------------------------
export function getAuctions() {
  return async () => {
    dispatch(auctionSlice.actions.loadAuctions());
    try {
      const response = await axios.post('http://47.129.6.242/auction/search', {
                keyword: "",
                currentPage: 0,
                size: 100,
                sortedField: ""
});
      console.log(response.data.data.contents)
      dispatch(auctionSlice.actions.loadAuctionsSuccess(response.data.data.contents));
    } catch (error) {
      dispatch(auctionSlice.actions.loadAuctionsFailure(error));
    }
  };
}

// // Sagas
// // API get all auction
// function* loadAuctionsAPI() {
//   try {
//     const response = yield axios.post('http://47.129.6.242/auction/search', {
//                 keyword: "",
//                 currentPage: 0,
//                 size: 100,
//                 sortedField: ""
// });
//     yield put(loadAuctionsSuccess(response.data));
//   } catch (error) {
//     yield put(loadAuctionsFailure(error));
//   }
// }

// function* getAuctionsSuccessAPI(action) {
//   try {
//     const response = yield axios.get('/auctions/name', {
//       params: { name: action.payload },
//     });
//     yield put(getAuctionsSuccess(response.data.data));
//   } catch (error) {
//     console.error(error);
//     yield put(loadAuctionsFailure(error));
//   }
// }

// function* watchLoadAuctions() {
//   yield takeLatest(loadAuctions.type, loadAuctionsAPI);
// }

// function* watchGetAuctionsSuccess() {
//   yield takeLatest(getAuctionsSuccess.type, getAuctionsSuccessAPI);
// }

// export function* rootSaga() {
//   yield all([watchLoadAuctions(), watchGetAuctionsSuccess()]);
// }

