import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const cryptoApiHeaders = {
  'X-RapidAPI-Key': '8fa07117b6msh5f55b6ab72aef6ep165543jsn4d2f91b221b1',
  'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
}

const baseUrl = 'https://coinranking1.p.rapidapi.com'

const createRequest = (url) => ({ url, headers: cryptoApiHeaders })


export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins?limit=${count}`)
    }),
    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coin/${coinId}`) 
    }),
    getExchanges: builder.query({
      query: () => createRequest('/exchanges'),
    })
  }) 
})



export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetExchangesQuery
} = cryptoApi;