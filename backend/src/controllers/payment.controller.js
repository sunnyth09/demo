
import crypto from 'crypto';
import Order from '../models/sequelize/Order.js';

// Config lấy từ biến môi trường
const config = {
    vnp_TmnCode: process.env.VNP_TMN_CODE,
    vnp_HashSecret: process.env.VNP_HASH_SECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL
};

// Hàm sắp xếp tham số theo thứ tự a-z (yêu cầu bắt buộc của VNPay)
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export const createPaymentUrl = (req, res) => {
    try {
        let date = new Date();
        let createDate = 
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        let returnUrl = config.vnp_ReturnUrl;

        let orderId = req.body.orderId;
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;
        
        let locale = req.body.language;
        if(locale === null || locale === undefined || locale === ''){
            locale = 'vn';
        }
        
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl; 
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        if(bankCode !== null && bankCode !== '' && bankCode !== undefined){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = "";
        Object.keys(vnp_Params).forEach(key => {
            signData += key + "=" + vnp_Params[key] + "&";
        });
        signData = signData.slice(0, -1); 

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        
        vnp_Params['vnp_SecureHash'] = signed;
        
        let finalUrl = vnpUrl + "?" ;
        Object.keys(vnp_Params).forEach(key => {
            finalUrl += key + "=" + vnp_Params[key] + "&";
        })
        finalUrl = finalUrl.slice(0, -1);

        return res.status(200).json({ code: '00', data: finalUrl });
    } catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({ code: '99', message: 'Lỗi tạo link thanh toán' });
    }
};

export const vnpayReturn = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    let orderId = vnp_Params['vnp_TxnRef'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = config.vnp_HashSecret;

    let signData = "";
    Object.keys(vnp_Params).forEach(key => {
        signData += key + "=" + vnp_Params[key] + "&";
    });
    signData = signData.slice(0, -1);

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        const responseCode = vnp_Params['vnp_ResponseCode'];
        if (responseCode === "00") {
             // Cập nhật trạng thái đơn hàng thành 'paid'
             try {
                await Order.update({ payment_status: 'paid' }, {
                    where: { id: orderId }
                });
             } catch (error) {
                 console.error('Error updating order status:', error);
             }
             res.status(200).json({code: responseCode, message: 'Giao dịch thành công', data: vnp_Params});
        } else {
             // Có thể cập nhật 'failed' nếu muốn
             res.status(200).json({code: responseCode, message: 'Giao dịch thất bại / Huỷ bỏ', data: vnp_Params});
        }
    } else {
        res.status(200).json({code: '97', message: 'Chữ ký không hợp lệ'});
    }
};

export const vnpayIpn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    
    let secretKey = config.vnp_HashSecret;
    let signData = "";
    Object.keys(vnp_Params).forEach(key => {
        signData += key + "=" + vnp_Params[key] + "&";
    });
    signData = signData.slice(0, -1);
    
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    if(secureHash === signed){ 
        // Kiểm tra order có tồn tại không
        const order = await Order.findByPk(orderId);
        if(!order){
             return res.status(200).json({RspCode: '01', Message: 'Order not found'});
        }

        // Kiểm tra số tiền (Optional: check amount match)
        // const checkAmount = order.total_amount * 100 == vnp_Params['vnp_Amount'];
        // if(!checkAmount) return res.status(200).json({RspCode: '04', Message: 'Amount invalid'});

        // Kiểm tra trạng thái đơn hàng hiện tại
        if(order.payment_status === 'paid'){
             return res.status(200).json({RspCode: '02', Message: 'Order already confirmed'});
        }

        if (rspCode=="00") {
            console.log(`VNPay IPN: Payment Success for Order ${orderId}`);
            // Cập nhật trạng thái đơn hàng thành 'paid'
            await order.update({ payment_status: 'paid' });
            res.status(200).json({RspCode: '00', Message: 'Success'});
        } else {
            console.log(`VNPay IPN: Payment Failed for Order ${orderId}`);
            // Có thể cập nhật 'failed'
             await order.update({ payment_status: 'failed' });
            res.status(200).json({RspCode: '00', Message: 'Success'});
        }
    } else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'});
    }
  } catch (error) {
    console.error("VNPay IPN Error:", error);
    return res.status(200).json({RspCode: '99', Message: 'Internal error'});
  }
};
