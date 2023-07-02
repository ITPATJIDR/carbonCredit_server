const qr = require("qrcode")

const genQrcode = async (url) => {
	return await qr.toDataURL(url)
}

module.exports = genQrcode 
