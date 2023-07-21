const Template_1 = (name, offset) => {
	const carbonCertificate = {
		pageSize: { width: 842, height: 595 }, 
		pageOrientation: 'landscape', 
		background: [
			{
				image:"assets/images/carbonCert.png",
				width: 842, 
				height: 595, 
				absolutePosition: { x: 0, y: 0 },
			}
		],
		content: [
			{ text: name, fontSize: 24, margin: [445, 250, 100, 0] },
			{ text: offset, fontSize: 24, margin: [445, 100, 100, 0] },
		],
		defaultStyle: {
			font: 'Roboto'
		}
	}
	return carbonCertificate
}
module.exports = Template_1