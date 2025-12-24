import { Router } from "express";
import { db } from "db/client"
import { AuthInput } from "../validator/user.validator";
import bcrypt from 'bcrypt'
import { jwtAuth } from "../utils/jwtAuth";
import { authProxy } from "../proxy";

const route = Router()

route.post("/user/sign-up", async (req, res) => {
    const data = AuthInput.safeParse(req.body)

    if (!data.success) {
        res.status(400).send("Error signing up!");
        return;
    }

    try {
        const hashedPswd = await bcrypt.hash(data.data.password, 10);

        let newUser = await db.user.create({
            data: {
                email: data.data.email,
                password: hashedPswd
            }
        })

        res.status(201).json({
            id: newUser.id
        })
    } catch (err: any) {
        console.log(err)
        if (err.code == "P2002") {
            return res.status(409).send("Email already exists!")
        }
        res.status(500).send("Server Err!");
    }
})

route.post("/user/sign-in", async (req, res) => {
    const data = AuthInput.safeParse(req.body)

    if (!data.success) {
        return res.status(422).json({ error: "Invalid input" })
    }

    let user = await db.user.findFirst({
        where: {
            email: data.data.email
        }
    })

    if (!user || !user.password) {
        res.status(401).send("Email or Password is wrong!");
        return;
    }

    const valid = await bcrypt.compare(data.data.password, user.password)

    if (!valid) {
        res.status(401).send("Email or Password is wrong!");
        return;
    }

    jwtAuth({ sub: user.id, res })

    return res.status(201).json(
        {
            id: user.id,
            message: "User Logged In Successfully!"
        }
    )
})

route.get("/user/me", authProxy, async (req, res) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                email: true
            }
        })

        if (!user) {
            res.status(404).send("User not found!")
        }

        return res.json(user)
    } catch (err) {
        return res.status(500).send("Server Err!")
    }
})

route.post("/user/sign-out", (req, res) => {
    res.clearCookie("token")
    return res.status(200).send("Signed out successfully!")
})

export default route