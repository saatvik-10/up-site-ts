import { describe, it, expect } from 'bun:test'
import axios from 'axios'

let BASE_URL = "http://localhost:8080"

describe("Website Creation", () => {
    it("Error creating website without a url", async () => {
        try {
            await axios.post(`${BASE_URL}/api/website`, {})

            expect(false, "Website got created but it shouldn't")
        } catch (err) {
            console.log(err)
        }
    })

    it("Success creating website with a url", async () => {
        const res = await axios.post(`${BASE_URL}/api/website`, {
            url: "https://itsaatvik.dev"
        })

        expect(res.data.id).not.toBeNull

    })
})