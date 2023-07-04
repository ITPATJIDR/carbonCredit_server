const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const murmurhash3_x86_32 = require("number-generator/lib/murmurhash3_x86_32");
const connecting = require('./database')
const _ = require("lodash")


const jwtGenerate = (user) => {
	const accessToken = jwt.sign(
		{name:user.username, id: user.id},
		process.env.ACCESS_TOKEN,
		{ expiresIn: "3m", algorithm: "HS256" }
	)
	return accessToken
}

const jwtRefreshToken = (user) => {
	const refreshToken = jwt.sign(
		{name:user.email, id: user.id},
		process.env.REFRESH_TOKEN,
		{ expiresIn: "1d", algorithm: "HS256" }
	)
	return refreshToken
}

const refreshTokenVerify = async (token) => {
	try {
		const verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN);
		const checkUser_sql = "SELECT * FROM users WHERE id = ?";
		const checkUser_data = [verifyToken.id];

		const checkStatus = await new Promise((resolve, reject) => {
			connecting.query(checkUser_sql, checkUser_data, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(!_.isEmpty(result[0]));
				}
			});
		});

		return checkStatus;
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return false;
		} else {
			return false;
		}
	}
};


const hashPassword = async (password) => {
	const hash = await bcrypt.genSalt(10)
			.then( async (salt) =>{
				return await bcrypt.hash(password, salt)
			})
			.catch(err => {
				console.log(err.message)
			})
	return hash
}

const comparePassword = async (password, hashPassword) =>{
	const compare = await  bcrypt.compare(password, hashPassword)
			.then((res) =>{
				return res
			})
			.catch((err) =>{
				console.log(err.message)
			})
	return compare
}


const genNumber = () => {
	return murmurhash3_x86_32(String(new Date()))
}

module.exports = {
	jwtGenerate,
	jwtRefreshToken,
	hashPassword,
	comparePassword,
	genNumber,
	refreshTokenVerify
}
