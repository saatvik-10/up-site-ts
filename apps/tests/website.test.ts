import { describe, it, expect, beforeAll } from 'bun:test'
import axios from 'axios'
import { BASE_URL } from './config/utils'
import { mockUser } from './config/lib'

describe("Website Creation", () => {
    let userId: string, authCookie: string

    beforeAll(async () => {
        const data = await mockUser();
        userId = data.id
        authCookie = data.cookie
    })

    it("Error creating website without a url and user id", async () => {
        try {
            await axios.post(`${BASE_URL}/api/website`, {}, {
                headers: {
                    Cookie: authCookie
                }
            })

            expect(false).toBe(true)
        } catch (err) {
            console.log(err)
        }
    })

    it("Error creating website without a cookie", async () => {
        try {
            await axios.post(`${BASE_URL}/api/website`, {
                user_id: userId,
                url: "https://itsaatvik.dev"
            })

            expect(false, "Cookie is missing")
        } catch (err) {
            console.log(err)
        }
    })

    it("Success creating website with a url", async () => {
        const res = await axios.post(`${BASE_URL}/api/website`, {
            user_id: userId,
            url: "https://itsaatvik.dev"
        }, {
            headers: {
                Cookie: authCookie
            }
        })

        expect(res.data.id).not.toBeNull()
    })
})

describe("Website fetching", () => {
    let userId1: string, authCookie1: string
    let userId2: string, authCookie2: string

    beforeAll(async () => {
        const data1 = await mockUser();
        userId1 = data1.id
        authCookie1 = data1.cookie

        const data2 = await mockUser();
        userId2 = data2.id
        authCookie2 = data2.cookie
    })

    it("Fetching user's website successfully", async () => {
        const res1 = await axios.post(`${BASE_URL}/api/website`, {
            user_id: userId1,
            url: "https://itsaatvik.dev"
        }, {
            headers: {
                Cookie: authCookie1
            }
        })

        const getRes1 = await axios.get(`${BASE_URL}/api/status/${res1.data.id}`, {
            headers: {
                Cookie: authCookie1
            }
        })

        expect(getRes1.data.id).toBe(res1.data.id)
        expect(getRes1.data.user_id).toBe(userId1)
    })

    it.todo("Err while fetching other user's website", async () => {
        const res1 = await axios.post(`${BASE_URL}/api/website`, {
            user_id: userId1,
            url: "https://itsaatvik.dev"
        }, {
            headers: {
                Cookie: authCookie1
            }
        })

        try {
            await axios.get(`${BASE_URL}/api/status/${res1.data.id}`, {
                headers: {
                    Cookie: authCookie2
                }
            })

            expect(false, "Unable to access other user's website")
        } catch (err) {
            console.log(err)
        }
    })
})