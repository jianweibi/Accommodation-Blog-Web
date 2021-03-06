const express = require("express");
const router = express.Router();
const myDB = require("../db/MongoDB.js");
const secret = require("./crypt.js");
/*const alert = require("alert");

let signinflag = false;
let signupflag = false;*/
router.post("/test/signin", async function (req, res) {
	//if(req.body.userName === "") return;
	const pw = secret.encrypt(req.body.passWord);
	const body = {
		"userName": req.body.userName,
		"passWord": pw
	};
	let signinflag = await myDB.signin(body);
	console.log("flag is here: ", signinflag);
	let textcon;
	if(signinflag) {
		console.log(req.body, "Sign in successful");
		textcon = "Sign in successful";
		// 进入到登录成功的页面
		//res.redirect("/post.html");

	} else {
		console.log(req.body, "Wrong username or password");
		// 进入到登录失败的页面
		textcon = "Wrong username or password";
		//alert("Wrong user name or password");
		//res.redirect("/sign_in.html");
	}
	res.send({flag: signinflag, text: textcon});

});

router.post("/test/signup", async function (req, res) {
	//if(req.body.userName === "") return;
	//if(req.body.passWord === "") return;
	//if(req.body.passWord != req.body.passWord2) return;
	//console.log("what is the body here??   ", req.body);
	let textcon;
	const pw = secret.encrypt(req.body.passWord);
	const body = {
		"userName": req.body.userName,
		"passWord": pw
	};
	let signupflag = await myDB.signup(body);
	console.log("what is this flag here???", signupflag);
	if(signupflag){
		console.log(req.body, "Sign up successful");
		textcon = "Sign up successful";
		//res.send({flag: true, text: "Wtf"});
		//res.redirect("/sign_in.html");
	}else{
		console.log(req.body, "User name is already taken");
		textcon = "User name is already taken";
		//alert("User name is already taken");
		//res.send({flag: false, text: "User name is already taken"});
		//res.redirect("/sign_up.html");
	}
	res.send({flag: signupflag, text: textcon});
});

/*router.post("/getSigninFlag", async (req, res) =>{
	let textCont = "";
	if(signinflag) textCont = "Sign in Successful";
	else textCont = "Wrong User name or Password";
	res.send({flag: signinflag, text: textCont});
});

router.post("/getSignupFlag", async (req, res) =>{
	let textCont = "";
	if(signupflag) textCont = "Sign up Successful";
	else textCont = "User name is already taken";
	res.send({flag: signupflag, text: textCont});
});*/



/* ********************************************************************* */


router.get("/getPosts", async (req, res) => {
	try {
		const posts = await myDB.getPosts();
		res.send({posts: posts});
	} catch (e) {
		console.log("Error", e);
		res.status(400).send({ err: e });
	}
});

router.post("/deletePost", async (req, res) => {
	console.log("Delete Post", req.body);
	try {
		const post = req.body;
		const dbRes = await myDB.deletePost(post);
		res.send({ done: dbRes });
	} catch (e) {
		console.log("Error", e);
		res.status(400).send({ err: e });
	}
});

router.post("/createPost", async (req, res) => {
	console.log("Create Post", req.body);
	try {
		const posts = req.body;
		await myDB.createPost(posts);
		res.redirect("/post.html");
	} catch (e) {
		console.log("Error", e);
		res.status(400).send({ err: e });
	}
});

module.exports = router;