/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios'

const axios = Axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:3001'}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: unknown = error.response.data.message
    if (error.response.data.errors) {
      const errs = error.response.data.errors

      error.message = Object.keys(errs)
        .slice(0, 1)
        .map((e) => {
          return errs[e].map((ee: any) => ee).join('\n')
        })
        .join('\n')
    } else if (typeof message === 'string') {
      error.message = message
    } else if (typeof message === 'object') {
      error.message = Object.keys(message as any)
        // @ts-expect-error gapapa gan error
        .map((m: any) => message[m])
        .join('\n')
    }

    throw error
  }
)

export { axios }
