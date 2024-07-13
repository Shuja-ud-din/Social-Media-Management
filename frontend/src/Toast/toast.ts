import { Bounce, toast } from 'react-toastify'

export const topCenterToast = (status: string, message: string) => {
  const toastConfig: any = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  }
  if (status === 'success') {
    return toast.success(message, toastConfig)
  } else if (status === 'error') {
    return toast.error(message, toastConfig)
  }
}
