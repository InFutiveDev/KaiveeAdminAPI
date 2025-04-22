const axios = require("axios");
const _ = require("underscore");
const moment = require("moment");
const testModel = require("../models/test");
var parseString = require('xml2js').parseString;

const { handleException } = require("../helpers/exception");
const Response = require("../helpers/response");
const Constant = require("../helpers/constant");

const testUpdate = () => {
    return new Promise(async (resolve, reject) => {
        console.log('Test Update Prosess Start....');
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://115.246.78.204/zenhealth/Design/Lab/Services/MobileAppInfo.asmx/ItemMaster_RateType?AccessToken=563d4b4f086a62c099023abd84cfb1f9&RateTypeID=78',
            headers: {}
        };

        axios.request(config)
            .then(async (response) => {

                parseString(response.data, async function (err, result) {
                    let jsonData = JSON.parse(result.string._);
                    // console.log(jsonData);
                    for (let i = 0; i < jsonData.length; i++) {
                        // console.log('response.ItemID',jsonData[i].TestName);

                        let testNameForURL = jsonData[i].TestName.replace(/[^a-zA-Z0-9 ]/g, '');
                        let finalURL = testNameForURL.replace(/ /g, "-");
                        let UpdateData = await testModel.findOne({ code: jsonData[i].ItemID });
                        if (UpdateData) {
                            let testCode = null;
                            let testName = null;
                            let testOfferPrice = null;
                            let testDepartmentName = null;
                            if (UpdateData.itdose_code_status == true) {
                                testCode = jsonData[i].ItemID
                            } else {
                                testCode = UpdateData.code
                            }

                            if (UpdateData.itdose_test_name_status == true) {
                                testName = jsonData[i].TestName
                            } else {
                                testName = UpdateData.test_name;
                            }

                            if (UpdateData.itdose_offer_price_status == true) {
                                testOfferPrice = jsonData[i].Rate
                            } else {
                                testOfferPrice = UpdateData.offer_price
                            }

                            if (UpdateData.itdose_department_status == true) {
                                testDepartmentName = jsonData[i].DepartmentName
                            } else {
                                testDepartmentName = UpdateData.department
                            }
                            console.log(i, '- Code', jsonData[i].ItemID, '- MRP', testOfferPrice);

                            await testModel.findOneAndUpdate(
                                // { test_name : jsonData[i].TestName },
                                { code: jsonData[i].ItemID },
                                {
                                    itdose_code: jsonData[i].ItemID,
                                    itdose_test_name: jsonData[i].TestName,
                                    itdose_offer_price: jsonData[i].Rate,
                                    itdose_department: jsonData[i].DepartmentName,

                                    code: testCode,
                                    test_name: testName,
                                    offer_price: testOfferPrice,
                                    mrp: testOfferPrice,
                                    department: testDepartmentName,

                                    // code: jsonData[i].ItemID,
                                    // test_name: jsonData[i].TestName,
                                    // mrp: jsonData[i].Rate,
                                    // offer_price: jsonData[i].Rate,
                                    // department: jsonData[i].DepartmentName,

                                    // test_url: finalURL.toLowerCase(),
                                    // meta_title: jsonData[i].TestName,
                                    // meta_desc: jsonData[i].TestName,
                                    // meta_keyword: jsonData[i].TestName,
                                    // search_tag: jsonData[i].TestName,
                                    // test_pre_test_info: jsonData[i].TestName,
                                    // specialityName: jsonData[i].TestName,
                                    // test_components: jsonData[i].TestName,
                                    // package_type : 'lab-test'
                                },
                                { upsert: true }
                            );
                        }
                        // else{
                        //     const document = {
                        //         itdose_code: jsonData[i].ItemID,
                        //         itdose_test_name: jsonData[i].TestName,
                        //         itdose_offer_price: jsonData[i].Rate,
                        //         itdose_department: jsonData[i].DepartmentName,

                        //         code: jsonData[i].ItemID,
                        //         test_name: jsonData[i].TestName,
                        //         mrp: jsonData[i].Rate,
                        //         offer_price: jsonData[i].Rate,
                        //         department: jsonData[i].DepartmentName,

                        //         test_url: finalURL.toLowerCase(),
                        //         meta_title: jsonData[i].TestName,
                        //         meta_desc: jsonData[i].TestName,
                        //         meta_keyword: jsonData[i].TestName,
                        //         search_tag: jsonData[i].TestName,
                        //         test_pre_test_info: jsonData[i].TestName,
                        //         specialityName: jsonData[i].TestName,
                        //         test_components: jsonData[i].TestName,
                        //         package_type: 'lab-test'
                        //     };
                        //     await testModel.insertOne(document);
                        // }
                    }
                    console.log('Test Update Prosess End....');
                });
            })
            .catch((error) => {
                console.log(error);
            });
    });
};



const updateTests = async (req, res) => {
    const { logger } = req;
    try {
        testUpdate();
        const obj = {
            res,
            msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
            status: Constant.STATUS_CODE.OK,
            data: {
                "status": "Success"
            }
        };
        return Response.success(obj);

    } catch (error) {
        console.log("error", error);
        return handleException(logger, res, error);
    }
};

module.exports = {
    testUpdate,
    updateTests,
};
