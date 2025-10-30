import apiClient from './apiClient';

const isProduction = process.env.NODE_ENV === 'production';
const COMPANIES_ENDPOINT = isProduction ? '/db.json' : '/companies';

export const fetchCompanies = async (params = {}) => {
  if (!isProduction) {
    return apiClient.get(COMPANIES_ENDPOINT, { params });
  }

  const { data } = await apiClient.get(COMPANIES_ENDPOINT);
  let companies = data.companies;

  // Manual filtering
  if (params.q) {
    companies = companies.filter((company) =>
      company.name.toLowerCase().includes(params.q.toLowerCase())
    );
  }
  if (params.industry && params.industry.length > 0) {
    companies = companies.filter((company) =>
      params.industry.includes(company.industry)
    );
  }
  if (params.location && params.location.length > 0) {
    companies = companies.filter((company) =>
      params.location.includes(company.location)
    );
  }

  // Manual sorting
  if (params._sort) {
    companies.sort((a, b) => {
      if (a[params._sort] < b[params._sort]) {
        return params._order === 'asc' ? -1 : 1;
      }
      if (a[params._sort] > b[params._sort]) {
        return params._order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const totalCount = companies.length;

  // Manual pagination
  if (params._page) {
    const start = (params._page - 1) * params._limit;
    const end = start + params._limit;
    companies = companies.slice(start, end);
  }

  return { data: companies, headers: { 'x-total-count': totalCount } };
};

export const fetchAllCompanies = async () => {
  const { data } = await apiClient.get(COMPANIES_ENDPOINT);
  return { data: data.companies };
}
