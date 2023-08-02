const Template_1 = (name, offset, tree) => {
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
			{ text: name, fontSize: 30, font: "Anastasia",width:'auto', color:"#c79c47", margin: [350, 220, 100, 0] },
			{ text: `${offset} Kg of CO2e Emissions`,font:"Poppins", fontSize: 13, margin: [435, 40, 100, 0] },
			{ qr:`https://greenie-app.azurewebsites.net/publicprofile/${tree}`, margin: [10, -40, 100, 0]}
		],
		defaultStyle: {
			font: 'Roboto'
		}
	}
	return carbonCertificate
}
module.exports = Template_1