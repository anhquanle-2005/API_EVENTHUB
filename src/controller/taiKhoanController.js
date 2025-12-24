const tk = require("../model/taiKhoan");
const nodemailer = require("nodemailer");
const otpStore = require("../service/otpStore");

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: 'ntmanh@ntmanh.io.vn',
    user: "thanhmanhdangfa@gmail.com",
    pass: "qsts olie vhpg mwtb",
  },
});
class taiKhoanController {
  async index(req, res) {
    try {
      const data = req.body;
      const taikhoan = await tk.Login(data);
      if (taikhoan && taikhoan.length > 0) {
        res.json({ taikhoan: taikhoan[0] });
      } else {
        res.status(401).json({ message: "Sai tài khoản" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  async sendOtp(req, res) {
    try {
      const email = String(req.body.email || "").trim();
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email khong hop le" });
      }
      const taikhoan = await tk.findByEmail(email);
      if (!taikhoan || taikhoan.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Khong tim thay tai khoan" });
      }

      const otp = otpStore.generateOtp();
      otpStore.saveOtp(email, otp);

      try {
        await mailer.sendMail({
          from: '"EventHub" <ntmanh@ntmanh.io.vn>',
          to: email,
          subject: "Ma OTP EventHub",
          text: `Ma OTP cua ban la: ${otp}. Ma co hieu luc 5 phut.`,
          html: `<p>Ma OTP cua ban la: <b>${otp}</b>.</p><p>Ma co hieu luc 5 phut.</p>`,
        });
      } catch (error) {
        otpStore.clearOtp(email);
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Khong gui duoc OTP" });
      }

      return res.json({ success: true, message: "Da gui OTP" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Loi server" });
    }
  }

  async verifyOtp(req, res) {
    try {
      const email = String(req.body.email || "").trim();
      const otp = String(req.body.otp || "").trim();
      if (!email || !otp) {
        return res
          .status(400)
          .json({ success: false, message: "Thieu thong tin" });
      }

      const result = otpStore.verifyOtp(email, otp);
      if (!result.ok) {
        const message =
          result.reason === "expired" ? "OTP da het han" : "OTP khong dung";
        return res.status(400).json({ success: false, message });
      }

      return res.json({ success: true, message: "OTP hop le" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Loi server" });
    }
  }

  async resetPassword(req, res) {
    try {
      const email = String(req.body.email || "").trim();
      const newPassword = String(req.body.newPassword || "").trim();
      if (!email || !newPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Thieu thong tin" });
      }

      const entry = otpStore.getVerifiedEntry(email);
      if (!entry) {
        return res
          .status(400)
          .json({ success: false, message: "OTP chua xac thuc hoac het han" });
      }

      const updated = await tk.updatePasswordByEmail(email, newPassword);
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Khong tim thay tai khoan" });
      }

      otpStore.clearOtp(email);
      return res.json({ success: true, message: "Doi mat khau thanh cong" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Loi server" });
    }
  }
  async diemtichluy (req, res){
    try {
      const ma = req.params.id;
      const diem = await tk.diemtichluy(ma)
      console.log(diem[0]);
      res.json(diem[0]);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Loi server" });
    }
  }
}
module.exports = new taiKhoanController();
