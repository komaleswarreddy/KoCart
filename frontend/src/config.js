const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api',
  razorpayKeyId: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_RHdtW834rSPbtb'
};

export default config;
