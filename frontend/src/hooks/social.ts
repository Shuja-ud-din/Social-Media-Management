import {  useQuery } from '@tanstack/react-query'
import { getGoogleUrl, getTiktokUrl, getTwitterUrl } from '~/services/social'

export  const useGetGoogleUrl = () => {

  const { data: url , error, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['getGoogleUrl'],
    queryFn: getGoogleUrl,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return { url, error, isError, isLoading, isSuccess, isFetching};
}

export  const useGetTwitterUrl = (fetch: boolean) => {

  const { data: url , error, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['getTwitterUrl'],
    queryFn: getTwitterUrl,
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled : fetch
  });

  return { url, error, isError, isLoading, isSuccess, isFetching};
}

export  const useGetTiktokUrl = () => {

  const { data: url , error, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['getTiktokUrl'],
    queryFn: getTiktokUrl,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return { url, error, isError, isLoading, isSuccess, isFetching};
}