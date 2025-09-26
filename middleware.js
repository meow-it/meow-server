exports.cors = (req, res, next) => {
	let allowedOrigins = [
		"http://localhost:3003",
		"http://localhost:3000",
		"https://meowit.netlify.app",
		"https://meowit.pages.dev",
		"https://meowit.cybernode.dev"
	]
	let origin = req.headers.origin

	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin)
	} else
		console.log({
			origin,
			message: "Origin not allowed",
			status: "nope",
			method: req.method,
		})

	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE",
		"OPTIONS"
	)
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Credentials", true)
	res.setHeader("Vary", "Origin")
	return next()
}
