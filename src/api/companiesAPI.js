import apiClient from './apiClient';

const isProduction = process.env.NODE_ENV === 'production';
const COMPANIES_ENDPOINT = isProduction ? '/db.json' : '/companies';

/**
 * Fetches companies with optional filtering, sorting, and pagination.
 * In production, this function fetches a static JSON file and manually
 * applies the query parameters. In development, it queries a JSON Server API.
 * @param {object} params - The query parameters.
 * @returns {Promise<{data: object[], headers: {'x-total-count': number}}>}
 */
export const fetchCompanies = async (params = {}) => {
  if (!isProduction) {
    const apiParams = { ...params };
    if (apiParams.foundedYear) {
      apiParams.founded_gte = apiParams.foundedYear[0];
      apiParams.founded_lte = apiParams.foundedYear[1];
      delete apiParams.foundedYear;
    }
    return apiClient.get(COMPANIES_ENDPOINT, { params: apiParams });
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
  if (params.foundedYear) {
    companies = companies.filter(
      (company) =>
        company.founded >= params.foundedYear[0] &&
        company.founded <= params.foundedYear[1]
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

/**
 * Fetches all companies without any filtering, sorting, or pagination.
 * This is used to populate the filter dropdowns.
 * @returns {Promise<{data: object[]}>}
 */
export const fetchAllCompanies = async () => {
  const { data } = await apiClient.get(COMPANIES_ENDPOINT);
  if (isProduction) {
    return { data: data.companies };
  }
  return { data };
}
