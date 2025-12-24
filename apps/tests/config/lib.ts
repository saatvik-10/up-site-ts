import axios from 'axios'
import { BASE_URL, RAND_USERNAME } from './utils'

export async function mockUser(): Promise<{ id: string, cookie: string }> {
    const signedUpUser = await axios.post(`${BASE_URL}/api/user/sign-up`, {
        email: RAND_USERNAME,
        password: "password"
    })

    const signedInUser = await axios.post(`${BASE_URL}/api/user/sign-in`, {
        email: RAND_USERNAME,
        password: "password"
    }, {
        withCredentials: true
    })

    const cookie = signedInUser.headers['set-cookie']?.[0] || ""

    return {
        id: signedUpUser.data.id,
        cookie
    }
}