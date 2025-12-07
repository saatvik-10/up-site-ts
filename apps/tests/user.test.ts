import { describe, expect, it } from 'bun:test'
import axios from 'axios'

let BASE_URL = "http://localhost:8080"
let RAND_USERNAME = Math.random().toString();

describe("User Signup", () => {
    it("Error signing up if incorrect input", async () => {
        try {
            await axios.post(`${BASE_URL}/api/user/sign-up`, {
                username: "sm"
            })

            expect(false, "Statement should be unreachable!")
        } catch (err) {
            console.log(err)
        }
    })

    it("Success signing up if correct input", async () => {
        try {
            let res = await axios.post(`${BASE_URL}/api/user/sign-up`, {
                username: "sm",
                password: "sm"
            })
    
            expect(res.data.id).not.toBeNull()
        } catch (err) {
            console.log(err)
        }
    })
})

describe("User Signin", () => {
    it("Error signing in if incorrect input", async () => {
        try {
            await axios.post(`${BASE_URL}/user/sign-in`, {
                username: "sm",
                password: "123"
            })

            expect(false, "Statement should be unreachable!")
        } catch (err) {
            console.log(err)
        }
    })

    it("Success signing in if correct input", async () => {
        let res = await axios.post(`${BASE_URL}/user/sign-in`, {
            username: "sm",
            password: "sm"
        })

        expect(res.data.id).toBeDefined()
        expect(res.data.jwt).toBeDefined()
    })
})