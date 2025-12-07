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

        expect(res.data.id).not.toBeNull
    })
})