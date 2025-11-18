
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white">
        ตารางอาหารกลางวันเดือน
        <span className="text-cyan-400">พฤศจิกายน</span>
      </h1>
      <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
        เมนูอาหารกลางวันประจำเดือนพฤศจิกายนที่สร้างสรรค์โดย AI พร้อมภาพประกอบสวยงามในแต่ละวัน
      </p>
    </header>
  );
};

export default Header;
