const axios = require('axios');

// Cấu hình API
const REQUIRED_API_KEY = 'khang';
const TARGET_URL = 'https://api.chkr.cc/';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Chỉ cho phép GET method
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      message: 'Chỉ hỗ trợ GET method'
    });
  }

  try {
    // Xử lý input
    const { key, data } = req.query;

    // Kiểm tra tham số bắt buộc
    if (!key || !data) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu tham số bắt buộc: key và data'
      });
    }

    // Xác thực API Key
    if (key !== REQUIRED_API_KEY) {
      return res.status(401).json({
        status: 'error',
        message: 'API key không hợp lệ'
      });
    }

    // Kiểm tra dữ liệu thẻ có rỗng không
    const cardData = data.trim();
    if (!cardData) {
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu thẻ không được để trống'
      });
    }

    // Chuẩn bị headers
    const headers = {
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
      'content-type': 'application/json; charset=UTF-8',
      'origin': 'https://chkr.cc',
      'priority': 'u=1, i',
      'referer': 'https://chkr.cc/',
      'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
    };

    // Chuẩn bị dữ liệu JSON
    const jsonData = {
      data: cardData,
      charge: false
    };

    // Thực hiện request đến API chkr.cc
    const response = await axios.post(TARGET_URL, jsonData, {
      headers: headers,
      timeout: 30000, // 30 giây
      validateStatus: function (status) {
        return status < 500; // Chấp nhận tất cả status codes < 500
      }
    });

    // Kiểm tra HTTP status code
    if (response.status >= 400) {
      return res.status(response.status).json({
        status: 'error',
        message: 'API chkr.cc trả về lỗi HTTP',
        http_code: response.status,
        response_body: response.data
      });
    }

    // Trả về kết quả từ API chkr.cc
    return res.status(200).json(response.data);

  } catch (error) {
    console.error('API Error:', error.message);
    
    // Xử lý các loại lỗi khác nhau
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        status: 'error',
        message: 'Request timeout - API chkr.cc không phản hồi trong thời gian chờ'
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        status: 'error',
        message: 'Không thể kết nối đến API chkr.cc',
        error_details: error.message
      });
    }

    // Lỗi khác
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi xử lý request',
      error_details: error.message
    });
  }
}; 