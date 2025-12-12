import React from 'react';
import { Gauge } from '@ant-design/plots'; // Lưu ý là dùng plots nhé
import { Path } from '@antv/g';

// Hàm lấy tọa độ trung tâm (Giữ nguyên logic toán học)
function getOrigin(points) {
    if (points.length === 1) return points[0];
    const [[x0, y0, z0 = 0], [x2, y2, z2 = 0]] = points;
    return [(x0 + x2) / 2, (y0 + y2) / 2, (z0 + z2) / 2];
}

// TẠO HÌNH DÁNG CÂY KIM (Custom Pointer)
const customShape = (style) => {
    return (points, value, coordinate, theme) => {
        // 1. Lấy tọa độ tâm của biểu đồ
        const [x, y] = getOrigin(points);
        const [cx, cy] = coordinate.getCenter();

        // 2. Tính góc nghiêng của kim dựa trên giá trị (Toán lượng giác đó đệ!)
        const angle = Math.atan2(y - cy, x - cx);
        const length = 120; // Độ dài kim (Huynh tăng lên xíu cho đẹp)
        const width = 10;   // Độ rộng đuôi kim

        // 3. Vẽ hình tam giác cho cây kim
        return new Path({
            style: {
                d: [
                    ['M', cx + Math.cos(angle) * length, cy + Math.sin(angle) * length], // Đỉnh kim
                    ['L', cx + Math.cos(angle + Math.PI / 2) * width, cy + Math.sin(angle + Math.PI / 2) * width], // Góc trái đuôi
                    ['L', cx + Math.cos(angle - Math.PI / 2) * width, cy + Math.sin(angle - Math.PI / 2) * width], // Góc phải đuôi
                    ['Z'], // Đóng đường vẽ lại
                ],
                fill: '#D81B60', // Đổi màu kim thành HỒNG ĐẬM cho lãng mạn
                stroke: '#FFFFFF', // Viền trắng cho nổi
                lineWidth: 2,
            },
        });
    };
};

const PercentSuccess = ({score }) => {
    const config = {
        data: {
            target: score,    // Điểm số tình yêu (Ví dụ: 85%)
            total: 20,    // Thang điểm 100
            name: 'love-score',
        },
        style: {
            pointerShape: customShape, // Dùng cái kim mình vừa vẽ
            pinShape: false, // Bỏ cái chốt tròn ở giữa đi cho thoáng

            // Chỉnh nội dung chữ ở giữa
            textContent: (target, total) => {
                return `Chính xác:\n${Math.round((target / total) * 100)}%`;
            },
            // Chỉnh font chữ to rõ
            textStyle: {
                fill: '#5D4037', // Màu nâu đất huynh tư vấn lúc nãy
                fontSize: 24,
                fontWeight: 'bold',
            },
        },
        // Màu của vòng cung (Gradient từ hồng nhạt sang hồng đậm)
        color: ['#FCE4EC', '#F06292', '#D81B60'],
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Gauge {...config} />
        </div>
    );
};

export default PercentSuccess;