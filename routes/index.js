const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");


const categoryRoute = require("./category");
const testRoute = require("./test");
const bannerRoute = require("./banner");
const couponRoute = require("./coupon");
const inquiryRoute = require("./inquiry");
const settingRoute = require("./setting");
const userRoute = require("./user");
const authRoute = require("./auth");
const hebitRoute = require("./hebit");
const healthRiskRoute = require("./healthRisk");
const mediaRoute = require("./media");
const bookingRoute = require("./booking");
const menuRoute = require("./menu");
const adminRoleRoute = require("./adminRole");
const adminRoute = require("./admin");
const labRoute = require("./lab");
const careerRoute = require("./career");
const landingPageRoute = require("./landingPage");
const covidRoute = require("./covid");
const newsRoute = require("./news");
const cityRoute = require("./city");
const reasearchRoute = require("./reasearch");
const awardRoute = require("./awards");
const teamRoute = require("./team");
const prescriptionRoute = require("./prescription");
const faqRoute = require("./faq");
const contactRoute = require("./contact");
const appointmentRoute = require("./appointment");
const biowasteRoute = require("./biowaste");
const landing_subsRoute = require("./landing_subs");
const feedbackRoute = require("./newfeed");
const corporateRoute = require("./corporate");
const franchiseRoute = require("./franchise");
const carrer_formRoute = require("./carrerForm");




router.get("/", (req, res) => {
  res.send("Wel-Come CityXray Admin");
});

router.use("/auth", authRoute);
router.use("/category",auth, categoryRoute);
router.use("/test",auth, testRoute);
router.use("/banner",auth, bannerRoute);
router.use("/coupon",auth, couponRoute);
router.use("/inquiry",auth, inquiryRoute);
router.use("/setting",auth, settingRoute);
router.use("/user",auth, userRoute);
router.use("/hebit",auth, hebitRoute);
router.use("/healthRisk",auth, healthRiskRoute);
router.use("/media",auth, mediaRoute);
router.use("/booking",auth, bookingRoute);
router.use("/menu",auth, menuRoute);
router.use("/adminRole",auth, adminRoleRoute);
router.use("/admin",auth, adminRoute);
router.use("/lab-detail",auth, labRoute);
router.use("/career",auth, careerRoute);
router.use("/landingData",auth, landingPageRoute);
router.use("/covidData",auth,covidRoute);
router.use("/news",auth, newsRoute);
router.use("/city",auth,cityRoute);
router.use("/reasearch",auth,reasearchRoute);
router.use("/award",auth, awardRoute);
router.use("/team",auth,teamRoute);
router.use("/prescription",auth,prescriptionRoute);
router.use("/faq",auth,faqRoute);
router.use("/contact",auth,contactRoute);
router.use("/appointment",auth,appointmentRoute);
router.use("/biowaste",auth,biowasteRoute);
router.use("/subscriber",auth,landing_subsRoute);
router.use("/feeds",auth,feedbackRoute);
router.use("/corporate",auth,corporateRoute);
router.use("/franchise",auth,franchiseRoute);
router.use("/carrer-form",auth,carrer_formRoute);




module.exports = router;
