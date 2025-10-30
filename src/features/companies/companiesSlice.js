import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCompanies, fetchAllCompanies } from '../../api/companiesAPI';

export const loadCompanies = createAsyncThunk(
  'companies/loadCompanies',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchCompanies(params);
      return { data: response.data, totalCount: response.headers['x-total-count'], page: params._page };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadAllCompanies = createAsyncThunk(
  'companies/loadAllCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllCompanies();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  allData: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  totalCount: 0,
  hasMore: true,
  selectedCompany: null,
  isModalOpen: false,
};

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    resetCompanies: (state) => {
      state.data = [];
      state.hasMore = true;
    },
    openCompanyModal: (state, action) => {
      state.selectedCompany = action.payload;
      state.isModalOpen = true;
    },
    closeCompanyModal: (state) => {
      state.selectedCompany = null;
      state.isModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCompanies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.data = action.payload.data;
        } else {
          state.data = [...state.data, ...action.payload.data];
        }
        state.totalCount = parseInt(action.payload.totalCount, 10);
        state.hasMore = state.data.length < state.totalCount;
      })
      .addCase(loadCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadAllCompanies.fulfilled, (state, action) => {
        state.allData = action.payload;
      });
  },
});

export const { resetCompanies, openCompanyModal, closeCompanyModal } = companiesSlice.actions;

export const selectCompanies = (state) => state.companies.data;
export const selectAllCompanies = (state) => state.companies.allData;
export const selectCompaniesStatus = (state) => state.companies.status;
export const selectCompaniesError = (state) => state.companies.error;
export const selectTotalCompanies = (state) => state.companies.totalCount;
export const selectHasMoreCompanies = (state) => state.companies.hasMore;
export const selectSelectedCompany = (state) => state.companies.selectedCompany;
export const selectIsModalOpen = (state) => state.companies.isModalOpen;

export default companiesSlice.reducer;
