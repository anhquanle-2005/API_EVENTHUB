# Sử dụng Node.js phiên bản 18 (hoặc bản bạn cần)
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json vào trước để cài thư viện
COPY package*.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ code còn lại vào
COPY . .

# Mở cổng 7860 cho Hugging Face
EXPOSE 7860

# Lệnh chạy server (Sửa 'index.js' thành tên file chính của bạn)
CMD [ "node", "src/index.js" ]