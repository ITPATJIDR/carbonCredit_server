const connecting = require('../utils/database')
const _ = require('lodash')
const {jwtGenerate, jwtRefreshToken, hashPassword, comparePassword, refreshTokenVerify} = require('../utils/encode')


const userCtrl = {
	register: async (req, res, next) => {
		try {
			const { email, name, surname, password } = req.body;
			if (email && name && surname && password) {
				const checkUsernameSql = 'SELECT * FROM users WHERE email = ?';
				const checkUsernameData = [email];

				await connecting.query(checkUsernameSql, checkUsernameData, async (err, result) => {
					if (err) {
						res.status(400).json({ status: 400, message: "Email already exists" });
					}
					if (!_.isEmpty(result[0])) {
						res.status(400).json({ status: 400, message: "Email already exists" });
					} else {
						const newPassword = await hashPassword(password);
						const insertSql = 'INSERT INTO users (email, name, surname, password) VALUES (?, ?, ?, ?)';
						const insertData = [email, name, surname, newPassword];

						await connecting.query(insertSql, insertData);

						res.status(200).json({ status: 200, message: "Registration successful" });
					}
				});
			}else{
				res.status(400).json({ status: 400, message: "Please fill form Register" });
			}
		} catch (err) {
			console.error(err);
			res.status(500).json({ status: 500, message: "Internal server error" });
		}
	},
	login: async (req, res, next) => {
		try {
			const { email, password } = req.body
			const sql_checkUser = 'SELECT * FROM users WHERE email = ?'
			const data = [email]
			await connecting.query(sql_checkUser, data, async (err, result) => {
				if (err) {
					res.status(200).json({ status: 400, message: "username or password is incorrect" })
				} else {
					if (_.isEmpty(result[0])) {
						res.status(200).json({ status: 400, message: "username or password is incorrect" })
					} else {
						const hashPassword = await result[0].password
						const checkPassword = await comparePassword(password, hashPassword)
						if (checkPassword) {
							const refreshtoken = await jwtRefreshToken(result[0])
							res.cookie("refreshtoken", refreshtoken, {
								path: "/user/getRefreshToken",
								maxAge: 8 * 24 * 60 * 60 * 1000, // 7 days
								httpOnly: true,
								secure: true, 
								sameSite: "none" 
							})
							res.status(201).json({ status: 200, message: "Login Success" })
						} else {
							res.status(201).json({ status: 400, message: "username or password is incorrect" })
						}
					}
				}
			})
		} catch (err) {
			console.log(err)
			res.status(200).json({ status: 500, message: "Internal server error" })
		}
	},
	logout: async (req, res, next) => {
		try {
			res.clearCookie("refreshtoken", { path: "/user/getRefreshToken" })
			res.status(200).json({ status: 200, message: "Logout" })
		} catch (err) {
			res.status(200).json({ status: 500, message: "Internal server error" })
		}
	},
	getRefreshToken: async (req, res, next) => {
		try {
			const refreshtoken = req.cookies["refreshtoken"]
			if (refreshtoken) {
				if (await refreshTokenVerify(refreshtoken)) {
					res.status(200).json({ status: 200, refreshtoken: refreshtoken })
				} else {
					res.status(200).json({ status: 403, message: "Please Login" })
				}
			} else {
				res.status(200).json({ status: 403, message: "Please Login" })
			}
		} catch (err) {
			console.log(err)
			res.status(200).json({ status: 500, message: "Internal server error" })
		}
	}
}

module.exports = userCtrl 